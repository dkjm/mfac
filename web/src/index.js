import React from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter, Router, Route } from 'react-router-dom';
// using module to hold history object
// so it can be accessed from anywhere in
// app (e.g. in action creators)
import history from './history';
import configureStore from './store';
import { Provider } from 'react-redux';


let store = configureStore();

render(
  <Provider store={store}>
  	<Router history={history}>
    	<App />
    </Router>
  </Provider>,
  document.getElementById('root')
)