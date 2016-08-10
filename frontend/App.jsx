import React from 'react'
import {Router} from 'react-router'
import {Provider} from 'react-redux'
import {browserHistory} from 'react-router'

import routes from './routes'

const App = (props) => {
  return (<Provider store={props.store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>)
}

App.propTypes = {
  store: React.PropTypes.object.isRequired,
}

export default App
