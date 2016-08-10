import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import Redbox from 'redbox-react'

import configureStore from './configureStore'
import App from './App'

let reactRoot = document.getElementById('react_root')

const store = configureStore()

render(
  <AppContainer errorReporter={Redbox}>
    <App store={store} />
  </AppContainer>,
  reactRoot
)
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(
      (<AppContainer errorReporter={Redbox}>
        <NextApp store={store} />
      </AppContainer>),
      reactRoot
    )
  })
}
