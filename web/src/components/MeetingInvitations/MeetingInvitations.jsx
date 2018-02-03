import React, {Component} from 'react';
import './MeetingInvitations.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import MeetingInvitationCard from '../MeetingInvitationCard';
import CardListContainer from '../CardListContainer';

import {COLORS} from '../../constants';
import {getMeetingInvitations} from '../../selectors';


class MeetingInvitations extends Component {

  handleRequestViewDetail = (invitationId) => {
    const {history, match} = this.props;
    const path = `${match.url}/${invitationId}`;
    history.push(path);
  }

  handleRequestAddInvitation = () => {
    const {history, match} = this.props;
    const path = `${match.url}/invitation_form/create`;
    history.push(path);
  }

  renderInvitations = () => {
    const {meetingInvitations} = this.props;
    if (!meetingInvitations) {return null};
    const renderedItems = meetingInvitations.map(i => 
      <MeetingInvitationCard 
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

        {/*<div style={styles.header}>
          Invitations
        </div>*/}
        <CardListContainer>
          {this.renderInvitations()}
        </CardListContainer>

        <FloatingActionButton
          onClick={this.handleRequestAddInvitation}
          backgroundColor={COLORS.reactBlue} 
          iconStyle={{fill: COLORS.blackGray}}
          style={styles.fab}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

const styles = {
  container: {
    padding: '15px 0',
  },
  header: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10',
  },
}


const mapStateToProps = (state, ownProps) => {
  return {
    meetingInvitations: getMeetingInvitations(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingInvitations)

export default withRouter(Connected);