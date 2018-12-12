import * as React from 'react'
import * as actions from '../store/actions'

export interface Props {
  readonly loading: boolean
  readonly minYear: number
  readonly maxYear: number
  readonly startYear?: number
  readonly endYear?: number
  readonly readyToFetch: boolean
  readonly changeStartYear: typeof actions.changeStartYear
  readonly changeEndYear: typeof actions.changeEndYear
  readonly fetchRequest: typeof actions.fetchRequest
}

class Filter extends React.Component<Props> {
  render () {
    return (
      <div className='Filter'>
        <input
          type='text'
          disabled={this.props.loading}
          onChange={this.onStartYearChange}
          placeholder={this.props.minYear.toString()}
        />
        -
        <input
          type='text'
          disabled={this.props.loading}
          onChange={this.onEndYearChange}
          placeholder={this.props.maxYear.toString()}
        />
        <button disabled={!this.props.readyToFetch} onClick={this.fetchRequest}>
          Load
        </button>
      </div>
    )
  }

  onStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = this.parseYear(e.target.value, this.props.minYear)
    this.props.changeStartYear(year)
  }

  onEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = this.parseYear(e.target.value, this.props.maxYear)
    this.props.changeEndYear(year)
  }

  fetchRequest = () => {
    this.props.fetchRequest(this.props.startYear!, this.props.endYear!)
  }

  parseYear (value: string, defaultYear: number): number | undefined {
    if (value.trim().length === 0) {
      return defaultYear
    }

    return Number(value)
  }
}

export default Filter
