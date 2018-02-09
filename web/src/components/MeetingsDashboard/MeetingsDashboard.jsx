import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import MeetingCard from '../MeetingCard/MeetingCard';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';

import {COLORS} from '../../constants';
import {getMeetings} from '../../selectors';
import {loadMeetings} from '../../services/api';


class MeetingsDashboard extends Component {

	componentWillMount() {
		this.props.loadMeetings();
	}

	handleSelect = (meeting_id) => {
		const path = `/meetings/${meeting_id}/home`;
		this.props.history.push(path);
	}

	handleRequestAddMeeting = () => {
    const {match, history} = this.props;
    const path = '/meetings/meeting_form/create';
    history.push(path);
  }

	renderItems() {
		const {meetings} = this.props;
		if (!meetings.length) {return <NoItems />};
		const renderedItems = meetings.map((m, index) => {
			return (
				<MeetingCard 
					key={m.id} 
					meeting={m} 
					onClick={() => this.handleSelect(m.id)}
				/>
			)
		})
		return renderedItems;
	}
	
	render() {
		const {meetings} = this.props;

		return (
			<div style={styles.container}>
								
				<CardListContainer>
					{this.renderItems()}
				</CardListContainer>

				<FloatingActionButton
          onClick={this.handleRequestAddMeeting}
          backgroundColor={COLORS.reactBlue} 
          iconStyle={{fill: COLORS.blackGray}}
          style={styles.fab}>
          <ContentAdd />
        </FloatingActionButton>
			</div>
		)
	}
}

const NoItems = () => (
  <div style={styles.noItems}>
    No meetings
  </div>
)

const styles = {
	container: {
		margin: '15px 0',
	},
	header: {
    marginBottom: '20px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
	fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10',
  },
  noItems: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
  },
}


const mapStateToProps = (state, ownProps) => {
	return {
		meetings: getMeetings(state),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loadMeetings: () => dispatch(loadMeetings()),
	}
}

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingsDashboard)

export default withRouter(Connected)