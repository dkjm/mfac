import React, {Component} from 'react';
import './ProposalDetail.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';

import LabelValue from '../LabelValue';
import VoteArrows from '../VoteArrows';

import {COLORS} from '../../constants';
import {getProposal, getAmendments, getUserData} from '../../selectors';
import {
  deleteProposal,
  postProposalVote,
} from '../../services/api';
import {formatVotes} from '../../utils';


class ProposalDetail extends Component {

  handleRequestUpdateProposal = () => {
    const {match, history} = this.props;
    const path = match.url + '/proposal_form/update';
    history.push(path);
  }

  handleRequestDeleteProposal = () => {
    const {
      match,
      deleteProposal,
    } = this.props;
    const {proposal_id} = match.params;
    const params = {proposal_id};
    deleteProposal(params);
  }

  handleRequestPostProposalVote = (vote_value) => {
    const {
      match,
      postProposalVote,
    } = this.props;

    const {agenda_item_id, proposal_id} = match.params;

    // Need to convert string to vote_value
    if (vote_value === 'UP') {
      vote_value = 1;
    }
    else if (vote_value === 'DOWN') {
      vote_value = -1;
    }
    const params = {
      agenda_item_id,
      proposal_id,
      value: vote_value,
    }
    postProposalVote(params);
  }

  renderAmendments() {
    const {proposal} = this.props;
    const {amendments} = proposal;
    console.log('proposal', proposal)
  }

  renderDetails() {
    const p = this.props.proposal;

    return(
      <div style={styles.detailsContainer}>
        <LabelValue label="Created by" value={p.owner.full_name} />
        <LabelValue label="Created at" value={p.inserted_at} />
        <LabelValue label="Title" value={p.title} />
        <LabelValue label="Description" value={p.description} />
      </div>
    )
  }

  render() {
    const {proposal, userData} = this.props;
    if (!proposal) {return <NotFound />};
    const votes = formatVotes(proposal.votes, userData.id);
    return(
      <div style={styles.container}>
        <Paper 
          style={styles.paper} 
          zDepth={2}
        >
          <div style={styles.buttonsContainer}>
            <EditButton onClick={this.handleRequestUpdateProposal} />
            <DeleteButton onClick={this.handleRequestDeleteProposal} />
          </div>
        
          {this.renderDetails()}

          <div>
            <VoteArrows
              onClickVote={this.handleRequestPostProposalVote}
              votes={votes}
              disableVoting={false}
            />
          </div>

        </Paper>
      </div>
    )
  }
}

const EditButton = (props) => {
  return (
    <div style={styles.buttonContainer}>
      <FloatingActionButton
        onClick={props.onClick}
        mini={true}
        iconStyle={{fill: COLORS.blackGray}}
        backgroundColor={COLORS.reactBlue}>
        <PencilIcon />
      </FloatingActionButton>
    </div>
  )
}

const DeleteButton = (props) => {
  return (
    <div style={styles.buttonContainer}>
      <FloatingActionButton
        onClick={props.onClick}
        mini={true}
        iconStyle={{fill: COLORS.white}}
        backgroundColor={COLORS.red400}>
        <ContentRemove />
      </FloatingActionButton>
    </div>
  )
}

const NotFound = () => (
  <div style={styles.notFound}>
    Proposal not found
  </div>
)

const styles = {
  container: {

  },
  paper: {
    margin: '10px 15px 20px',
    padding: '10px',
    textAlign: 'left',
  },
  detailsContainer: {

  },
  buttonsContainer: {
    float: 'right',
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    marginBottom: '10px',
  },
   notFound: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
  },
}

const mapStateToProps = (state, ownProps) => {
  const {agenda_item_id, proposal_id} = ownProps.match.params;
  return {
    proposal: getProposal(state, {agenda_item_id, proposal_id}),
    amendments: getAmendments(state, {agenda_item_id, proposal_id}),
    userData: getUserData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteProposal: (params) => dispatch(deleteProposal(params)),
    postProposalVote: (params) => dispatch(postProposalVote(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProposalDetail)

export default withRouter(Connected);