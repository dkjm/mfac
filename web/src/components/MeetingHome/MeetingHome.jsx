import React, {Component} from 'react';
import './MeetingHome.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';

import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';
import {getMeeting} from '../../selectors';



const EditButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      backgroundColor={COLORS.reactBlue}>
      <PencilIcon />
    </FloatingActionButton>
  )
}


class MeetingHome extends Component {

  handleRequestUpdateMeetingDetails = () => {
    const {match, history} = this.props;
    const path = match.url.replace('home', `meeting_form/update`);
    history.push(path);
  }

  renderDetails() {
    const {meeting} = this.props;
    const m = meeting;
    return (
      <div style={styles.detailsContainer}>
        <LabelValue label="Meeting title" value={m.title} />
        <LabelValue label="Description" value={m.description} />
        <LabelValue label="Created by" value={m.owner.full_name} />
        <LabelValue label="Created on" value={m.created_on} />
      </div>
    )
  }

  render() {
    const {meeting} = this.props;
    if (!meeting) {return null};

    return(
      <Paper 
        style={styles.paper} 
        zDepth={2}
      >
        <div style={styles.editButtonContainer}>
          <EditButton onClick={this.handleRequestUpdateMeetingDetails} />
        </div>

        {this.renderDetails()}

      </Paper>
    )
  }
}

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
}


const mapStateToProps = (state, ownProps) => {
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
)(MeetingHome)

export default withRouter(Connected);