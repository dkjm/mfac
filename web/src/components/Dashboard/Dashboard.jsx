import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import logo from '../../resources/logo.svg';
import NotificationCard from '../NotificationCard/NotificationCard';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';

import {notifications} from '../../resources/testData';

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
		return (
			<div style={styles.container}>
				<LayoutBanner title="Dashboard" />
			</div>
		)
	}
}

const styles = {
	container: {
		//textAlignt: 'center',
		padding: '40px',
		display: 'flex',
		justifyContent: 'center',
	},
}


const mapStateToProps = (state, ownProps) => {
	return {
		
	}
}

const mapDispatchToProps = (dispatch) => {
	return {

	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Dashboard)