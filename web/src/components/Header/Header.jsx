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
	getIsUserLoggedIn,
} from '../../selectors';


const meetingDetailRE = /\/meetings\/(\d+)/;
const meetingsRE = /\/meetings\/dashboard/;
const dashboardRE = /\/dashboard/;
const invitationsRE = /\/invitations/;
const settingsRE = /\/settings/;
const loginRE = /\/login/;
const signupRE = /\/signup/;

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
	else if (loginRE.test(p)) {
		return 'Login';
	}
	else if (signupRE.test(p)) {
		return 'Signup';
	}
	else {
		//console.log('No match for: ', p);
		return '';
	}
}


class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			title: '',
			navButtonVisible: true,
		}
	}

	componentWillMount() {
		const {
			isUserLoggedIn,
			location,
		} = this.props
		const path = location.pathname;
		const showNavButton = isUserLoggedIn;
		//const showNavButton = !(path.includes('login') || path.includes('signup'));
		this.setState({
			title: getTitle(path, this.props),
			navButtonVisible: showNavButton,
		});
	}

	componentWillReceiveProps(nextProps) {
		// TODO(MP 2/9): Implement some kind of
		// check here so that (hopefully) don't
		// need to run through getTitle on
		// every props change
		const {
			isUserLoggedIn,
			location,
		} = nextProps
		const path = location.pathname;
		const showNavButton = isUserLoggedIn;
		//const showNavButton = !(path.includes('login') || path.includes('signup'));
		this.setState({
			title: getTitle(path, nextProps),
			navButtonVisible: showNavButton,
		});
	}

	handleToggleNavDrawer = () => {
		this.props.toggleNavDrawer({open: true});
	}

	render() {
		const {userData, header} = this.props;
		if (!header.open) {return null};

		const NavButton = (
			<IconButton 
				onClick={this.handleToggleNavDrawer}
			>
				<NavIcon />
			</IconButton>
		)
		// NOTE(MP 2/9):
		// passing iconElementLeft: null does
		// not hide nav icon.  The only way
		// I could get it to hide was by
		// passing iconStyleLeft with display
		// none.
		const appBarProps = {
			title: this.state.title,
			iconElementLeft: NavButton,
			//className: 'Header-AppBar',
			style: {
				backgroundColor: COLORS.blackGray,
				textAlign: 'center',
				zIndex: '1',
			},
			iconStyleLeft: this.state.navButtonVisible ? {} : {display: 'none'}
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
		isUserLoggedIn: getIsUserLoggedIn(state),
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