import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';

import logo from '../../resources/logo.svg';

import Paper from 'material-ui/Paper';
import MailIcon from 'material-ui/svg-icons/content/mail';
import GroupIcon from 'material-ui/svg-icons/social/group';

import authProtected from '../AuthProtected';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';

import {
	getMeetings,
	getUserMeetingInvitations,
} from '../../selectors';

import {COLORS} from '../../constants';


const Summary = ({title, Icon, color, onClick, value}) => {
	const s = {
		container: {
			textAlign: 'center',
			//border: 'solid 1px',
			//borderRadius: '10px',
			padding: '20px',
			minWidth: '150px',
		},
		title: {
			fontSize: '110%',
			fontWeight: 'bold',
		},
		value: {
			fontSize: '400%',
			marginTop: '-15px',
		},
		iconContainer: {
			
		},
		icon: {
			width: '70px',
			height: '70px',
		},
	}

	return (
		<Paper style={s.container} onClick={onClick}>
			<div style={s.iconContainer}>
				<Icon style={s.icon} color={color} />
			</div>
			<div style={s.value}>
				{value}
			</div>
			
			<div style={s.title}>
				{title}
			</div>
		</Paper>
	)
}

class Dashboard extends Component {

	renderItems() {
		const renderedItems = notifications.map((item, index) => {
			
			return (
				<NotificationCard key={item.id} notification={item} />
			)
		})

		return renderedItems;
	}
	
	render() {
		const {
			history,
			meetings, 
			invitations,
		} = this.props;

		return (
			<div style={styles.container}>
				<Summary 
					title={invitations.length === 1 ? "Invitation" : "Invitations"}
					value={invitations.length}
					onClick={() => history.push('/invitations')}
					Icon={MailIcon}
					color={COLORS.reactBlue}
				/>

				<Summary 
					title={meetings.length === 1 ? "Meeting" : "Meetings"}
					value={meetings.length}
					onClick={() => history.push('/meetings/dashboard')}
					Icon={GroupIcon}
					color={COLORS.indigo200}
				/>
			</div>
		)
	}
}

const styles = {
	container: {
		display: 'flex',
		justifyContent: 'space-evenly',
		padding: '50px 20px',
	},
}


const mapStateToProps = (state, ownProps) => {
	return {
		meetings: getMeetings(state),
		invitations: getUserMeetingInvitations(state),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}

let Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Dashboard)

Connected = withRouter(Connected);
export default authProtected(Connected);