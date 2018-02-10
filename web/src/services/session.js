import axios from 'axios';
import {Socket} from 'phoenix-channels';
import {notification} from 'antd';

import * as selectors from '../selectors';
import {toggleSnackbar, toggleNavDrawer} from '../services/ui';
import * as utils from '../utils';
import history from '../history';
import {API_ENTRY, API_ENTRY_WS} from '../constants';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_USER_PROFILE = 'LOAD_USER_PROFILE';
export const UPDATE_MEETING_INVITATIONS = 'UPDATE_MEETING_INVITATIONS';

// Need to namespace these action types
// to avoid conflicts with same-named
// action types in api.js
export const LOAD_INVITATION = 'session/LOAD_INVITATION';
export const REMOVE_INVITATION = 'session/REMOVE_INVITATION';
export const ACCEPT_OR_DECLINE_MEETING_INVITATION = 'ACCEPT_OR_DECLINE_MEETING_INVITATION';

axios.interceptors.request.use((config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  })

let socket;


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
  dispatch(disconnectUserSocket());
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
  const {meeting_invitation_id, status} = params;
  const endpoint = `${API_ENTRY}/invitations/${meeting_invitation_id}/`;

  const config = {
    url: endpoint,
    method: 'PATCH',
    data: {status},
  }
  return axios(config)
  .then(response => {
    const message = status === 'ACCEPTED'
      ? 'Accepted.  You can now view meeting.'
      : 'Invitation declined.'
    dispatch(toggleSnackbar({open: true, message}))
  })
  .catch(error => {
    console.log('Error', error.response)
  })
}

