import React, { Component } from 'react';
import {connect} from 'react-redux'
import './MeetingParticipants.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import CardListContainer from '../CardListContainer';
import ParticipantCard from '../ParticipantCard';

import {getMeetingParticipants} from '../../selectors';


class MeetingParticipants extends Component {

  renderParticipants() {
    const {participants} = this.props;
    if (!participants.length) {
      return <OnlyYou />
    }
    const renderedParticipants = participants.map(p => <ParticipantCard key={p.id} participant={p} />)

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
    	<div>
    		<CardListContainer>
    			{this.renderParticipants()}
    		</CardListContainer>
    	</div>
    )
  }
}

const OnlyYou = () => <div style={styles.onlyYou}>You're the only one here</div>

const styles = {
  onlyYou: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
  },
}


const mapStateToProps = (state) => {
  return {
    participants: getMeetingParticipants(state),
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