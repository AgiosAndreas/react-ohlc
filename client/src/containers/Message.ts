import { connect } from 'react-redux'
import { Message } from '../components/Message'
import { AppState } from '../store/types'

interface StateProps {
  message?: string
  visible: boolean
}

export function mapStateToProps (state: AppState): StateProps {
  const message = stateToMessage(state)
  const visible = message.length !== 0

  return { visible, message }
}

function stateToMessage (state: AppState) {
  if (state.loading) {
    return 'Loading...'
  }

  if (state.error) {
    return `Error occured. ${state.error}`
  }

  if (state.data.length) {
    const stat = state.data
      .map((res) => res.ohlc)
      .reduce((acc,rows) => acc.concat(rows))
      .reduce((acc, row) => {
        acc.h = Math.max(acc.h, row.h)
        acc.l = Math.min(acc.l, row.l)
        return acc
      }, { h: Number.MIN_VALUE, l: Number.MAX_VALUE })

    return `High ${stat.h} Low ${stat.l}`
  }

  return ''
}

export default connect(mapStateToProps)(Message)
