import React from 'react'
import {Route, IndexRoute} from 'react-router'

import Index from './components/routes/index'
import Start from './components/routes/start'
import Content from './components/routes/content'

const routes = (
  <Route component={Content} path="/">
    <IndexRoute component={Index} />
    <Route component={Start} path="start" />
  </Route>
)

export default routes
