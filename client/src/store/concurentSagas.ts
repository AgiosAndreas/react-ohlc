import { all, fork, put, call, take, takeEvery, race, cancel } from 'redux-saga/effects'
import { channel, buffers, Channel } from 'redux-saga'
import { ActionTypes, ApiResponse } from './types'
import { fetchError, chunkFetchCompleted, fetchCompleted } from './actions'
import { AnyAction } from 'redux'
import * as fetchJsonp from 'fetch-jsonp'

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001'
const WORKERS_COUNT = 2

interface JobsChannel extends Channel< { payload: number } > {}

function fetchData (year: number) {
  return fetchJsonp(
    `${API_ENDPOINT}/${year}`
  ).then(
    res => res.json()
  )
}

const workerFactory = (workerId: number) =>
function* worker (jobs: JobsChannel) {
  while (true) {
    const { payload } = yield take(jobs)
    // process the request
    try {
      const data: ApiResponse = yield call(fetchData, payload)

      console.log(`Worker ${workerId}`)
      yield put(chunkFetchCompleted(data))
    } catch (err) {
      // cancel jobs
      if (err instanceof Error) {
        yield put(fetchError(err.message))
      } else {
        yield put(fetchError('An unknown error occured.'))
      }
    }
  }
}

function* initQueue (concurency: number) {
  const jobs: JobsChannel = yield call(channel, buffers.expanding())

  function* watcher () {
    for (let i = 1; i <= concurency; i++) {
      yield fork(workerFactory(i), jobs)
    }
  }

  return {
    watcher,
    jobs
  }
}

function* handleFetch (action: AnyAction) {
  const { startYear, endYear } = action.payload

  const { watcher, jobs } = yield initQueue(WORKERS_COUNT)

  const workerTask = yield fork(watcher)

  // create jobs from request
  const totalTasks = endYear - startYear + 1
  for (let year = startYear; year <= endYear; year++) {
    yield put(jobs, { payload: year })
  }

  let data: ApiResponse[] = []
  while (true) {
    const { chunkFetchCompleted, fetchError } = yield race({
      chunkFetchCompleted: take(ActionTypes.ChunkFetchCompleted),
      fetchError: take(ActionTypes.FetchError)
    })

    if (chunkFetchCompleted) {
      data.push(chunkFetchCompleted.payload)

      if (totalTasks === data.length) {
        yield cancel(workerTask)
        yield put(fetchCompleted(data))
        return
      }
    }

    if (fetchError) {
      yield cancel(workerTask)
      return
    }
  }
}

function* watchFetchRequest () {
  yield takeEvery(ActionTypes.FetchRequest, handleFetch)
}

function* concurentSaga () {
  yield all([fork(watchFetchRequest)])
}

export default concurentSaga
