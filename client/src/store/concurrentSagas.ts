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

function* worker (jobs: JobsChannel) {
  while (true) {
    // ждем задачи
    const { payload } = yield take(jobs)

    try {
      // получаем данные и передаем их
      const data: ApiResponse = yield call(fetchData, payload)
      yield put(chunkFetchCompleted(data))
    } catch (err) {
      // останавливаем обработку
      if (err instanceof Error) {
        yield put(fetchError(err.message))
      } else {
        yield put(fetchError('An unknown error occured.'))
      }
    }
  }
}

function* initQueue (workers: number) {
  // создаем канал, куда будем передавать задачи на обработку
  const jobs: JobsChannel = yield call(channel, buffers.expanding())

  function* startQueue () {
    for (let i = 0; i < workers; i++) {
      yield fork(worker, jobs)
    }
  }

  return { startQueue, jobs }
}

function* handleFetch (action: AnyAction) {
  const { startYear, endYear } = action.payload

  const { startQueue, jobs } = yield initQueue(WORKERS_COUNT)

  const queueTask = yield fork(startQueue)

  const totalTasks = endYear - startYear + 1
  for (let year = startYear; year <= endYear; year++) {
    yield put(jobs, { payload: year })
  }

  let dataBuffer: ApiResponse[] = []
  while (true) {
    // ждем данные или ошибку
    const { chunkFetchCompleted, fetchError } = yield race({
      chunkFetchCompleted: take(ActionTypes.ChunkFetchCompleted),
      fetchError: take(ActionTypes.FetchError)
    })

    // Данные готовы
    if (chunkFetchCompleted) {
      dataBuffer.push(chunkFetchCompleted.payload)

      // Обработка завершена?
      if (totalTasks === dataBuffer.length) {
        yield cancel(queueTask)
        yield put(fetchCompleted(dataBuffer))
        return
      }
    }

    // Произошла ошибка
    if (fetchError) {
      yield cancel(queueTask)
      return
    }
  }
}

function* watchFetchRequest () {
  yield takeEvery(ActionTypes.FetchRequest, handleFetch)
}

function* concurrentSagas () {
  yield all([fork(watchFetchRequest)])
}

export default concurrentSagas
