export enum ActionTypes {
  ChangeStartYear = 'CHANGE_START_YEAR',
  ChangeEndYear = 'CHANGE_END_YEAR',
  FetchRequest = 'FETCH_REQUEST',
  FetchError = 'FETCH_ERROR',
  FetchCompleted = 'FETCH_COMPLETED',
  ChunkFetchCompleted = 'CHUNK_FETCH_COMPLETED'
}

export interface AppState {
  minYear: number
  maxYear: number
  startYear?: number
  endYear?: number
  loading: boolean
  error?: any
  data: ApiResponse[]
}

export interface OhlcData {
  l: number
  h: number
  s: number
  e: number
}

export interface ApiResponse {
  status: number
  ohlc: OhlcData[]
}
