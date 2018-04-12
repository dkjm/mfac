import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom';

import CheckIcon from 'material-ui/svg-icons/navigation/check';

import MeetingHome from '../MeetingHome';
import MeetingParticipants from '../MeetingParticipants';
import MeetingAgenda from '../MeetingAgenda';
import MeetingResources from '../MeetingResources';
import AgendaItemForm from '../AgendaItemForm';
import AgendaItemDetail from '../AgendaItemDetail';
import MeetingTabs from '../MeetingTabs';
import CardListContainer from '../CardListContainer';
import Section from '../Section';
import MeetingForm from '../MeetingForm';
import MeetingInvitations from '../MeetingInvitations';
import MeetingInvitationDetail from '../MeetingInvitationDetail';
import MeetingInvitationForm from '../MeetingInvitationForm';
import ProposalForm from '../ProposalForm';
import ProposalDetail from '../ProposalDetail';

import {
	connectMeetingSocket, 
	disconnectMeetingSocket,
} from '../../services/api';
import {getMeeting} from '../../selectors';



class MeetingDetail extends Component {

	componentWillMount() {
		const {meeting_id} = this.props.match.params;
		this.props.connectMeetingSocket(meeting_id);
	}

	componentWillUnmount() {
		this.props.disconnectMeetingSocket();
	}

	render() {
		const {meeting, match, location} = this.props;
		const m = meeting;
		if (!m) {return null};

		return (
			<div>
				<MeetingTabs />
				<Switch>
					<Route path={`${match.url}/meeting_form/:intent`} render={props => ( <MeetingForm meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/invitations`} render={props => ( <MeetingInvitations meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/invitations/:meeting_invitation_id`} render={props => ( <MeetingInvitationDetail meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/invitations/invitation_form/:intent`} render={props => ( <MeetingInvitationForm meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/participants`} render={props => ( <MeetingParticipants participants={m.participants} {...props} /> )}
					/>
					<Route path={`${match.url}/agenda`} render={props => ( <MeetingAgenda {...props} /> )}
					/>
					<Route path={`${match.url}/resources`} render={props => ( <MeetingResources resources={m.resources} {...props} /> )}
					/>
					<Route path={`${match.url}/home`} render={props => ( <MeetingHome meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/topic_form/:intent/:topic_id`} render={props => ( <TopicForm meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/topic_form/:intent`} render={props => ( <TopicForm meeting={m} {...props} /> )}
					/>
				{/* Passing meeting to AgendaItemForm as a prop because I can't get a hold of meeting_id inside that comp from match prop via react router*/}
					<Route path={`${match.url}/agenda_item_form/:intent/:agenda_item_id`} render={props => ( <AgendaItemForm meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/agenda_item_form/:intent`} render={props => ( <AgendaItemForm meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/agenda_items/:agenda_item_id`} render={props => ( <AgendaItemDetail meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/agenda_items/:agenda_item_id/proposal_form/:intent`} render={props => ( <ProposalForm meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/agenda_items/:agenda_item_id/proposals/:proposal_id/proposal_form/:intent`} render={props => ( <ProposalForm meeting={m} {...props} /> )}
					/>
					<Route exact path={`${match.url}/agenda_items/:agenda_item_id/proposals/:proposal_id`} render={props => ( <ProposalDetail meeting={m} {...props} /> )}
					/>
					<Redirect from='/' to={`${match.url}/home`} />

				</Switch>
			</div>
		)
	}
}



const mapStateToProps = (state, ownProps) => {
	const {meeting_id} = ownProps.match.params;
	return {
		meeting: getMeeting(state, {meeting_id}),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		connectMeetingSocket: (meeting_id) => {
      dispatch(connectMeetingSocket({meeting_id}));
    },
    disconnectMeetingSocket: () => {
      dispatch(disconnectMeetingSocket());
    },
	}
}

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingDetail)

export default withRouter(Connected);