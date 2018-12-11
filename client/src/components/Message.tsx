import * as React from 'react'

export interface Props {
  readonly visible: boolean
  readonly message?: string
}

export class Message extends React.Component<Props> {
  render () {
    if (!this.props.visible) {
      return null
    }

    return <div className='Message'>{this.props.message}</div>
  }
}
