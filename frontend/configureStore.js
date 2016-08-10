import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/rootReducer'

const configureStore = () => {
  const store = createStore(
    rootReducer,
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(thunk),
  )

  if (module.hot) {
    module.hot.accept('./reducers/rootReducer', () => {
      return store.replaceReducer(require('./reducers/rootReducer').default)
    })
  }

  return store
}

export default configureStore
