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
  let message = ''

  if (state.loading) {
    message = 'Loading...'
  }

  if (state.error) {
    message = `Error occured. ${state.error}`
  }

  if (state.data.length) {
    // TODO выводить результат подсчета
  }

  return message
}

export default connect(mapStateToProps)(Message)
