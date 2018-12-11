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
  switch (action.type) {
    case ActionTypes.FetchRequest:
      return { ...state, loading: true, error: null, data: [] }

    case ActionTypes.FetchError:
      return { ...state, loading: false, error: action.payload }

    case ActionTypes.FetchCompleted:
      return { ...state, loading: false, data: action.payload }

    case ActionTypes.ChangeStartYear: {
      return { ...state, startYear: action.payload, data: [] }
    }

    case ActionTypes.ChangeEndYear: {
      return { ...state, endYear: action.payload, data: [] }
    }
  }
  return state
}
