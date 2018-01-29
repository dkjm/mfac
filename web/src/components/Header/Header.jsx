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

// header is passed location prop from
// app.js component and it should read
// current url and pass isSelected to navItems
class Header extends Component {

	handleToggleNavDrawer = () => {
		this.props.toggleNavDrawer({open: true});
	}

	render() {
		const NavButton = (
			<IconButton 
				onClick={this.handleToggleNavDrawer}
			>
				<NavIcon />
			</IconButton>
		)

		const appBarProps = {
			title: COMPANY_NAME,
			iconElementLeft: NavButton,
			className: 'Header-AppBar',
			style: {
				//backgroundColor: COLORS.navy,
				//backgroundColor: COLORS.blackGray,
				//backgroundColor: COLORS.reactBlue,
				backgroundColor: COLORS.midnightGray,
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