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
import {getHeader} from '../../selectors';
import {getUserData} from '../../selectors';

// header is passed location prop from
// app.js component and it should read
// current url and pass isSelected to navItems
class Header extends Component {

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
			title: userData.full_name || COMPANY_NAME,
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