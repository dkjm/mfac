import axios from 'axios';

import * as selectors from '../selectors';
import {toggleSnackbar} from '../services/ui';
import history from '../history';


export const LOAD_TOPICS = 'LOAD_TOPICS';
export const UPDATE_TOPIC = 'UPDATE_TOPIC';
export const POST_TOPIC = 'POST_TOPIC';
export const RECEIVE_TOPIC = 'RECEIVE_TOPIC';
export const UPDATE_VOTE_COUNTS = 'UPDATE_VOTE_COUNTS';
export const POST_VOTE = 'POST_VOTE';


export const loadTopics = (params = {}) => (dispatch, getState) => {

	const endpoint = "http://localhost:8000/topics/";

  return axios.get(endpoint)
  .then(response => {
      const action = {
        type: LOAD_TOPICS,
        topics: response.data,
      }
      return dispatch(action);
    })
}


export const connectMeetingSocket = (meeting_id) => (dispatch, getState) => {

  let socket = new WebSocket(`ws://localhost:8000/meetings/${meeting_id}/`);

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    //console.log('onmessage', data)
    // also reeiving event 'add_vote'
    // which is called whenever a vote for a
    // topic related to this meeting channel
    // group is posted.  Not doing anything with
    // it currently.

    if (data.event === 'update_vote_counts') {
      const action = {
        type: UPDATE_VOTE_COUNTS,
        data: data,
      }
      dispatch(action);
    }

    else if (data.event === 'add_topic') {
      const action = {
        type: RECEIVE_TOPIC,
        data: data,
      }
      dispatch(action);
    }
  }

  socket.onopen = function() {

  }
  // Call onopen directly if socket is already open
  if (socket.readyState === WebSocket.OPEN) socket.onopen();
  return socket;
}


export const postVote = (topic_id, vote_type) => (dispatch, getState) => {

  const endpoint = `http://localhost:8000/topics/topic_id=${topic_id}&vote_type=${vote_type}/`;

  const state = getState();
  const topic = selectors.getTopic(state, {topic_id})

  // in case for whatever reason topic is null
  if (!topic) {return};

  let vote_action;

  if (topic.votes.user_vote === vote_type) {
    vote_action = 'delete_vote';
  }
  else {
    vote_action = 'post_vote';
  }

  if (vote_action === 'delete_vote') {
    return axios.delete(endpoint)
    .then(response => {
      const action = {
        type: POST_VOTE,
        data: response.data,
      }
      dispatch(action);
    })
  }

  else {
    return axios.post(endpoint)
    .then(response => {
      const action = {
        type: POST_VOTE,
        data: response.data,
      }
      dispatch(action);
    })
  }

}



export const submitTopicForm = (params = {}) => (dispatch, getState) => {
  // TODO:  receive 'meeting_id' as param and 
  // include that in endpoint url so that topic
  // is attached so something
  //const {data} = params;
  const {
    meeting_id,
    topic_id,
    intent,
    values,
  } = params

  const data = {
    ...values,
  }

  // <intent> will be either "update"
  // or "create".  Endpoint depends on which

  // TODO: enpdoint urls need to be fixed
  // to work with Django url scheme.  
  // Notice that 'update' url has no trailing slash,
  // but 'create' does.  Django will complain
  // if you don't send requests like this,
  // mainly because the current routing setup
  // for handling params is fucked up.
  // see in Django project st/urls.py
  const endpoint = intent === 'update'
    ? `http://localhost:8000/topics/${topic_id}`
    : 'http://localhost:8000/topics/'

  const successMessage = intent === 'update'
    ? 'Topic updated successfully.'
    : 'Topic created successfully.'

  return axios.post(endpoint, data)
    .then(response => {
        // ** currently not handling response
        // here (i.e. not adding topic from
        // response to store).  New data
        // comes in via websocket as 
        // RECEIVE_TOPIC action
        history.goBack();
        const snackbarParams = {
          open: true,
          message: successMessage,
        }
        // opening snackbar in timeout
        // because it looks alittle smoother 
        // and prevents some jank when
        // navigating back to previous screen
        // after form submit
        setTimeout(() => {
          dispatch(toggleSnackbar(snackbarParams));
        }, 300)
      })
}





const initialState = {
  cache: {},
}


export const reducer = (state = initialState, action) => {
  switch (action.type) {

    case (LOAD_TOPICS): {
      const {topics} = action;
      const obj = {};
      topics.forEach(t => obj[t.id] = t);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }


    case UPDATE_VOTE_COUNTS: {
      const {event, topics} = action.data;
      const updatedCache = {};

      topics.forEach(t => {
        const topic  = state.cache[t.id];
        if (topic) {  
          const updatedTopic = {
            ...topic,
            votes: {
              ...topic.votes,
              ...t.votes,
            }
          }
          updatedCache[topic.id] = updatedTopic;
        }
      })

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          ...updatedCache,
        }
      }
      return nextState;
    }


    case RECEIVE_TOPIC: {
      const {event, topic} = action.data;
      let updatedTopic = state.cache[topic.id];
      // if topic already exists in cache, merge objects
      if (updatedTopic) {
        updatedTopic = {
          ...updatedTopic,
          ...topic,
        }
      }
      // else set to received data
      else {
        updatedTopic = topic;
      }

      const updatedCache = {
        ...state.cache,
        [topic.id]: updatedTopic,
      }

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          ...updatedCache,
        }
      }  
      return nextState;
    }


    case POST_VOTE: {
      const {event, topic_id, votes} = action.data;
      // get topic to update.  If doesn't
      // exist for some reason, return current state
      const topic  = state.cache[topic_id];
      if (!topic) {return state};

      const updatedTopic = {
        ...topic,
        votes: {
          ...topic.votes,
          ...votes,
        },
      }

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [topic_id]: updatedTopic,
        }
      }
      return nextState;
    }


    default: {
      return state;
    }
  }
}
