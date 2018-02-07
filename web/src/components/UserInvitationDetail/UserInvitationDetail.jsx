import React, {Component} from 'react';
import './UserInvitationDetail.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';
import {getUserMeetingInvitation} from '../../selectors';
import {acceptOrDeclineMeetingInvitation} from '../../services/session';

// TODO(MPP - 180202) - currently, if invitation is removed
// by another user, this user will receive
// a message that removes this invitation
// from state, and so this component will
// just render null and not kniow what to do
// Need to implement some check when remove
// invitation message is received and bounce
// user back to main invitations view

class UserInvitationDetail extends Component {

  handleGoToMeeting = () => {
    const {meetingInvitation, history} = this.props;
    const meeting_id = meetingInvitation.meeting.id;
    const path = `/meetings/${meeting_id}`;
    history.push(path);
  }

  handleAction = (action) => {
    const {
      match,
      acceptOrDeclineMeetingInvitation,
    } = this.props;

    const {meeting_invitation_id} = match.params;
    const params = {
      meeting_invitation_id,
      action,
    }
    acceptOrDeclineMeetingInvitation(params);
  }

  renderButtons() {
    const mi = this.props.meetingInvitation;
    if (mi.status === 'PENDING') {
      return (
        <div style={styles.buttonsContainer}>
          <Button
            label="Accept"
            onClick={() => this.handleAction('accept')}
          />
          <Button
            label="Decline"
            onClick={() => this.handleAction('decline')}
          />
        </div>
      )
    }
    else if (mi.status === 'ACCEPTED') {
      return (
        <div style={styles.buttonsContainer}>
          <Button
            label="Go to meeting"
            onClick={this.handleGoToMeeting}
          />
          <Button
            label="Decline"
            onClick={() => this.handleAction('decline')}
          />
        </div>
      )
    }
    else if (mi.status === 'DECLINED') {
      return (
        <div style={styles.buttonsContainer}>
          <Button
            label="Accept"
            onClick={() => this.handleAction('accept')}
          />
        </div>
      )
    }
  }

  render() {
    const {meetingInvitation} = this.props;
    if (!meetingInvitation) {return <NotFound />};
    const mi = meetingInvitation;

    return(
      <div style={styles.container}>
        <Paper 
          style={styles.paper} 
          zDepth={2}
        >
          <div style={styles.fieldsContainer}>
            <LabelValue label="Meeting" value={mi.meeting.title} />
            <LabelValue label="Inviter" value={mi.inviter.full_name} />
            <LabelValue label="Sent on" value={mi.inserted_at} />
            <LabelValue label="Status" value={mi.status} />
          </div>
      
          {this.renderButtons()}
        </Paper>
        
      </div>
    )
  }
}

const Button = (props) => {
  const styles = {
    container: {
      maxWidth: '150px',
      flexGrow: '1',
    },
    root: {

    },
    buttonStyle: {
      minHeight: '60px'
    },
    labelStyle: {
      color: COLORS.white,
    },
  }
  return (
    <div style={styles.container}>
      <RaisedButton 
        style={styles.root}
        buttonStyle={styles.buttonStyle}
        labelStyle={styles.labelStyle}
        label={props.label} 
        backgroundColor={COLORS.blackGray}
        onClick={props.onClick}
        fullWidth={true}
      />
    </div>
  )
}

const NotFound = () => (
  <div style={styles.notFound}>
    Invitation not found
  </div>
)

const styles = {
  container: {

  },
  paper: {
    margin: '10px 15px 20px',
    padding: '10px',
    textAlign: 'left',
    height: '100%',
  },
  fieldsContainer: {

  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  notFound: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
  },
}


const mapStateToProps = (state, ownProps) => {
  const {meeting_invitation_id} = ownProps.match.params;
  return {
    meetingInvitation: getUserMeetingInvitation(state, {meeting_invitation_id}),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    acceptOrDeclineMeetingInvitation: (params) => dispatch(acceptOrDeclineMeetingInvitation(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInvitationDetail)

export default withRouter(Connected);