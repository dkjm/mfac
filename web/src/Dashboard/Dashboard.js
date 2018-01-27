import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import '../index.css'
import logo from '../logo.svg';
import NotificationCard from '../NotificationCard/NotificationCard';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';

class Dashboard extends Component {

	componentWillMount() {
		//this.props.loadNotifications();
	}

	renderItems() {
		const notifications = [
			{
				id: 0, text: 'You finished Meeting A at 3:50 today.'
			},
			{
				id: 1, text: 'Chris Edelson added a new topic to Meeting B.',
			},
			{
				id: 2, text: 'You added a file "Book about thing" to Meeting C',
			},
		]

		const renderedItems = notifications.map((item, index) => {
			
			return (
				<NotificationCard key={item.id} notification={item} />
			)
		})

		return renderedItems;
	}
	
	render() {
		return (
			<div>
				<LayoutBanner title="Dashboard" />
				<CardListContainer>
					{this.renderItems()}
				</CardListContainer>
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
		// key: bindActionCreators({
		// 	...myActions,
		// }, dispatch),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Dashboard)