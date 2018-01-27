import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Route, Switch, Redirect} from 'react-router';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import Stack from '../Stack/Stack';
import MeetingHome from '../MeetingHome/MeetingHome';
import MeetingParticipants from '../MeetingParticipants/MeetingParticipants';
import MeetingAgenda from '../MeetingAgenda/MeetingAgenda';
import MeetingResources from '../MeetingResources/MeetingResources';
import TopicForm from '../TopicForm/TopicForm';
import MeetingTabs from '../MeetingTabs/MeetingTabs';
import CardListContainer from '../CardListContainer/CardListContainer';
import Section from '../Section/Section';
import {withRouter} from 'react-router-dom' 
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import showResults from '../_ReduxFormExample/showResults';
import SimpleForm from '../_ReduxFormExample/SimpleForm';


import {
  loadTopics,
  socketConnect,
  connectMeetingSocket,
} from '../api';



const meeting = {
	id: 1,
	title: 'App development best practices meeting',
	participants: [
		{
			id: 1,
			full_name: 'Mark Pare',
		},
		{
			id: 2,
			full_name: 'Kristian Larson',
		},
		{
			id: 3,
			full_name: 'Davy Risso',
		},
		{
			id: 4,
			full_name: 'Justin Almeida',
		},
	],
	status: 'active',
	created_on: '',
	started_on: '',
	ended_on: '',

	agenda: {
		items: [
			{
				id: 1, 
				title: 'Doc sharing protocol',
				text: 'What should we do to make doc sharing easy among group members?',
				status: 'open',
			},
			{
				id: 2, 
				title: 'Adding new members process',
				text: '',
				status: 'closed',
			},
			{
				id: 3, 
				title: 'Report backs',
				text: '',
				status: 'closed',
			},
		]
	},
	resources: [
		{
			id: 1, 
			title: 'Coop Bylaws',
			file_type: 'pdf',
			description: '',
			status: 'stable',
		},
		{
			id: 2, 
			title: 'How to make a thing',
			file_type: 'mp4',
			description: '',
			status: 'stable',
		},
		{
			id: 3, 
			title: 'Useful links',
			file_type: 'txt',
			description: '',
			status: 'stable',
		},
		{
			id: 4, 
			title: 'Another file name',
			file_type: 'link',
			description: '',
			status: 'stable',
		},
	],
	stack: {

	},
}

class MeetingDetail extends Component {

	componentWillMount() {
		// todo: use actual meeting id
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
					<Route path='/' render={props => ( <MeetingHome meeting={m} {...props} /> )}
					/>

				</Switch>
			</div>
		)
	}
}

// <Route render={props => ( <Stack {...props} /> )}
// 					/>

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

export default withRouter(Connected)