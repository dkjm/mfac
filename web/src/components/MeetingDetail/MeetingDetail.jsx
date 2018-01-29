import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 

import LayoutBanner from '../LayoutBanner';
import Stack from '../Stack';
import MeetingHome from '../MeetingHome';
import MeetingParticipants from '../MeetingParticipants';
import MeetingAgenda from '../MeetingAgenda';
import MeetingResources from '../MeetingResources';
import TopicForm from '../TopicForm';
import MeetingTabs from '../MeetingTabs';
import CardListContainer from '../CardListContainer';
import Section from '../Section';

import CheckIcon from 'material-ui/svg-icons/navigation/check'


import {connectMeetingSocket} from '../../services/api';

import {meeting} from '../../resources/testData';



class MeetingDetail extends Component {

	componentWillMount() {
		// TODO: use actual meeting id
		this.props.connectMeetingSocket(meeting.id);
	}

	renderAgendaItems() {
		const items = meeting.agenda.items;
		const renderedItems = items.map((item, index) => {
			
			return (
				<AgendaItemCard key={item.id} item={item} />
			)
		})

		// override default padding of CardListContainer
		const style = {
			padding: '10px',
		}
		return (
			<CardListContainer style={style}>
				{renderedItems}
			</CardListContainer>
		)
	}

	render() {
		const m = meeting;

		const {match, location} = this.props;

		return (
			<div>
				<LayoutBanner title={m.title} />
				<MeetingTabs />
				<Switch>
					<Route exact path={`${match.url}/stack`} render={props => ( <Stack {...props} /> )}
					/>
					<Route path={`${match.url}/participants`} render={props => ( <MeetingParticipants participants={m.participants} {...props} /> )}
					/>
					<Route path={`${match.url}/agenda`} render={props => ( <MeetingAgenda agenda={m.agenda} {...props} /> )}
					/>
					<Route path={`${match.url}/resources`} render={props => ( <MeetingResources resources={m.resources} {...props} /> )}
					/>
					<Route path={`${match.url}/home`} render={props => ( <MeetingHome meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/topic_form/:intent/:topic_id`} render={props => ( <TopicForm meeting={m} {...props} /> )}
					/>
					<Route path={`${match.url}/topic_form/:intent`} render={props => ( <TopicForm meeting={m} {...props} /> )}
					/>
					<Route path='/' render={props => ( <MeetingHome meeting={m} {...props} /> )}
					/>

				</Switch>
			</div>
		)
	}
}



const mapStateToProps = (state, ownProps) => {
	return {
		
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		connectMeetingSocket: (meeting_id) => {
      dispatch(connectMeetingSocket(meeting_id));
    },
	}
}

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingDetail)

export default withRouter(Connected);