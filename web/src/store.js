import { 
	createStore, 
	applyMiddleware, 
	compose,
	combineReducers,
} from 'redux';

import thunk from 'redux-thunk';
import { reducer as formReducer } from 'redux-form';

import {reducer as topicReducer} from './services/api';
import {reducer as uiReducer} from './services/ui';


const rootReducer = combineReducers({
  form: formReducer,
  topics: topicReducer,
  ui: uiReducer,
})


const configureStore = (preloadedState) => {

  // doing below conditional because 
  // safari won't render app if redux devtools
  // is included in compose function.  Must
  // check for Chrome
  // ** 180127 - above is not applicable as 
  // app is currently not using redux devtools.
  let store;

  if (window.navigator.userAgent.includes('Chrome')) {
    store = createStore(
      rootReducer,
      compose(
        applyMiddleware(
          thunk,
        )
      )
    ) 
  }

  else {
    store = createStore(
      rootReducer,
      compose(
        applyMiddleware(
          thunk,
        )
      )
    )
  }
  

  return store;
}

export default configureStore;