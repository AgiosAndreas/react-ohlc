import { Store, createStore, applyMiddleware } from 'redux'
import { AppState } from './types'
import createSagaMiddleware from 'redux-saga'
import { rootReducer } from './reducers'
import rootSaga from './sagas'

export function configureStore (): Store<AppState> {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

  sagaMiddleware.run(rootSaga)

  return store
}
