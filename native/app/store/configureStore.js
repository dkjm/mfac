import { 
	createStore, 
	applyMiddleware, 
	compose,
	combineReducers,
} from 'redux';

import thunk from 'redux-thunk';
import {reducer as formReducer} from 'redux-form';

import {
  meetingReducer, 
} from '../services/api';

import {reducer as uiReducer} from '../services/ui';
import {reducer as sessionReducer} from '../services/session';

const rootReducer = combineReducers({
  form: formReducer,
  session: sessionReducer,
  meetings: meetingReducer,
  ui: uiReducer,
})


// export default () => {
//   let store = createStore(
//     rootReducer,
//     compose(
//       applyMiddleware(
//         thunk
//       ),
//     )
//   );
//   return store;
// }



export default configureStore = (initialState) => {
  let store = createStore(
    rootReducer,
    compose(
      applyMiddleware(
        thunk
      ),
    )
  );

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../services', () => {
  //     const nextRootReducer = rootReducer;
  //     store.replaceReducer(nextRootReducer);
  //   });
  //   store.replaceReducer(rootReducer);
  // }

  return store;
}