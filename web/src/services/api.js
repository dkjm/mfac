import axios from 'axios';
// const {Socket} = require('phoenix-channels');
import {Socket, Presence} from 'phoenix-channels';
import _values from 'lodash/values';
import * as selectors from '../selectors';
import {toggleSnackbar} from '../services/ui';
import * as utils from '../utils';
import history from '../history';
import { isEmpty } from 'lodash';
import {API_ENTRY, API_ENTRY_WS} from '../constants';

import {LOAD_USER_DATA} from './session';

export const LOAD_MEETINGS = 'LOAD_MEETINGS';
export const LOAD_MEETING = 'LOAD_MEETING';
export const REMOVE_MEETING = 'REMOVE_MEETING';
export const SELECT_MEETING = 'SELECT_MEETING';

export const SELECT_AGENDA_ITEM = 'SELECT_AGENDA_ITEM';
export const LOAD_AGENDA_ITEMS = 'LOAD_AGENDA_ITEMS';
// not sure if using below...
export const LOAD_AGENDA_ITEM = 'LOAD_AGENDA_ITEM';
export const REMOVE_AGENDA_ITEM = 'REMOVE_AGENDA_ITEM';

export const LOAD_MEETING_INVITATIONS = 'LOAD_MEETING_INVITATIONS';
// not sure if using below...
export const LOAD_MEETING_INVITATION = 'LOAD_MEETING_INVITATION';
export const REMOVE_MEETING_INVITATION = 'REMOVE_MEETING_INVITATION';

export const UPDATE_AGENDA_ITEM_USER_VOTE_TYPE = 'UPDATE_AGENDA_ITEM_USER_VOTE_TYPE';
export const UPDATE_AGENDA_ITEM_VOTE_COUNTS = 'UPDATE_AGENDA_ITEM_VOTE_COUNTS';

export const LOAD_STACK_ENTRIES = 'LOAD_STACK_ENTRIES';
export const LOAD_AGENDA_ITEM_STACK_ENTRY = 'LOAD_AGENDA_ITEM_STACK_ENTRY';
export const UPDATE_AGENDA_ITEM_STACK_ENTRIES = 'UPDATE_AGENDA_ITEM_STACK_ENTRIES';

export const ADD_MEETING_PARTICIPANT = 'ADD_MEETING_PARTICIPANT';
export const REMOVE_MEETING_PARTICIPANT = 'REMOVE_MEETING_PARTICIPANT';
export const LOAD_MEETING_PARTICIPANTS = 'LOAD_MEETING_PARTICIPANTS';

// TODO(MP 2/8): remove all action types and
// action creators not being used
export const LOAD_TOPICS = 'LOAD_TOPICS';
export const UPDATE_TOPIC = 'UPDATE_TOPIC';
export const POST_TOPIC = 'POST_TOPIC';
export const RECEIVE_TOPIC = 'RECEIVE_TOPIC';
export const UPDATE_VOTE_COUNTS = 'UPDATE_VOTE_COUNTS';
export const POST_VOTE = 'POST_VOTE';




// declare socket, channel vars here 
// so they can be used to close a 
// connection later and push messages elsewhere
let socket, channel = null;



export const selectMeeting = (params = {}) => (dispatch, getState) => {
  const {meeting_id} = params;
  const action = {
    type: SELECT_MEETING,
    meeting_id,
  }
  dispatch(action);
}

export const selectAgendaItem = (params = {}) => (dispatch, getState) => {
  const {agenda_item_id} = params;
  const action = {
    type: SELECT_AGENDA_ITEM,
    agenda_item_id,
  }
  dispatch(action);
}

export const loadMeetings = (params = {}) => (dispatch, getState) => {

  const endpoint = API_ENTRY + '/meetings/';

  return axios.get(endpoint)
  .then(response => {
      const action = {
        type: LOAD_MEETINGS,
        meetings: response.data,
      }
      return dispatch(action);
    })
}

