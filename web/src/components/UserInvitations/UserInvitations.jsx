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
    if (!invitations.length) {return <NoItems />};
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
    const invitations = this.props.meetingInvitations;
    return(
      <div style={styles.container}>
        <CardListContainer>
          {this.renderInvitations()}
        </CardListContainer>
      </div>
    )
  }
}

const NoItems = () => (
  <div style={styles.noItems}>
    You don't have any invitations
  </div>
)

const styles = {
  container: {
    padding: '15px 0',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noItems: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
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