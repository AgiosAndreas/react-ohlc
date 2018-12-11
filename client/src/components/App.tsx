import * as React from 'react'
import Filter from '../containers/Filter'
import Message from '../containers/Message'

class App extends React.Component {
  public render () {
    return (
      <div className='App'>
        <Message />
        <Filter />
      </div>
    )
  }
}

export default App
