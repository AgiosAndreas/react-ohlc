import { Reducer } from 'redux'
import { AppState, ActionTypes } from './types'

const intialState: AppState = {
  minYear: 2010,
  maxYear: new Date().getFullYear(),

  startYear: 2010,
  endYear: new Date().getFullYear(),

  loading: false,
  error: null,
  data: []
}

export const rootReducer: Reducer<AppState> = (state = intialState, action) => {
  console.log(action.type)
  console.log(JSON.stringify(action.payload))
  switch (action.type) {
    case ActionTypes.ChunkFetchCompleted:
      const data = state.data.slice().concat(action.payload)
      return { ...state, loading: true, error: null, data }

    case ActionTypes.FetchRequest:
      return { ...state, loading: true, error: null, data: [] }

    case ActionTypes.FetchError:
      return { ...state, loading: false, error: action.payload, data: [] }

    case ActionTypes.FetchCompleted:
      return { ...state, loading: false, data: action.payload }

    case ActionTypes.ChangeStartYear:
      return { ...state, startYear: action.payload, data: [], error: null }

    case ActionTypes.ChangeEndYear:
      return { ...state, endYear: action.payload, data: [], error: null }
  }
  return state
}
