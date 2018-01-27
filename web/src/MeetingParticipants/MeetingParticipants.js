import React, { Component } from 'react';
import {connect} from 'react-redux'
import './MeetingParticipants.css';
import {withRouter} from 'react-router-dom' 

import {
  loadTopics,
  socketConnect,
  connectMeetingSocket,
} from '../api';

import CardListContainer from '../CardListContainer';

import * as selectors from '../selectors';

import ParticipantCard from '../ParticipantCard';

import FlipMove from 'react-flip-move';



class MeetingParticipants extends Component {

  renderParticipants() {
    const renderedParticipants = this.props.participants.map(p => <ParticipantCard key={p.id} participant={p} />)

    return (
      <FlipMove
        duration={1000}
        delay={10}
        easing={'cubic-bezier(0.25, 0.5, 0.75, 1)'}
        staggerDurationBy={30}
        staggerDelayBy={10}
      >
        {renderedParticipants}
      </FlipMove>
    )
  }


  render() {
    return (
    	<div className="MeetingParticipants-container">
    		<CardListContainer>
    			{this.renderParticipants()}
    		</CardListContainer>
    	</div>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

// not connecting this component directly
// thru redux store.  Going to use props
// passed in from parent component.  
// (I think parent is MeetingDetail)
//Using dummy data to simulate
const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingParticipants)

export default withRouter(Connected);
//export default Connected;



