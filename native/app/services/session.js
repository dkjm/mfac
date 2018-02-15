import {Socket, Presence} from 'phoenix-channels';
import {API_ENTRY, API_ENTRY_WS} from '../constants';
import axios from 'axios';
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
import {token} from '../fixtures/testData';
import * as selectors from '../selectors';

let socket, channel;

export const connectUserSocket = (params = {}) => (dispatch, getState) => {
  // see link for options to pass to socket:
  // https://hexdocs.pm/phoenix/js/
  const state = getState();
  const userData = selectors.getUserData(state);
  const socketOptions = {
    params: {
      //token: localStorage.getItem('token'),
      token: token,
    },
    //timeout: 10000,
    //heartbeatIntervalMs: 10000, 
    //reconnectAfterMs: 20000,
  }

  socket = new Socket(API_ENTRY_WS, socketOptions)

  socket.connect()
  //const room = `user:${userData.id}`
  const room = `user:5`
  let channel = socket.channel(room, {})

  channel.join()
    .receive('ok', resp => { console.log('userChannel - joined room ' + room, resp) })
    .receive('error', resp => { 
      console.log('userChannel - unable to join room ' + room);
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
   console.log('userChannel - update_user_data', payload)
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
    console.log('userChannel - add_invitation', payload)
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