// TODO(MPP - 2/9): not using loadMeeting
// Rather, getting meeting data from meeting socket
export const loadMeeting = (params = {}) => (dispatch, getState) => {

  const {meeting_id} = params;
	const endpoint = API_ENTRY + `/meetings/${meeting_id}/`;

  return axios.get(endpoint)
  .then(response => {
      const action = {
        type: LOAD_MEETING,
        meeting: response.data,
      }
      dispatch(action);
      console.log('meeting', response.data)
      // TODO: not sure if this is best
      // approach, i.e. dispatching a second
      // action so that "agendaItems" part 
      // of state is updated
      const actionLoadAgendaItems = {
        type: LOAD_AGENDA_ITEMS,
        agenda_items: response.data.agenda_items,
      }
      dispatch(actionLoadAgendaItems);

      const actionLoadMeetingInvitations = {
        type: LOAD_MEETING_INVITATIONS,
        meeting_invitations: response.data.meeting_invitations,
      }
      dispatch(actionLoadMeetingInvitations);

      // const actionLoadMeetingParticipants = {
      //   type: LOAD_MEETING_PARTICIPANTS,
      //   participants: response.data.participants,
      // }
      // dispatch(actionLoadMeetingParticipants);
    })
}


export const submitMeetingForm = (params = {}) => (dispatch, getState) => {
  const {
    meeting_id,
    intent,
    values,
  } = params

  let endpoint, method, successMessage;
  if (intent === 'update') {
    endpoint = API_ENTRY + `/meetings/${meeting_id}/`;
    method = 'PATCH';
    successMessage = 'Meeting updated successfully.';
  }
  else {
    endpoint = API_ENTRY + `/meetings/`;
    method = 'POST';
    successMessage = 'Meeting created successfully.';
  }

  const config = {
    url: endpoint,
    method,
    data: {meeting: values},
  }

  return axios(config)
    .then(response => {
      // TODO(mp 2/7): explicitly not dispatching
      // LOAD_MEETING action type because the returned
      // data will not have all the necessary vals,
      // e.g. owner, etc.  This will throw an error when
      // rendering MeetingDetail component, because meeting
      // is not null in state, but it doesn't have the expected
      // props.  Rather than use the returned response, just
      // using meeting_id and pushing to correct url, then let
      // connectMeetingSocket provide necessary data
      // const action = {
      //   type: LOAD_MEETING,
      //   meeting: response.data,
      // }
      // dispatch(action);
      if (intent === 'update') {
        history.goBack();
      }
      else {
        history.push(`/meetings/${response.data.id}`);
      }
      const snackbarParams = {
        open: true,
        message: successMessage,
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    })
}


export const deleteMeeting = (params = {}) => (dispatch, getState) => {
  const {
    meeting_id,
  } = params

  const endpoint = `${API_ENTRY}/meetings/${meeting_id}/`;

  const config = {
    url: endpoint,
    method: 'DELETE',
  }

  return axios(config)
    .then(response => {
      history.push('/meetings/dashboard');
      const snackbarParams = {
        open: true,
        message: 'Meeting deleted.',
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    })
}


export const submitMeetingInvitationForm = (params = {}) => (dispatch, getState) => {
  const {
    meeting_invitation_id,
    meeting_id,
    intent,
    values,
  } = params

  let endpoint, method, successMessage;
  if (intent === 'update') {
    endpoint = API_ENTRY + `/invitations/${meeting_invitation_id}/`;
    method = 'PATCH';
    successMessage = 'Invitation updated successfully.';
  }
  else {
    endpoint = API_ENTRY + `/invitations/`;
    method = 'POST';
    successMessage = 'Invitation sent.';
  }

  const data = {
    meeting_id,
    ...values,
  }

  const config = {
    url: endpoint,
    method,
    data,
  }

  return axios(config)
    .then(response => {
      history.goBack();
      const snackbarParams = {
        open: true,
        message: successMessage,
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    })
}


export const deleteMeetingInvitation = (params = {}) => (dispatch, getState) => {
  const {
    meeting_invitation_id,
  } = params

  const endpoint = `${API_ENTRY}/invitations/${meeting_invitation_id}/`;

  const config = {
    url: endpoint,
    method: 'DELETE',
  }

  return axios(config)
    .then(response => {
      history.goBack();
      const snackbarParams = {
        open: true,
        message: 'Invitation deleted.',
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    })
}

export const connectMeetingSocket = (params = {}) => (dispatch, getState) => {
  // see link for options to pass to socket:
  // https://hexdocs.pm/phoenix/js/
  const {meeting_id} = params;
  const socketOptions = {
    params: {
      token: localStorage.getItem('token'),
    },
    //timeout: 10000,
    //heartbeatIntervalMs: 10000, 
    //reconnectAfterMs: 20000,
  }
  let presences = {};
  socket = new Socket(API_ENTRY_WS, socketOptions);
  socket.connect();
  const room = `meeting:${meeting_id}`;
  channel = socket.channel(room, {});
  channel.join()
    .receive('ok', resp => { 
      console.log('meetingChannel - joined room ' + room, resp);
      // On join, request periodic meeting updates
      setInterval(() => {
        channel.push("update_meeting", {}, 1000)
        .receive('ok', ({messages}) => console.log('ok', messages))
        .receive('error', ({reason}) => console.log('error', reason))
        //.receive('timeout', () => console.log('timeout'))
      }, 1000 * 20)
    })
    .receive('error', resp => { 
      console.log('meetingChannel - unable to join room ' + room);
      let title, content;
      if (resp.reason === 'unauthorized') {
        title = 'Unauthorized';
        content = "You don't have permissions to view this meeting";
      }
      else if (resp.reason === 'meeting_does_not_exist') {
        title = 'Meeting not found';
        content = "The requested meeting does not exist.";
      }
      const onOk = () => {
        history.push('/meetings/dashboard');
      }
      utils.openModal({
        title,
        content,
        onOk,
      })
    })

  channel.on('presence_state', state => {
    console.log('meetingChannel - presence_state', state);
    presences = Presence.syncState(presences, state)
  })

  channel.on('presence_diff', diff => {
    console.log('meetingChannel - presence_diff', diff);
    presences = Presence.syncDiff(presences, diff)
    const participants = _values(presences).map(item => item.user)
    const action = {
      type: LOAD_MEETING_PARTICIPANTS,
      participants,
    }
    dispatch(action);
  })


  channel.on('update_meeting', payload => {
   console.log('meetingChannel - update_meeting', payload)

     const actionLoadMeeting = {
      type: LOAD_MEETING,
      meeting: payload.meeting
     }
     dispatch(actionLoadMeeting);

    const actionLoadAgendaItems = {
      type: LOAD_AGENDA_ITEMS,
      agenda_items: payload.meeting.agenda_items,
    }
    dispatch(actionLoadAgendaItems)

    const actionLoadMeetingInvitations = {
      type: LOAD_MEETING_INVITATIONS,
      meeting_invitations: payload.meeting.invitations,
    }
    dispatch(actionLoadMeetingInvitations);
  })

  channel.on('update_meeting_details', payload => {
   console.log('meetingChannel - update_meeting_details', payload)
     const action = {
      type: LOAD_MEETING,
      meeting: payload.meeting
     }
     dispatch(action);
  })

  channel.on('remove_meeting', payload => {
   console.log('meetingChannel - remove_meeting', payload)
     const action = {
      type: REMOVE_MEETING,
      meeting_id: payload.meeting_id,
     }
     dispatch(action);
     history.push('/meetings/dashboard');
  })

  channel.on('add_agenda_item', payload => {
    console.log('meetingChannel - add_agenda_item', payload)
    const action = {
      type: LOAD_AGENDA_ITEM,
      agenda_item: payload.agenda_item,
    }
    dispatch(action);
  })

  channel.on('update_agenda_item', payload => {
    console.log('meetingChannel - update_agenda_item', payload)
    const action = {
      type: LOAD_AGENDA_ITEM,
      agenda_item: payload.agenda_item,
    }
    dispatch(action);
  })

  channel.on('remove_agenda_item', payload => {
    console.log('meetingChannel - remove_agenda_item', payload)
    const action = {
      type: REMOVE_AGENDA_ITEM,
      agenda_item_id: payload.agenda_item_id,
    }
    dispatch(action);
  })

  channel.on('update_agenda_item_votes', payload => {
    console.log('meetingChannel - update_agenda_item_votes', payload)
    const action = {
      type: UPDATE_AGENDA_ITEM_VOTE_COUNTS,
      agenda_item_id: payload.agenda_item_id,
      votes: payload.votes,
    }
    dispatch(action);
  })

  channel.on('add_invitation', payload => {
    console.log('meetingChannel - add_invitation', payload)
    const action = {
      type: LOAD_MEETING_INVITATION,
      invitation: payload.invitation,
    }
    dispatch(action);
  })

  channel.on('update_invitation', payload => {
    console.log('meetingChannel - update_invitation', payload)
    const action = {
      type: LOAD_MEETING_INVITATION,
      invitation: payload.invitation,
    }
    dispatch(action);
  })

  channel.on('remove_invitation', payload => {
    console.log('meetingChannel - remove_invitation', payload)
    const action = {
      type: REMOVE_MEETING_INVITATION,
      invitation_id: payload.invitation_id,
    }
    dispatch(action);
  })

  channel.on('update_stack_entries', payload => {
    console.log('meetingChannel - update_stack_entries', payload)
    const action = {
      type: LOAD_STACK_ENTRIES,
      agenda_item_id: payload.agenda_item_id,
      stack_entries: payload.stack_entries,
    }
    dispatch(action);
  })

  //     

  // const {meeting_id} = params;
  // const token = localStorage.getItem('token');
  // //const endpoint = `${API_ENTRY_WS}/meetings/${meeting_id}/`;
  // const endpoint = `${API_ENTRY_WS}/meetings/${meeting_id}/token=${token}/`;
  // socket = new WebSocket(endpoint);

  // socket.onmessage = function(e) {
  //   const data = JSON.parse(e.data);

  //   console.log('meetingSocket onmessage', data)

  //   if (data.event === 'update_meeting') {
  //     const action = {
  //       type: LOAD_MEETING,
  //       meeting: data.meeting,
  //     }
  //     dispatch(action);
  //     // TODO: not sure if this is best
  //     // approach, i.e. dispatching a second
  //     // action so that "agendaItems" part 
  //     // of state is updated
  //     const actionLoadAgendaItems = {
  //       type: LOAD_AGENDA_ITEMS,
  //       agenda_items: data.meeting.agenda_items,
  //     }
  //     dispatch(actionLoadAgendaItems);

  //     const actionLoadMeetingInvitations = {
  //       type: LOAD_MEETING_INVITATIONS,
  //       meeting_invitations: data.meeting.meeting_invitations,
  //     }
  //     dispatch(actionLoadMeetingInvitations);

  //     const actionLoadMeetingParticipants = {
  //       type: LOAD_MEETING_PARTICIPANTS,
  //       participants: data.meeting.participants,
  //     }
  //     dispatch(actionLoadMeetingParticipants);
  //   }

  //   else if (data.event === 'update_meeting_detail') {
  //     const action = {
  //       type: LOAD_MEETING,
  //       meeting: data.meeting,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'update_agenda_item_vote_counts') {
  //     const action = {
  //       type: UPDATE_AGENDA_ITEM_VOTE_COUNTS,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'add_agenda_item') {
  //     const action = {
  //       type: LOAD_AGENDA_ITEM,
  //       agenda_item: data.agenda_item,
  //     }
  //     dispatch(action);
  //   }

// ======================== Above is Done =====================

  //   else if (data.event === 'update_agenda_item_stack_entries') {
  //     const action = {
  //       type: UPDATE_AGENDA_ITEM_STACK_ENTRIES,
  //       agenda_item_id: data.agenda_item_id,
  //       agenda_item_stack_entries: data.agenda_item_stack_entries,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'add_meeting_invitation') {
  //     const action = {
  //       type: LOAD_MEETING_INVITATION,
  //       meeting_invitation: data.meeting_invitation,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'remove_meeting_invitation') {
  //     const action = {
  //       type: REMOVE_MEETING_INVITATION,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'update_meeting_invitations') {
  //     const action = {
  //       type: LOAD_MEETING_INVITATIONS,
  //       meeting_id: data.meeting_id,
  //       meeting_invitations: data.meeting_invitations,
  //     }
  //     dispatch(action);
  //   }   

  //   else if (data.event === 'add_agenda_item_stack_entry') {
  //     const action = {
  //       type: LOAD_AGENDA_ITEM_STACK_ENTRY,
  //       agenda_item_stack_entry: data.agenda_item_stack_entry,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'add_meeting_participant') {
  //     const action = {
  //       type: ADD_MEETING_PARTICIPANT,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'remove_meeting_participant') {
  //     const action = {
  //       type: REMOVE_MEETING_PARTICIPANT,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }

  //   else if (data.event === 'load_meeting_participants') {
  //     const action = {
  //       type: LOAD_MEETING_PARTICIPANTS,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }

  //   // (MPP - 180131):  NOT USING
  //   else if (data.event === 'add_topic') {
  //     const action = {
  //       type: RECEIVE_TOPIC,
  //       data: data,
  //     }
  //     dispatch(action);
  //   }
  // }

  // socket.onopen = () => {

  // }

  // // TODO(MPP): handle socket errors, which
  // // can range from bad token, meeting not
  // // found, not invited to meeting, etc.
  // socket.onerror = (error) => {
  //   console.log('MEETING SOCKET ERROR', error)
  // }
  // // Call onopen directly if socket is already open
  // if (socket.readyState === WebSocket.OPEN) socket.onopen();
  // return socket;
}

export const disconnectMeetingSocket = (params = {}) => (dispatch, getState) => {
  if (socket) {
    //socket.close();
    socket.disconnect();
  }
}


export const postVote = (topic_id, vote_type) => (dispatch, getState) => {

  const endpoint = API_ENTRY + `/topics/topic_id=${topic_id}&vote_type=${vote_type}/`;

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
    ? API_ENTRY + `/topics/${topic_id}/`
    : API_ENTRY + '/topics/'

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



export const submitAgendaItemForm = (params = {}) => (dispatch, getState) => {
  const {
    agenda_item_id,
    meeting_id,
    intent,
    values,
  } = params

  const data = {
    ...values,
    meeting_id,
  }
  // <intent> will be either "update"
  // or "create".  Endpoint depends on which

  let method, endpoint, successMessage;
  if (intent === 'update') {
    endpoint = API_ENTRY + `/agenda_items/${agenda_item_id}/`;
    method = 'PATCH';
    successMessage = 'Agenda item updated successfully.';
  }
  else {
    endpoint = API_ENTRY + `/agenda_items/`;
    method = 'POST';
    successMessage = 'Agenda item created successfully.';
  }

  const config = {
    url: endpoint,
    method,
    data: {agenda_item: data},
  }

  return axios(config)
    .then(response => {
        history.goBack();
        const snackbarParams = {
          open: true,
          message: successMessage,
        }
        setTimeout(() => {
          dispatch(toggleSnackbar(snackbarParams));
        }, 300)
      })
}


export const deleteAgendaItem = (params = {}) => (dispatch, getState) => {
  const {
    agenda_item_id,
  } = params

  const endpoint = `${API_ENTRY}/agenda_items/${agenda_item_id}/`;

  const config = {
    url: endpoint,
    method: 'DELETE',
  }

  return axios(config)
    .then(response => {
      history.goBack();
      const snackbarParams = {
        open: true,
        message: 'Agenda item deleted.',
      }
      setTimeout(() => {
        dispatch(toggleSnackbar(snackbarParams));
      }, 300)
    })
}

export const changeAgendaItemStatus = (params = {}) => (dispatch, getState) => {
  const {
    agenda_item_id,
    status,
  } = params

  const endpoint = API_ENTRY + `/agenda_items/${agenda_item_id}/`;

  let successMessage;
  if (status === 'OPEN') {
    successMessage = 'Agenda item opened.';
  }
  else if (status === 'CLOSED') {
    successMessage = 'Agenda item closed.';
  }
  else if (status === 'PENDING') {
    successMessage = 'Agenda item reactivated.';
  }

  const config = {
    url: endpoint,
    method: 'PATCH',
    data: {agenda_item: {status}},
  }

  return axios(config)
    .then(response => {
        const snackbarParams = {
          open: true,
          message: successMessage,
        }
        setTimeout(() => {
          dispatch(toggleSnackbar(snackbarParams));
        }, 300)
      })
}


// TODO: Currently just calling this on
// "add" button in stack section of comp
// AgendaItemDetail.  Need to implement form
// with fields for requested time, etc.?
export const addOrRemoveStackEntry = (params = {}) => (dispatch, getState) => {
  const {
    agenda_item_id,
    action,
  } = params

  const endpoint = `${API_ENTRY}/agenda_items/${agenda_item_id}/stack_entries`;
  let method, successMessage;
  if (action === 'add') {
    method = 'POST';
    successMessage = 'You have been added to the stack.';
  }
  else {
    method = 'DELETE';
    successMessage = 'You have been removed from the stack.';
  }

  const config = {
    url: endpoint,
    method,
  }

  return axios(config)
    .then(response => {
        const snackbarParams = {
          open: true,
          message: successMessage,
        }
        dispatch(toggleSnackbar(snackbarParams));
      })
    .catch(error => {
      // not handling error right now
      console.log('response', error.response);
    })
}


export const requestRemoveAgendaItemStackEntry = (params = {}) => (dispatch, getState) => {
  const {
    agenda_item_id,
  } = params

  const state = getState();
  const user_id = selectors.getUserData(state).id;

  const data = {
    agenda_item_id,
    user_id,
  }

  const endpoint =  API_ENTRY + `/agenda_item_stack_entries/`;
  const successMessage = 'You have been removed from the stack.'

  // need to pass axios config object
  // to be able to pass data on a 
  // delete request
  const config = {
    url: endpoint,
    method: 'delete',
    data,
  }
  return axios(config)
    .then(response => {
        const snackbarParams = {
          open: true,
          message: successMessage,
        }
        dispatch(toggleSnackbar(snackbarParams));
      })
    .catch(error => {
      // not handling error right now
      console.log('response', error.response);
    })
}


export const postAgendaItemVote = (params = {}) => (dispatch, getState) => {
  // TODO(MPP 180131): 
  // agenda_item_id may be passed as 
  // a string (e.g. if value is taken from url
  // params).  Might need to convert to int.
  // Leaving for now.
  const {agenda_item_id, vote_type} = params;
  const endpoint = API_ENTRY + `/agenda_items/${agenda_item_id}/votes/`;

  const state = getState();
  const agendaItem = selectors.getAgendaItem(state, {agenda_item_id})

  // in case for whatever reason agendaItem is null
  if (!agendaItem) {return};

  // if new user_vote is same as current,
  // user is "un-voting".  Set user_vote to
  // null on successfull request
  let updated_user_vote;
  if (agendaItem.votes.user_vote === vote_type) {
    updated_user_vote = null;
  }
  else {
    updated_user_vote = vote_type;
  }

  const config = {
    url: endpoint,
    method: 'POST',
    data: {vote_type},
  }

  return axios(config)
  .then(response => {
    const action = {
      type: UPDATE_AGENDA_ITEM_USER_VOTE_TYPE,
      agenda_item_id,
      vote_type: updated_user_vote,
    }
    dispatch(action);
  })

  // let vote_action;

  // if (agendaItem.votes.user_vote === vote_type) {
  //   vote_action = 'delete_vote';
  // }
  // else {
  //   vote_action = 'post_vote';
  // }

  // if (vote_action === 'delete_vote') {
  //   return axios.delete(endpoint)
  //   .then(response => {
  //     // if successful, update state with
  //     // new user vote_type
  //     const action = {
  //       type: UPDATE_AGENDA_ITEM_USER_VOTE_TYPE,
  //       agenda_item_id,
  //       vote_type: null,
  //     }
  //     dispatch(action);
  //   })
  //   .catch(error => {
  //     const params_ = {
  //       open: true,
  //       message: 'Unable to post vote.',
  //     }
  //     dispatch(toggleSnackbar(params_));
  //   })
  // }

  // else {
  //   return axios.post(endpoint, {vote_type})
  //   .then(response => {
  //     const action = {
  //       type: UPDATE_AGENDA_ITEM_USER_VOTE_TYPE,
  //       agenda_item_id,
  //       vote_type,
  //     }
  //     dispatch(action);
  //   })
  //   .catch(error => {
  //     const params_ = {
  //       open: true,
  //       message: 'Unable to post vote.',
  //     }
  //     dispatch(toggleSnackbar(params_));
  //   })
  // }

}



const initialMeetingState = {
  cache: {},
  selected: null,
}

const initialAgendaItemState = {
  cache: {},
  selected: null,
}

const initialMeetingInvitationState = {
  cache: {},
  selected: null,
}

const initialMeetingParticipantState = {
  cache: {},
  selected: null,
}

const initialTopicState = {
  cache: {},
}

export const meetingInvitationReducer = (state = initialMeetingInvitationState, action) => {
  switch (action.type) {

    case (LOAD_MEETING_INVITATIONS): {
      const {meeting_invitations} = action;
      const obj = {};
      meeting_invitations.forEach(m => obj[m.id] = m);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    case (LOAD_MEETING_INVITATION): {
      const {invitation} = action;
      let updatedInvitation = state.cache[invitation.id]
      // if meeting_invitation already in cache,
      // merge objects
      if (updatedInvitation) {
        updatedInvitation = {
          ...updatedInvitation,
          ...invitation,
        }
      }
      // else add data as it is
      else {
        updatedInvitation = invitation;
      }

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [invitation.id]: updatedInvitation,
        },
      }
      return nextState;
    }

    case (REMOVE_MEETING_INVITATION): {
      const {invitation_id} = action;
      const {cache} = state;
      delete cache[invitation_id];
      const nextState = {
        ...state,
        cache: {...cache},
      }
      return nextState;
    }

    default: {
      return state;
    }
  }
}

export const meetingParticipantReducer = (state = initialMeetingParticipantState, action) => {
  switch (action.type) {

    case (ADD_MEETING_PARTICIPANT): {
      const {participant} = action.data;
      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [participant.id]: participant,
        },
      }
      return nextState;
    }

    case (REMOVE_MEETING_PARTICIPANT): {
      const {participant} = action.data;
      const {cache} = state
      delete cache[participant.id];
      const nextState = {
        ...state,
        cache: {...cache},
      }
      return nextState;
    }

    case (LOAD_MEETING_PARTICIPANTS): {
      const {participants} = action;
      const obj = {};
      participants.forEach(p => obj[p.id] = p);
      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    default: {
      return state;
    }
  }
}

export const meetingReducer = (state = initialMeetingState, action) => {
  switch (action.type) {

    case (LOAD_USER_DATA): {
      const {meetings} = action.data;
      const obj = {};
      meetings.forEach(m => obj[m.id] = m);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    case (SELECT_MEETING): {
      const {meeting_id} = action;
      const nextState = {
        ...state,
        selected: meeting_id,
      }
    }

    case (LOAD_MEETINGS): {
      const {meetings} = action;
      const obj = {};
      meetings.forEach(m => obj[m.id] = m);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    case (LOAD_MEETING): {
      const {meeting} = action;
      let updatedMeeting = state.cache[meeting.id]
      // if meeting already in cache,
      // merge objects
      if (updatedMeeting) {
        updatedMeeting = {
          ...updatedMeeting,
          ...meeting,
        }
      }
      // else add data as it is
      else {
        updatedMeeting = meeting;
      }

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [meeting.id]: updatedMeeting,
        },
      }
      return nextState;
    }

    default: {
      return state;
    }
  }
}


export const agendaItemReducer = (state = initialMeetingState, action) => {
  switch (action.type) {


    case (UPDATE_AGENDA_ITEM_USER_VOTE_TYPE): {
      const {agenda_item_id, vote_type} = action;
      const agendaItem = state.cache[agenda_item_id];
      if (!agendaItem) {return state};

      const updatedAgendaItem = {
        ...agendaItem,
        votes: {
          ...agendaItem.votes,
          user_vote: vote_type,
        }
      }
      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [agenda_item_id]: updatedAgendaItem,
        }
      }
      return nextState;
    }

    case (UPDATE_AGENDA_ITEM_VOTE_COUNTS): {
      const {agenda_item_id, votes} = action;
      const agendaItem = state.cache[agenda_item_id];
      if (!agendaItem) {return state};

      const updatedAgendaItem = {
        ...agendaItem,
        votes: {
          ...agendaItem.votes,
          ...votes,
        }
      }
      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [agenda_item_id]: updatedAgendaItem,
        }
      }
      return nextState;
    }

    case (LOAD_AGENDA_ITEMS): {
      const {agenda_items} = action;
      const obj = {};
      agenda_items.forEach(i => obj[i.id] = i);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    case (SELECT_AGENDA_ITEM): {
      const {agenda_item_id} = action;
      const nextState = {
        ...state,
        selected: agenda_item_id,
      }
      return nextState;
    }

    case (LOAD_AGENDA_ITEMS): {
      const {agenda_items} = action;
      const obj = {};
      agenda_items.forEach(i => obj[i.id] = i);

      const nextState = {
        ...state,
        cache: obj,
      }
      return nextState;
    }

    case (LOAD_AGENDA_ITEM): {
      const {agenda_item} = action;
      let updatedItem = state.cache[agenda_item.id]
      // if item already in cache,
      // merge objects
      // ** Need to make sure not to
      // overwrite user_vote key of
      // votes key of agenda_item
      if (updatedItem) {
        updatedItem = {
          ...updatedItem,
          ...agenda_item,
          votes: {
            ...updatedItem.votes,
            ...agenda_item.votes,
          }
        }
      }
      // else add data as it is
      else {
        updatedItem = agenda_item;
      }

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [agenda_item.id]: updatedItem,
        },
      }
      return nextState;
    }

    case (REMOVE_AGENDA_ITEM): {
      const {agenda_item_id} = action;
      const {cache} = state;
      delete cache[agenda_item_id];
      const nextState = {
        ...state,
        cache: {...cache}
      }
      return nextState;
    }

    case (LOAD_STACK_ENTRIES): {
      const {
        agenda_item_id,
        stack_entries,
      } = action;

      const agendaItem = state.cache[agenda_item_id];
      if (!agendaItem) {return state};

      const nextState = {
        ...state,
        cache: {
          ...state.cache,
          [agenda_item_id]: {
            ...agendaItem,
            stack_entries: stack_entries,
          }
        }
      }
      return nextState;      
    }

    // case (UPDATE_AGENDA_ITEM_STACK_ENTRIES): {
    //   const {
    //     agenda_item_id,
    //     agenda_item_stack_entries,
    //   } = action;

    //   const agendaItem = state.cache[agenda_item_id];
    //   if (!agendaItem) {return state};

    //   const updatedAgendaItem = {
    //     ...agendaItem,
    //     stack_entries: agenda_item_stack_entries,
    //   }
      
    //   const nextState = {
    //     ...state,
    //     cache: {
    //       ...state.cache,
    //       [agenda_item_id]: updatedAgendaItem,
    //     },
    //   }
    //   return nextState;   
    // }


    // case (LOAD_AGENDA_ITEM_STACK_ENTRY): {
    //   const {agenda_item_stack_entry} = action;
    //   const {agenda_item_id} = agenda_item_stack_entry;
    //   const agendaItem = state.cache[agenda_item_id];
    //   // check to make sure agendaItem exists.
    //   // I suppose it's possible for the data to be
    //   // come unsynced.
    //   if (agendaItem) {
    //     let updatedAgendaItemStackEntries = agendaItem.stack_entries.map(se => se);
    //     updatedAgendaItemStackEntries.push(agenda_item_stack_entry);
    //     const updatedAgendaItem = {
    //       ...agendaItem,
    //       stack_entries: updatedAgendaItemStackEntries,
    //     }
    //     const nextState = {
    //       ...state,
    //       cache: {
    //         ...state.cache,
    //         [agenda_item_id]: updatedAgendaItem,
    //       },
    //     }
    //     return nextState; 
    //   }
    //   // if agendaItem not in state, ignore
    //   else {
    //     return state;
    //   }
      
    // }

    default: {
      return state;
    }
  }
}
    


export const topicReducer = (state = initialTopicState, action) => {
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
