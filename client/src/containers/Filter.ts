import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Filter from '../components/Filter'
import * as actions from '../store/actions'
import { AppState } from '../store/types'

interface StateProps {
  minYear: number
  maxYear: number
  readyToFetch: boolean
  loading: boolean
  startYear?: number
  endYear?: number
}

interface DispatchProps {
  changeStartYear: typeof actions.changeStartYear
  changeEndYear: typeof actions.changeEndYear
  fetchRequest: typeof actions.fetchRequest
}

function mapStateToProps (state: AppState): StateProps {
  const { startYear, endYear, minYear, maxYear, loading } = state

  const readyToFetch =
    startYear !== undefined &&
    minYear <= startYear &&
    startYear <= maxYear &&
    endYear !== undefined &&
    minYear <= endYear &&
    endYear <= maxYear &&
    startYear <= endYear &&
    !loading // we are not ready to another fetch

  return { minYear, maxYear, readyToFetch, loading, startYear, endYear }
}

function mapDispatchToProps (dispatch: Dispatch): DispatchProps {
  return {
    changeStartYear: (year?: number) => dispatch(actions.changeStartYear(year)),
    changeEndYear: (year?: number) => dispatch(actions.changeEndYear(year)),
    fetchRequest: (startYear, endYear) =>
      dispatch(actions.fetchRequest(startYear, endYear))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter)
