import React, { Component } from 'react';
import {connect} from 'react-redux'
import './MeetingParticipants.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import * as selectors from '../../selectors';

import CardListContainer from '../CardListContainer';
import ParticipantCard from '../ParticipantCard';

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

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingParticipants)

export default withRouter(Connected);