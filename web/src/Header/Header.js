import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './Header.css'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Link} from 'react-router'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import NavIcon from 'material-ui/svg-icons/navigation/menu'
import {COLORS, COMPANY_NAME} from '../constants';

import {toggleNavDrawer} from '../services/ui';

// header is passed location prop from
// app.js component so that it can read
// url and pass isSelected to navItems
class Header extends Component {

	handleToggleNavDrawer = () => {
		//console.log('handleToggleNavDrawer');
		this.props.toggleNavDrawer();
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
		headerVisible: state.ui.headerVisible,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		toggleNavDrawer: () => {
			dispatch(toggleNavDrawer());
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Header)