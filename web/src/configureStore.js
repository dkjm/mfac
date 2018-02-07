import { 
	createStore, 
	applyMiddleware, 
	compose,
	combineReducers,
} from 'redux';

import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';
import {reducer as formReducer} from 'redux-form';

import {
  meetingReducer, 
  agendaItemReducer,
  meetingInvitationReducer,
  meetingParticipantReducer,
  topicReducer,
} from './services/api';
import {reducer as uiReducer} from './services/ui';
import {reducer as sessionReducer} from './services/session';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['form', 'session', 'ui'],
}

const rootReducer = combineReducers({
  form: formReducer,
  session: sessionReducer,
  meetings: meetingReducer,
  agendaItems: agendaItemReducer,
  meetingInvitations: meetingInvitationReducer,
  meetingParticipants: meetingParticipantReducer,
  topics: topicReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(
        thunk
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  let persistor = persistStore(store);
  return {store, persistor};
}