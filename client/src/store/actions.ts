import { action } from 'typesafe-actions'
import { ActionTypes, ApiResponse } from './types'

export const changeStartYear = (startYear?: number) =>
  action(ActionTypes.ChangeStartYear, startYear)

export const changeEndYear = (endYear?: number) =>
  action(ActionTypes.ChangeEndYear, endYear)

export const fetchRequest = (startYear: number, endYear: number) =>
  action(ActionTypes.FetchRequest, { startYear, endYear })

export const fetchError = (error: any) => action(ActionTypes.FetchError, error)

export const chunkFetchCompleted = (data: ApiResponse) => action(ActionTypes.ChunkFetchCompleted, data)

export const fetchCompleted = (data: ApiResponse[]) => action(ActionTypes.FetchCompleted, data)
