import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import { Router, BrowserRouter } from 'react-router'
import { BrowserRouter, Router, Route } from 'react-router-dom'
// using module to hold history object
// so it can be accessed from anywhere in
// app (e.g. in action creators)
import history from './history';

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store';


let store = configureStore()

render(
  <Provider store={store}>
  	<Router history={history}>
    	<App />
    </Router>
  </Provider>,
  document.getElementById('root')
)