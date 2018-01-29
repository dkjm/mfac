import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './NavDrawer.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';

import NavClose from 'material-ui/svg-icons/navigation/close';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContactsIcon from 'material-ui/svg-icons/communication/contacts';
import Home from 'material-ui/svg-icons/action/home';
import SupervisorAccount from 'material-ui/svg-icons/action/supervisor-account';
import GroupWork from 'material-ui/svg-icons/action/group-work';
import PermMedia from 'material-ui/svg-icons/action/perm-media';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import ListIcon from 'material-ui/svg-icons/action/list';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import CogIcon from 'material-ui/svg-icons/action/settings';
import FlagIcon from 'material-ui/svg-icons/image/assistant-photo';

import {toggleNavDrawer} from '../../services/ui';
import {getNavDrawer} from '../../selectors';

import {
	NAV_DRAWER_WIDTH,
	COLORS, 
	COMPANY_NAME,
} from '../../constants'


const styles = {
	root: {

	},
	container: {
		height: '100vh',
		backgroundColor: COLORS.grayBackground,
	},
	menu: {
		backgroundColor: COLORS.grayBackground,
		padding: '20px 0',
	}
}


class NavDrawer extends Component {

	handleToggleNavDrawer = () => {
		this.props.toggleNavDrawer({open: false});
	}

	handleSelectItem = (url) => {
		this.context.router.history.push(url);
		this.props.toggleNavDrawer({open: false});
	}

	handleRequestLogout = () => {
		// TODO
	}

	makeNavItems = () => {
		const items = [
			{
		    primaryText: 'Dashboard',
		    leftIcon: <Home />,
		    onClick: () => this.handleSelectItem('/dashboard'),
		    widget: ListItem,
		    value: 0,
		  },
		  {
		    primaryText: 'Meetings',
		    leftIcon: <GroupWork />,
		    onClick: () => this.handleSelectItem('/meetings/dashboard'),
		    //onClick: () => this.handleSelectItem('/meetings'),
		    widget: ListItem,
		    value: 1,
		  },
		  {
		    primaryText: 'Groups',
		    leftIcon: <SupervisorAccount />,
		    onClick: () => this.handleSelectItem('/groups'),
		    widget: ListItem,
		    value: 2,
		  },
		  {
		    primaryText: 'Contacts',
		    leftIcon: <ContactsIcon />,
		    onClick: () => this.handleSelectItem('/contacts'),
		    widget: ListItem,
		    value: 3,
		  },
		  {
		    primaryText: 'Compose',
		    leftIcon: <PencilIcon />,
		    onClick: () => this.handleSelectItem('/compose'),
		    widget: ListItem,
		    value: 4,
		  },
		  {
		    primaryText: 'Notes',
		    leftIcon: <AssignmentIcon />,
		    onClick: () => this.handleSelectItem('/notes'),
		    widget: ListItem,
		    value: 5,
		  },
		  {
		    primaryText: 'Files',
		    leftIcon: <PermMedia />,
		    onClick: () => this.handleSelectItem('/files'),
		    widget: ListItem,
		    value: 6,
		  },
		  {
		    primaryText: 'More',
		    leftIcon: <FlagIcon />,
		    onClick: () => this.handleSelectItem('/more'),
		    widget: ListItem,
		    value: 7,
		  },
		  {
		    primaryText: 'Settings',
		    leftIcon: <CogIcon />,
		    onClick: () => this.handleSelectItem('/settings'),
		    widget: ListItem,
		    value: 8,
		  },
		  {
		    primaryText: 'Logout',
		    leftIcon: <ArrowBack />,
		    onClick: this.handleRequestLogout,
		    widget: ListItem,
		    value: 9,
		  },
		]

		return items
	}

	renderNavItems() {
		const items = this.makeNavItems();

		const style = {
			textAlign: 'left',
		}

		const renderedItems = items.map((item, index) => {
			const {widget, ...rest} = item
			return (
			  <item.widget 
			    key={item.value}
			    style={style}
			    {...rest}
			  />
			 )
		})

		return (
			<div 
				style={styles.menu}
				className="NavDrawer-items-container">
					{renderedItems}
			</div>
		)
	}


	renderHeader = () => {
		// ** 180127 - MPP - Currently not using 
		// this method (i.e. no header is rendered)
		// inside NavDrawer comp
		const CloseButton = (
			<IconButton onClick={this.handleToggleNavDrawer}>
				<NavClose />
			</IconButton>
		)

		const barProps = {
			title: COMPANY_NAME,
  		iconElementLeft: CloseButton,
  		style: {
  			//backgroundColor: COLORS.navy,
  			backgroundColor: COLORS.blackGray,
  		},
  	}

		//return <AppBar {...barProps} />
	}



  render() {
  	const {navDrawer} = this.props;

  	const props = {
  		// docked props will make overlay not show
  		//docked: true,
  		docked: false,
  		width: NAV_DRAWER_WIDTH,
  		open: navDrawer.open,
  		onRequestChange: this.handleToggleNavDrawer,
  		containerStyle: styles.container,
  		style: styles.root,
  		zDepth: 0,
  		containerClassName: 'NavDrawer-container',
  	}
    return (
      <div className="NavDrawer-container">
        <Drawer {...props} >
        	{this.renderHeader()}
          {this.renderNavItems()}
        </Drawer>
      </div>
    )
  }
}

NavDrawer.contextTypes = {
  router: PropTypes.object,
};


const mapStateToProps = (state, ownProps) => {
  return {
    navDrawer: getNavDrawer(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  	toggleNavDrawer: (params) => {
  		dispatch(toggleNavDrawer(params));
  	}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavDrawer)