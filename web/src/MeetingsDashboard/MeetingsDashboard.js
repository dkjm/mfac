import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import MeetingCard from '../MeetingCard/MeetingCard';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';
import {withRouter} from 'react-router-dom' 

class MeetingsDashboard extends Component {

	handleSelect = (meeting_id) => {
		//const path = `/meetings/${meeting_id}`;
		const path = `/meetings/${meeting_id}/home`;
		//this.props.history.push("/meetings/"+meeting_id);
		this.context.router.history.push(path);
	}

	renderItems() {
		const items = [
			{
				id: 0, title: 'Meeting A', text: 'You finished Meeting A at 3:50 today.'
			},
			{
				id: 1, title: 'Meeting B', text: 'Chris Edelson added a new topic to Meeting B.',
			},
			{
				id: 2, title: 'Meeting C', text: 'You added a file "Book about thing" to Meeting C',
			},
		]

		const renderedItems = items.map((item, index) => {
			
			return (
				<MeetingCard 
					key={item.id} 
					meeting={item} 
					onClick={() => this.handleSelect(item.id)}
				/>
			)
		})

		return renderedItems;
	}
	
	render() {

		return (
			<div>
				<LayoutBanner title="Meetings" />
				<CardListContainer>
					{this.renderItems()}
				</CardListContainer>
			</div>
		)
	}
}

MeetingsDashboard.contextTypes = {
  router: PropTypes.object,
};


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

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingsDashboard)

export default withRouter(Connected)