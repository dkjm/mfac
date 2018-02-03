import React, {Component} from 'react';
import './UserInvitations.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import UserMeetingInvitationCard from '../UserMeetingInvitationCard';
import CardListContainer from '../CardListContainer';

import {getUserMeetingInvitations} from '../../selectors';


class UserInvitations extends Component {

  handleRequestViewDetail = (invitationId) => {
    const {history} = this.props;
    const path = `/invitations/${invitationId}`;
    history.push(path);
  }

  renderInvitations = () => {
    const invitations = this.props.meetingInvitations;
    if (!invitations) {return null};
    const renderedItems = invitations.map(i => 
      <UserMeetingInvitationCard 
            key={i.id} 
            invitation={i} 
            onRequestViewDetail={() => this.handleRequestViewDetail(i.id)}
          />
    )
    return renderedItems;
  }

  render() {
    return(
      <div style={styles.container}>
        <div style={styles.header}>
          Invitations
        </div>
        <CardListContainer>
          {this.renderInvitations()}
        </CardListContainer>
      </div>
    )
  }
}

const styles = {
  container: {
    padding: '15px 0',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}


const mapStateToProps = (state, ownProps) => {
  return {
    meetingInvitations: getUserMeetingInvitations(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInvitations)

export default withRouter(Connected);