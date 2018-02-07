import axios from 'axios';
import {notification} from 'antd';
//import {axios} from '../constants';

import * as selectors from '../selectors';
import {toggleSnackbar, toggleNavDrawer} from '../services/ui';
import * as utils from '../utils';
import history from '../history';
import {API_ENTRY, API_ENTRY_WS} from '../constants';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const UPDATE_MEETING_INVITATIONS = 'UPDATE_MEETING_INVITATIONS';
export const ADD_MEETING_INVITATION = 'ADD_MEETING_INVITATION';
export const UPDATE_MEETING_INVITATION = 'UPDATE_MEETING_INVITATION';
export const ACCEPT_OR_DECLINE_MEETING_INVITATION = 'ACCEPT_OR_DECLINE_MEETING_INVITATION';

axios.interceptors.request.use((config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  })




export const submitLoginForm = (params = {}) => (dispatch, getState) => {
	const endpoint = `${API_ENTRY}/auth/login/`;
	const data = {
		username: params.username,
		password: params.password,
	}
	return axios.post(endpoint, data)
	.then(response => {
		const {token} = response.data;
		localStorage.setItem('token', token);
		const action = {
			type: LOGIN,
			data: response.data,
		}
		dispatch(action);
		history.push('/meetings/dashboard');
	})
	.catch(error => {
		console.log('Error', error);
		console.log('Error', error.response)
	})
}

export const logout = (params = {}) => (dispatch, getState) => {
	// clear token from local storate
	localStorage.setItem('token', '');
	// clear user data
	const action = {
		type: LOGOUT,
	}
	dispatch(action);
	dispatch(toggleNavDrawer({open: false}));
	history.push('/login');
}

export const loadUserData = (params = {}) => (dispatch, getState) => {
	const endpoint = `${API_ENTRY}/user_data/`;
	return axios.get(endpoint)
	.then(response => {
		const action = {
			type: LOAD_USER_DATA,
			data: response.data,
		}
		dispatch(action);
	})
	.catch(error => {
		console.log('Error', error.response)
	})
}

export const acceptOrDeclineMeetingInvitation = (params = {}) => (dispatch, getState) => {
	const {meeting_invitation_id, action} = params;
	const endpoint = `${API_ENTRY}/meeting_invitations/${meeting_invitation_id}/${action}/`;

	return axios.get(endpoint)
	.then(response => {
		const message = action === 'accept'
			? 'Accepted.  You can now view meeting.'
			: 'Invitation declined.'
		dispatch(toggleSnackbar({open: true, message}))
	})
	.catch(error => {
		console.log('Error', error.response)
	})
}

// TODO(MPP - 180204): Disable for now
export const connectUserSocket = (params = {}) => (dispatch, getState) => {
	return;
  const state = getState();
  const user_id = selectors.getUserData(state).id;
  const token = localStorage.getItem('token');
  const endpoint = `${API_ENTRY_WS}/users/${user_id}/token=${token}/`;
  let socket = new WebSocket(endpoint);

  socket.onmessage = function(e) {
    const data = JSON.parse(e.data);

    console.log('userSocket onmessage', data)

    if (data.event === 'update_meeting_invitations') {
      const action = {
        type: UPDATE_MEETING_INVITATIONS,
        data: data,
      }
      dispatch(action);
    }
    else if (data.event === 'add_meeting_invitation') {
    	const action = {
        type: ADD_MEETING_INVITATION,
        data: data,
      }
      dispatch(action);
      const {meeting_invitation} = data;
      const path = `/invitations/${meeting_invitation.id}`;
      const config = {
      	message: 'New Meeting Invitation',
      	description: `You have been invited to participate in ${data.meeting_invitation.meeting.title}.`,
      	onButtonClick: () => history.push(path),
      	buttonText: 'View',
      	duration: 10,
      	icon: 'man',
      }
      utils.openNotification(config);
   	}
   	else if (data.event === 'update_meeting_invitation') {
    	const action = {
        type: UPDATE_MEETING_INVITATION,
        data: data,
      }
      dispatch(action);
   	}
  }

  socket.onopen = function() {

  }

  if (socket.readyState === WebSocket.OPEN) socket.onopen();

  return socket;
}


const initialState = {
	userData: {},
	isLoggedIn: false,
	meetingInvitations: {},
	contacts: {},
}

export const reducer = (state = initialState, action) => {
	switch (action.type) {

		case LOGIN: {
			const {
				user_data, 
				meeting_invitations,
				contacts,
			} = action.data;
			const meetingInvitationsObj = {};
			meeting_invitations.forEach(i => meetingInvitationsObj[i.id] = i);
			const contactsObj = {};
			contacts.forEach(i => contactsObj[i.id] = i);
			const nextState = {
				...state,
				isLoggedIn: true,
				userData: user_data,
				meetingInvitations: meetingInvitationsObj,
				contacts: contactsObj,
			}
			return nextState;
		}

		case LOGOUT: {
			const nextState = {
				...state,
				isLoggedIn: false,
				userData: {},
			}
			return nextState;
		}

		case ADD_MEETING_INVITATION: {
			const {meeting_invitation} = action.data;
			const nextState = {
				...state,
				meetingInvitations: {
					...state.meetingInvitations,
					[meeting_invitation.id]: meeting_invitation,
				},
			}
			return nextState;
		}

		case UPDATE_MEETING_INVITATION: {
			const {meeting_invitation} = action.data;
			const nextState = {
				...state,
				meetingInvitations: {
					...state.meetingInvitations,
					[meeting_invitation.id]: meeting_invitation,
				},
			}
			return nextState;
		}

		case UPDATE_MEETING_INVITATIONS: {
			const {meeting_invitations} = action.data;
			const obj = {};
			meeting_invitations.forEach(i => obj[i.id] = i);
			const nextState = {
				...state,
				meetingInvitations: obj,
			}
			return nextState;
		}

		case LOAD_USER_DATA: {
			const {
				user_data, 
				meeting_invitations,
				contacts,
			} = action.data;
			const meetingInvitationsObj = {};
			meeting_invitations.forEach(i => meetingInvitationsObj[i.id] = i);
			const contactsObj = {};
			contacts.forEach(i => contactsObj[i.id] = i);
			const nextState = {
				...state,
				userData: user_data,
				meetingInvitations: meetingInvitationsObj,
				contacts: contactsObj,
			}
			return nextState;
		}

		default: {
			return state;
		}
	}
}