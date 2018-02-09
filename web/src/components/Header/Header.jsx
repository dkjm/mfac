import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import {connect} from 'react-redux';

import {Link, withRouter} from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavIcon from 'material-ui/svg-icons/navigation/menu';

import {COLORS, COMPANY_NAME} from '../../constants';
import {toggleNavDrawer} from '../../services/ui';
import {
	getHeader,
	getUserData,
	getMeetings,
} from '../../selectors';


const meetingDetailRE = /\/meetings\/(\d+)/;
const meetingsRE = /\/meetings\/dashboard/;
const dashboardRE = /\/dashboard/;
const invitationsRE = /\/invitations/;
const settingsRE = /\/settings/;

const getTitle = (path, nextProps) => {
	const p = path;
	if (meetingDetailRE.test(p)) {
		const match = meetingDetailRE.exec(p);
		const meeting_id = match[1];
		const meeting = nextProps.meetings.filter(m => m.id == meeting_id)[0];
		if (meeting) {
			return meeting.title;
		}
	}
	else if (meetingsRE.test(p)) {
		return 'Meetings';
	}
	else if (dashboardRE.test(p)) {
		return nextProps.userData.full_name;
	}
	else if (invitationsRE.test(p)) {
		return 'Invitations';
	}
	else if (settingsRE.test(p)) {
		return 'Settings';
	}
	else {
		console.log('No match for: ', p);
		return '';
	}
}


class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			title: '',
		}
	}

	componentWillMount() {
		const path = this.props.location.pathname;
		this.setState({title: getTitle(path, this.props)})
	}

	componentWillReceiveProps(nextProps) {
		// TODO(MP 2/9): Implement some kind of
		// check here so that (hopefully) don't
		// need to run through getTitle on
		// every props change
		const path = nextProps.location.pathname;
		this.setState({title: getTitle(path, nextProps)});
	}

	handleToggleNavDrawer = () => {
		this.props.toggleNavDrawer({open: true});
	}

	render() {
		const {userData, header} = this.props;
		//return null;
		if (!header.open) {return null};

		const NavButton = (
			<IconButton 
				onClick={this.handleToggleNavDrawer}
			>
				<NavIcon />
			</IconButton>
		)

		const appBarProps = {
			title: this.state.title,
			iconElementLeft: NavButton,
			//className: 'Header-AppBar',
			style: {
				backgroundColor: COLORS.blackGray,
				textAlign: 'center',
				zIndex: '1',
			},
		}

		return (
			<AppBar {...appBarProps}>
				
			</AppBar>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		header: getHeader(state),
		userData: getUserData(state),
		meetings: getMeetings(state),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		toggleNavDrawer: (params) => {
			dispatch(toggleNavDrawer(params));
		}
	}
}


const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(Header)

export default withRouter(Connected);