import axios from 'axios';

import * as selectors from './selectors';

import {
  divideVotes, 
  isUserOwnerOfVote,
  hasUserVotedForType,
} from './utils';

import {toggleSnackbar} from './services/ui';

import history from './history';

const actionTypes = {
	LOAD_TOPICS: 'LOAD_TOPICS',
	UPDATE_TOPIC: 'UPDATE_TOPIC',
	CHANGE_VOTE: 'CHANGE_VOTE',
  POST_TOPIC: 'POST_TOPIC',
  RECEIVE_TOPIC: 'RECEIVE_TOPIC',
  UPDATE_VOTE_COUNTS: 'UPDATE_VOTE_COUNTS',
  POST_VOTE: 'POST_VOTE',
}

const loadTopics = (params = {}) => (dispatch, getState) => {

	const endpoint = "http://localhost:8000/topics/";

  return axios.get(endpoint)
  .then(response => {
      //console.log('resolved', response);
      // const topics = response.data.map(t => {
      //   const {up, down, meh} = divideVotes(t.votes)
      //   // copy object and update
      //   // properties
      //   const updated = {
      //     ...t,
      //     up_votes: up,
      //     down_votes: down,
      //     meh_votes: meh,
      //   };
      //   return updated;
      // })
      // const action = {
      // 	type: actionTypes.LOAD_TOPICS,
      // 	topics: topics,
      // }
      const action = {
       type: actionTypes.LOAD_TOPICS,
       topics: response.data,
      }
      return dispatch(action);
    })
}



const socketConnect = (topic_id, socket) => (dispatch, getState) => {
	//let socket = new WebSocket(`ws://localhost:8000/topics/${topic_id}/`);
	socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    //console.log('data', data);
    const action = {
    	type: actionTypes.CHANGE_VOTE,
    	data: data,
    }
    dispatch(action);
	}
	socket.onopen = function() {

	}
	// Call onopen directly if socket is already open
	if (socket.readyState === WebSocket.OPEN) socket.onopen();
	//return socket;
}

const makeSocketConnect = (topic_id) => {
	let socket = new WebSocket(`ws://localhost:8000/topics/${topic_id}/`);
	//console.log('=== makeSocketConnect', topic_id)
	return () => socketConnect(topic_id, socket);
}


const socketConnectNoClosure = (topic_id) => (dispatch, getState) => {
	//console.log(topic_id)
	let socket = new WebSocket(`ws://localhost:8000/topics/${topic_id}/`);

	socket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    if (data.event === 'update_vote_counts') {
      const action = {
        type: actionTypes.UPDATE_VOTE_COUNTS,
        data: data,
      }
      dispatch(action);
    }
    else {
      const action = {
        type: actionTypes.CHANGE_VOTE,
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

const connectMeetingSocket = (meeting_id) => (dispatch, getState) => {

  let socket = new WebSocket(`ws://localhost:8000/meetings/${meeting_id}/`);

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    console.log('onmessage', data)
    // also reeiving event 'add_vote'
    // which is called whenever a vote for a
    // topic related to this meeting channel
    // group is posted.  Not doing anything with
    // it currently.

    if (data.event === 'update_vote_counts') {
      const action = {
        type: actionTypes.UPDATE_VOTE_COUNTS,
        data: data,
      }
      dispatch(action);
    }

    else if (data.event === 'add_topic') {
      const action = {
        type: actionTypes.RECEIVE_TOPIC,
        data: data,
      }
      dispatch(action);
    }
  }

  socket.onopen = function() {
    console.log('=== on open')
  }
  // Call onopen directly if socket is already open
  if (socket.readyState === WebSocket.OPEN) socket.onopen();
  return socket;
}


const postVote = (topic_id, vote_type) => (dispatch, getState) => {

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
        type: actionTypes.POST_VOTE,
        data: response.data,
      }
      dispatch(action);
    })
  }

  else {
    return axios.post(endpoint)
    .then(response => {
      const action = {
        type: actionTypes.POST_VOTE,
        data: response.data,
      }
      dispatch(action);
    })
  }

}


const postTopic = (params = {}) => (dispatch, getState) => {
  console.log('postTopic', params)
  // todo:  receive 'meeting_id' as param and 
  // include that in endpoint url so that topic
  // is attached so something
  //const {data} = params;
  const data = {
    title: 'My new topic',
    body: 'Body goes here...',
  }
  const endpoint = `http://localhost:8000/topics/`;

  return axios.post(endpoint, data)
    .then(response => {
        console.log('response', response)
      })
}


const submitTopicForm = (params = {}) => (dispatch, getState) => {
  console.log('submitTopicForm', params)
  // todo:  receive 'meeting_id' as param and 
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
  const endpoint = intent === 'update'
    ? `http://localhost:8000/topics/${topic_id}`
    : 'http://localhost:8000/topics'

  const successMessage = intent === 'update'
    ? 'Topic updated successfully.'
    : 'Topic created successfully.'

  return axios.post(endpoint, data)
    .then(response => {
        console.log('response', response);
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


export {
	actionTypes,
	loadTopics,
	socketConnect,
	makeSocketConnect,
	socketConnectNoClosure,
  postVote,
  connectMeetingSocket,
  postTopic,
  receiveTopic,
  submitTopicForm,
}