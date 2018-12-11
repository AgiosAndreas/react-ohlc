import { all, fork, put, takeEvery } from 'redux-saga/effects'
import { ActionTypes } from './types'
import { fetchError, fetchCompleted } from './actions'
import { AnyAction } from 'redux'
import { chunk, range, flatten } from 'lodash'
import * as fetchJsonp from 'fetch-jsonp'

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001'

function fetchData (year: number) {

  return fetchJsonp(
    `${API_ENDPOINT}/${year}`
  ).then(
    res => {
      return res.json()
    }
  )
}

function* handleFetch (action: AnyAction) {
  const { startYear, endYear } = action.payload

  const pairs = chunk(range(startYear, endYear + 1), 2)

  const result = []

  try {

    while (pairs.length) {
      const pair = pairs.shift()
      result.push(yield all(pair!.map(fetchData)))
    }

    yield put(fetchCompleted(flatten(result)))

  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err.message))
    } else {
      yield put(fetchError('An unknown error occured.'))
    }
  }
}

function* watchFetchRequest () {
  yield takeEvery(ActionTypes.FetchRequest, handleFetch)
}

function* rootSaga () {
  yield all([fork(watchFetchRequest)])
}

export default rootSaga
