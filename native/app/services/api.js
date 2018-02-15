import {token} from '../fixtures/testData';
import history from '../history';
import {Socket, Presence} from 'phoenix-channels';
import axios from 'axios';

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

export const LOAD_PROPOSALS = 'LOAD_PROPOSALS';
export const SELECT_PROPOSAL = 'SELECT_PROPOSAL';
export const LOAD_PROPOSAL = 'LOAD_PROPOSAL';
export const REMOVE_PROPOSAL = 'REMOVE_PROPOSAL';
export const ADD_PROPOSAL_VOTE = 'ADD_PROPOSAL_VOTE';
export const UPDATE_PROPOSAL_VOTE = 'UPDATE_PROPOSAL_VOTE';
export const REMOVE_PROPOSAL_VOTE = 'REMOVE_PROPOSAL_VOTE';

import {LOAD_USER_DATA} from './session';

// declare socket, channel vars here 
// so they can be used to close a 
// connection later and push messages elsewhere
let socket, channel = null;


export const connectMeetingSocket = (params = {}) => (dispatch, getState) => {
  // see link for options to pass to socket:
  // https://hexdocs.pm/phoenix/js/
  const {meeting_id} = params;
  const socketOptions = {
    params: {
      //token: localStorage.getItem('token'),
      token: token,
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

  channel.on('add_proposal', payload => {
    console.log('meetingChannel - add_proposal', payload)
    const action = {
      type: LOAD_PROPOSAL,
      proposal: payload.proposal,
    }
    dispatch(action);
  })

  channel.on('update_proposal', payload => {
    console.log('meetingChannel - update_proposal', payload)
    const action = {
      type: LOAD_PROPOSAL,
      proposal: payload.proposal,
    }
    dispatch(action);
  })

  channel.on('remove_proposal', payload => {
    console.log('meetingChannel - remove_proposal', payload)
    const action = {
      type: REMOVE_PROPOSAL,
      agenda_item_id: payload.agenda_item_id,
      proposal_id: payload.proposal_id,
      meeting_id: payload.meeting_id,
    }
    dispatch(action);
  })

  channel.on('add_proposal_vote', payload => {
    console.log('meetingChannel - add_proposal_vote', payload)
    const action = {
      type: ADD_PROPOSAL_VOTE,
      agenda_item_id: payload.agenda_item_id,
      proposal_id: payload.proposal_id,
      vote: payload.vote,
    }
    dispatch(action);
  })

  channel.on('update_proposal_vote', payload => {
    console.log('meetingChannel - update_proposal_vote', payload)
    const action = {
      type: UPDATE_PROPOSAL_VOTE,
      agenda_item_id: payload.agenda_item_id,
      proposal_id: payload.proposal_id,
      vote: payload.vote,
    }
    dispatch(action);
  })

  channel.on('remove_proposal_vote', payload => {
    console.log('meetingChannel - remove_proposal_vote', payload)
    const action = {
      type: REMOVE_PROPOSAL_VOTE,
      agenda_item_id: payload.agenda_item_id,
      proposal_id: payload.proposal_id,
      vote_id: payload.vote_id,
    }
    dispatch(action);
  })
}

export const disconnectMeetingSocket = (params = {}) => (dispatch, getState) => {
  if (socket) {
    //socket.close();
    socket.disconnect();
  }
} 

const initialMeetingState = {
	cache: {},
	selected: null,
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
		case LOAD_MEETING: {
			console.log('load meeting reducer', action)
			return state;
		}
		default: {
			return state;
		}
	}
}