// TODO(MP 2/9): Handle error response
// Right now, if update fails on server,
// Update might fail because new user_name
// or email are not unique.
export const submitUserProfileForm = (params = {}) => (dispatch, getState) => {
  const endpoint = `${API_ENTRY}/update_user_profile/`;
  const config = {
    url: endpoint,
    method: 'POST',
    data: {user: {...params}},
  }
  return axios(config)
  .then(response => {
    const snackbarParams = {
        open: true,
        message: 'Profile updated.',
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    history.push('/settings');
  })
  .catch(error => {
    console.log('Error', error);
    console.log('Error', error.response)
  })
}


// TODO(MP 2/9): Handle error response.
// Right now, if update fails on server, 400
// is returned.
export const submitUserPasswordForm = (params = {}) => (dispatch, getState) => {
  const endpoint = `${API_ENTRY}/update_user_password/`;
  const config = {
    url: endpoint,
    method: 'POST',
    data: params,
  }

  return axios(config)
  .then(response => {
    const snackbarParams = {
        open: true,
        message: 'Password updated.',
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    history.push('/settings');
  })
  .catch(error => {
    console.log('Error', error);
    console.log('Error', error.response)
  })
}


export const connectUserSocket = (params = {}) => (dispatch, getState) => {
  // see link for options to pass to socket:
  // https://hexdocs.pm/phoenix/js/
  const state = getState();
  const userData = selectors.getUserData(state);
  const socketOptions = {
    params: {
      token: localStorage.getItem('token'),
    },
    //timeout: 10000,
    //heartbeatIntervalMs: 10000, 
    //reconnectAfterMs: 20000,
  }
  socket = new Socket(API_ENTRY_WS, socketOptions)
  socket.connect()
  const room = `user:${userData.id}`
  let channel = socket.channel(room, {})
  channel.join()
    .receive('ok', resp => { console.log('Joined room ' + room, resp) })
    .receive('error', resp => { 
      console.log('Unable to join room ' + room);
      let title, content;
      if (resp.reason === 'unauthorized') {
        title = 'Unauthorized';
        content = "You don't have permissions to join this channel.";
      }
      else if (resp.reason === 'user_does_not_exist') {
        title = 'User not found';
        content = "";
      }
      else {
        console.log('Unknown reason: ', resp);
        title = "Can't connect"
        title = "Unknown reason."
      }
      const onOk = () => {
        //dispatch(logout())
      }
      utils.openModal({
        title,
        content,
        onOk,
      })
    })


  channel.on('update_user_data', payload => {
   console.log('user channel - update_user_data', payload)
     const action = {
      type: LOAD_USER_DATA,
      data: payload.user_data,
     }
     dispatch(action);
  })

  // update_user_profile is details of user
  // (e.g. first_name, user_name, etc) whereas
  // update_user_data will have details but also
  // contacts and invitations.  update_user_profile
  // is triggered when user updates there profile
  channel.on('update_user_profile', payload => {
   console.log('userChannel - update_user_profile', payload)
     const action = {
      type: LOAD_USER_PROFILE,
      profile: payload,
     }
     dispatch(action);
  })

  channel.on('add_invitation', payload => {
    console.log('user channel - add_invitation', payload)
    const action = {
      type: LOAD_INVITATION,
      invitation: payload.invitation
    }
    dispatch(action);

    const path = `/invitations/${payload.invitation.id}`;
    const config = {
      message: 'New Meeting Invitation',
      description: `You have been invited to participate in ${payload.invitation.meeting.title}.`,
      onButtonClick: () => history.push(path),
      buttonText: 'View',
      duration: 5,
      icon: 'man',
    }
    utils.openNotification(config);
  })

  channel.on('update_invitation', payload => {
   console.log('user channel - update_invitation', payload)
     const action = {
      type: LOAD_INVITATION,
      invitation: payload.invitation
     }
     dispatch(action);
  })

  channel.on('remove_invitation', payload => {
   console.log('user channel - remove_invitation', payload)
     const action = {
      type: REMOVE_INVITATION,
      invitation_id: payload.invitation_id
     }
     dispatch(action);
  })
}

export const disconnectUserSocket = (params = {}) => (dispatch, getState) => {
  if (socket) {
    //socket.close();
    socket.disconnect();
  }
}



// // TODO(MPP - 180204): Disable for now
// export const connectUserSocket = (params = {}) => (dispatch, getState) => {
//  return;
//   const state = getState();
//   const user_id = selectors.getUserData(state).id;
//   const token = localStorage.getItem('token');
//   const endpoint = `${API_ENTRY_WS}/users/${user_id}/token=${token}/`;
//   let socket = new WebSocket(endpoint);

//   socket.onmessage = function(e) {
//     const data = JSON.parse(e.data);

//     console.log('userSocket onmessage', data)

//     if (data.event === 'update_meeting_invitations') {
//       const action = {
//         type: UPDATE_MEETING_INVITATIONS,
//         data: data,
//       }
//       dispatch(action);
//     }
//     else if (data.event === 'add_meeting_invitation') {
//      const action = {
//         type: ADD_MEETING_INVITATION,
//         data: data,
//       }
//       dispatch(action);
//       const {meeting_invitation} = data;
//       const path = `/invitations/${meeting_invitation.id}`;
//       const config = {
//        message: 'New Meeting Invitation',
//        description: `You have been invited to participate in ${data.meeting_invitation.meeting.title}.`,
//        onButtonClick: () => history.push(path),
//        buttonText: 'View',
//        duration: 10,
//        icon: 'man',
//       }
//       utils.openNotification(config);
//      }
//      else if (data.event === 'update_meeting_invitation') {
//      const action = {
//         type: UPDATE_MEETING_INVITATION,
//         data: data,
//       }
//       dispatch(action);
//      }
//   }

//   socket.onopen = function() {

//   }

//   if (socket.readyState === WebSocket.OPEN) socket.onopen();

//   return socket;
// }



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
      } = action.data;

      const nextState = {
        ...state,
        isLoggedIn: true,
        userData: user_data,
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

    case LOAD_INVITATION: {
      const {invitation} = action;
      let updatedInvitation = state.meetingInvitations[invitation.id]
      if (updatedInvitation) {
        updatedInvitation = {
          ...updatedInvitation,
          ...invitation,
        }
      }
      else {
        updatedInvitation = invitation;
      }
      const nextState = {
        ...state,
        meetingInvitations: {
          ...state.meetingInvitations,
          [invitation.id]: updatedInvitation,
        },
      }
      return nextState;
    }

    case REMOVE_INVITATION: {
      const {invitation_id} = action;
      const invitations = state.meetingInvitations;
      delete invitations[invitation_id];
      const nextState = {
        ...state,
        meetingInvitations: {...invitations},
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

    case LOAD_USER_PROFILE: {
      const {profile} = action
      const nextState = {
        ...state,
        userData: profile,
      }
      return nextState;
    }

    default: {
      return state;
    }
  }
}