import React from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import App from './components/App';

import history from './history';
import configureStore from './configureStore';


let {store, persistor} = configureStore();

render(
  <Provider store={store}>
  	<PersistGate loading={null} persistor={persistor}>
	  	<Router history={history}>
	    	<App />
	    </Router>
	  </PersistGate>
  </Provider>,
  document.getElementById('root')
)