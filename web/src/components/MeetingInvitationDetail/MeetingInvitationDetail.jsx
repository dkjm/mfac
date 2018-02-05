import React, {Component} from 'react';
import './MeetingInvitationDetail.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';
import TrashIcon from 'material-ui/svg-icons/action/delete';

import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';
import {getMeetingInvitation} from '../../selectors';
import {deleteMeetingInvitation} from '../../services/api';



const EditButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      backgroundColor={COLORS.reactBlue}>
      <TrashIcon />
    </FloatingActionButton>
  )
}


class MeetingInvitationDetail extends Component {

  // TODO(MPP) ??
  handleRequestUpdateInvitation = () => {
    
  }

  handleRequestDeleteInvitation = () => {
    const {match, deleteMeetingInvitation} = this.props;
    const {meeting_invitation_id} = match.params;
    deleteMeetingInvitation({meeting_invitation_id})
  }

  renderDetails() {
    const {meetingInvitation} = this.props;
    const m = meetingInvitation;
    return (
      <div style={styles.detailsContainer}>
        <LabelValue label="Invitee" value={m.invitee.full_name} />
        <LabelValue label="Status" value={m.status} />
        <LabelValue label="Created by" value={m.inviter.full_name} />
        <LabelValue label="Created on" value={m.created_on} />
      </div>
    )
  }

  render() {
    const {meetingInvitation} = this.props;
    if (!meetingInvitation) {return <NotFound />};

    return(
      <Paper 
        style={styles.paper} 
        zDepth={2}
      >
        <div style={styles.editButtonContainer}>
          <EditButton onClick={this.handleRequestDeleteInvitation} />
        </div>

        {this.renderDetails()}

      </Paper>
    )
  }
}

const NotFound = () => (
  <div style={styles.notFound}>
    Inivitation not found
  </div>
)

const styles = {
  paper: {
    margin: '10px 15px 20px',
    padding: '10px',
    textAlign: 'left',
  },
  editButtonContainer: {
    float: 'right',
    // textAlign: 'right',
    // position: 'absolute',
    // right: '10px',
  },
  headerSectionContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  detailsSectionContainer: {

  },
  stackSectionContainer: {

  },
  leftBlock: {

  },
  rightBlock: {
    padding: '18px 0 0 20px',
    flexGrow: '3',
  },
  rightBlockTop: {
    display: 'flex',
  },
  title: {
    width: '90%',
    fontSize: '110%',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  status: {
    width: '10%',
  },
  rightBlockBottom: {

  },
  body: {

  },
  icon: {
    transform: 'rotate(0.875turn)',
    padding: '0 !important',
  },
  notFound: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
}


const mapStateToProps = (state, ownProps) => {
  const {match} = ownProps;
  const {meeting_invitation_id} = match.params;
  return {
    meetingInvitation: getMeetingInvitation(state, {meeting_invitation_id})
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteMeetingInvitation: (params) => dispatch(deleteMeetingInvitation(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingInvitationDetail)

export default withRouter(Connected);