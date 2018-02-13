import React, {Component} from 'react';
import './AgendaItemDetail.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';
import RefreshIcon from 'material-ui/svg-icons/action/autorenew';
import TriangleIcon from 'material-ui/svg-icons/action/change-history';
import PageIcon from 'material-ui/svg-icons/action/description';


import VoteArrows from '../VoteArrows';
import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';
import {
  deleteAgendaItem,
  postAgendaItemVote,
  addOrRemoveStackEntry,
  changeAgendaItemStatus,
} from '../../services/api';
import {
  getAgendaItem, 
  getUserData,
  getIsUserInStack,
  getProposals,
} from '../../selectors';

// limit for how many chars of body
// we want to display in header section body.
// Will probably include a button to expand and
// show all.
const bodyLimit = 90;

// leaving statusIcon as external comp
// with wrapper div in case we need
// to change its style and position
// with more precision
const statusIcon = (
  <div>
    <CheckIcon />
  </div>
)

const AddButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      backgroundColor={COLORS.reactBlue}>
      <ContentAdd />
    </FloatingActionButton>
  )
}

const DeleteButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      backgroundColor={COLORS.reactBlue}>
      <ContentRemove />
    </FloatingActionButton>
  )
}

const EditButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      style={{marginBottom: '20px'}}
      backgroundColor={COLORS.reactBlue}>
      <PencilIcon />
    </FloatingActionButton>
  )
}

const OpenOrCloseButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      style={{marginBottom: '20px'}}
      backgroundColor={props.color || COLORS.cyan50}>
      {props.icon}
    </FloatingActionButton>
  )
}


const DeleteAgendaItemButton = (props) => {
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

const SpeakButton = (props) => {
  const styles = {
    container: {
      padding: '0 15px',
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


const StackItem = ({item}) => {
  const s = {
    container: {
      marginBottom: '10px',
    },
    header: {

    },
  }
  return (
    <div style={s.container}>
      <div style={s.header}>
        {item.owner.full_name}
      </div>
    </div>
  )
}


const StackSection = (props) => {
  const {
    items, 
    onRequestAdd,
    onRequestRemove, 
    showButton,
    iconType, // 'minus' or 'plus'
  } = props;

  if (!items) {return null};

  const s = {
    container: {
      //minHeight: '80px',
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      minHeight: '50px',
    },
    header: {
      fontSize: '130%',
      fontWeight: 'bold',
      paddingTop: '5px',
    },
    button: {

    }
  }
  let button = null;
  if (showButton) {
    if (iconType === 'plus') {
      button = <AddButton onClick={onRequestAdd} />
    }
    else {
      button = <DeleteButton onClick={onRequestRemove} />
    }
  }
  return (
    <div style={s.container}>
      <div style={s.top}>
        <div style={s.header}>
          Stack
        </div>
        <div style={s.button}>
          {button}
        </div>
      </div>
      <div style={s.list}>
        {
          items.map(item => <StackItem key={item.id} item={item} />)
        }
      </div>
    </div>
  )
}


const ProposalItem = ({item, onClick}) => {
  const s = {
    container: {
      marginBottom: '10px',
    },
    header: {

    },
  }
  return (
    <div style={s.container} onClick={onClick}>
      <div style={s.header}>
        {item.title}
      </div>
    </div>
  )
}

const ProposalsSection = (props) => {
  const {
    items, 
    onRequestAdd,
    onRequestView, 
    showButton,
    iconType, // 'minus' or 'plus'
  } = props;

  if (!items) {return null};

  const s = {
    container: {
      //minHeight: '80px',
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      minHeight: '50px',
    },
    header: {
      fontSize: '130%',
      fontWeight: 'bold',
      paddingTop: '5px',
    },
    button: {

    }
  }
  let button = null;
  if (showButton) {
    button = <AddButton onClick={onRequestAdd} />
  }
  return (
    <div style={s.container}>
      <div style={s.top}>
        <div style={s.header}>
          Proposals
        </div>
        <div style={s.button}>
          {button}
        </div>
      </div>
      <div style={s.list}>
        {
          items.map(item => <ProposalItem key={item.id} item={item} onClick={() => onRequestView(item.id)} />)
        }
      </div>
    </div>
  )
}

class AgendaItemDetail extends Component {

  handleRequestCreateProposal = () => {
    const {match, history} = this.props;
    const path = `${match.url}/proposal_form/create`;
    history.push(path);
  }

  handleRequestViewProposal = (proposal_id) => {
    const {match, history} = this.props;
    const path = `${match.url}/proposals/${proposal_id}`;
    history.push(path);
  }

  handleRequestDeleteAgendaItem = () => {
    const {match} = this.props;
    const {agenda_item_id} = match.params;
    const params = {agenda_item_id}
    this.props.deleteAgendaItem(params);
  }

  handleRequestPostVote = (vote_type) => {
    const {match} = this.props;
    const {agenda_item_id} = match.params;
    const params = {
      agenda_item_id,
      vote_type,
    }
    this.props.postAgendaItemVote(params);
  }

  handleRequestAddOrRemoveStackEntry = (action) => {
    const {
      agendaItem,
      addOrRemoveStackEntry,
    } = this.props;
    const params = {
      agenda_item_id: agendaItem.id,
      action,
    }
    addOrRemoveStackEntry(params);
  }

  handleRequestUpdateAgendaItem = () => {
    const {match, history} = this.props;
    // TODO(MPP):  make more robust routing instead of just doing replace as below
    const path = match.url.replace('agenda_items', `agenda_item_form/update`);
    history.push(path);
  }

  handleRequestChangeAgendaItemStatus = (status) => {
    const {agendaItem, changeAgendaItemStatus} = this.props;
    const params = {
      agenda_item_id: agendaItem.id,
      status,
    }
    changeAgendaItemStatus(params);
  }

  handleRequestSpeak = () => {
    // TODO(MP 2/9): implement this func;
    // Maybe push to a view with a single
    // text input and a speech dictation
    // button.  User hits button, speech
    // recognition starts up, populating
    // form input with speech to text.
    // Throttle updates to state (e.g. with
    // setInterval or lodash/throttle)
  }

  renderTopRightButtons() {
    const {agendaItem} = this.props;
    const {status} = agendaItem;

    if (status === 'OPEN') {
      return (
        <div>
          <EditButton onClick={this.handleRequestUpdateAgendaItem} />
          <OpenOrCloseButton 
            onClick={() => this.handleRequestChangeAgendaItemStatus('CLOSED')}
            icon={<CheckIcon />}
            color={COLORS.indigo200}  
          />
          <OpenOrCloseButton 
            onClick={this.handleRequestCreateProposal}
            icon={<PageIcon />}
            color={COLORS.cyan200}  
          />
        </div>
      )
    }
    else if (status === 'PENDING') {
      return (
        <div>
          <EditButton onClick={this.handleRequestUpdateAgendaItem} />
          <OpenOrCloseButton 
            onClick={() => this.handleRequestChangeAgendaItemStatus('CLOSED')}
            color={COLORS.indigo200} 
            icon={<CheckIcon />} 
          />
          <OpenOrCloseButton 
            onClick={() => this.handleRequestChangeAgendaItemStatus('OPEN')}
            icon={<TriangleIcon />}
          />
        </div>
      )
    }
    else if (status === 'CLOSED') {
      return (
        <div>
          <OpenOrCloseButton 
            onClick={() => this.handleRequestChangeAgendaItemStatus('PENDING')}
            icon={<RefreshIcon />} 
          />
        </div>
      )
    }
  }

  render() {
    const {
      agendaItem,
      userData, 
      isUserInStack,
      proposals,
    } = this.props;

    if (!agendaItem) {return <NotFound />};

    const i = agendaItem;

    return(
      <div>
      <Paper 
        style={styles.paper} 
        zDepth={2}
      >
        

        <div style={styles.headerSectionContainer}>
          <div style={styles.leftBlock}>
            <VoteArrows 
              onClickVote={this.handleRequestPostVote} 
              votes={i.votes} 
              disableVoting={i.status === 'CLOSED'}
            />
          </div>

          <div style={styles.rightBlock}>
            <div style={styles.rightBlockTop}>
              <div style={styles.title}>
                {i.title}
              </div>

              {/*<div style={styles.status}>
                {i.status === 'CLOSED' && statusIcon}
              </div>*/}
            </div>

            <div style={styles.rightBlockBottom}>
              <div style={styles.body}>
                {i.body.length < bodyLimit ? i.body : i.body.substring(0, bodyLimit) + '...'}
              </div>
            </div>

          </div>

          <div style={styles.thirdBlock}>
            <div style={styles.thirdBlockInner}>
            {this.renderTopRightButtons()}
            </div>
          </div>
        </div>

        <div styles={styles.detailsSectionContainer}>
          <LabelValue 
            label="Created by" 
            value={i.owner.full_name} 
          />
          <LabelValue 
            label="Status" 
            value={i.status} 
          />
        </div>

      </Paper>

      <Paper 
        style={styles.paper} 
        zDepth={2}
      >

        <div style={styles.stackSectionContainer}>
          <ProposalsSection 
            onRequestAdd={this.handleRequestCreateProposal}
            onRequestView={this.handleRequestViewProposal}
            items={proposals} 
            showButton={true}
          />
        </div>

      </Paper>

      {isUserInStack && (i.status === 'OPEN') && (
        <div style={styles.speakButtonContainer}>
          <SpeakButton 
            label="Speak"
            onClick={this.handleRequestSpeak} 
          />
        </div>
      )}

      <Paper 
        style={styles.paper} 
        zDepth={2}
      >

        <div style={styles.stackSectionContainer}>
          <StackSection 
            onRequestAdd={() => this.handleRequestAddOrRemoveStackEntry('add')}
            onRequestRemove={() => this.handleRequestAddOrRemoveStackEntry('remove')}
            items={i.stack_entries} 
            showButton={i.status !== 'CLOSED'}
            iconType={isUserInStack ? 'minus' : 'plus'}
          />
        </div>

      </Paper>

      <div style={styles.bottomButtonsContainer}>
        <DeleteAgendaItemButton 
          label="Delete"
          onClick={this.handleRequestDeleteAgendaItem} 
        />
      </div> 
      </div>
    )
  }
}


const NotFound = () => (
  <div style={styles.notFound}>
    Agenda item not found
  </div>
)


const styles = {
  paper: {
    margin: '10px 15px 20px',
    padding: '10px',
    textAlign: 'left',
  },
  speakButtonContainer: {
    marginBottom: '20px',
  },
  bottomButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0px 0px 40px',
  },
  topRightButtonsContainer: {

  },
  headerSectionContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  detailsSectionContainer: {

  },
  stackSectionContainer: {

  },
  thirdBlock: {
    //border: 'solid blue',
    flexGrow: '1',
    maxWidth: '50px',
    //width: '10%',
    textAlign: 'center',
    //float: 'right',
  },
  thirdBlockInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftBlock: {

  },
  rightBlock: {
    padding: '18px 0 0 20px',
    flexGrow: '4',
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
    marginTop: '100px',
  },
}



const mapStateToProps = (state, ownProps) => {
  const {agenda_item_id} = ownProps.match.params;
  return {
    agendaItem: getAgendaItem(state, {agenda_item_id}),
    proposals: getProposals(state, {agenda_item_id}),
    userData: getUserData(state),
    isUserInStack: getIsUserInStack(state, {agenda_item_id}),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteAgendaItem: (params) => dispatch(deleteAgendaItem(params)),
    addOrRemoveStackEntry: (params) => dispatch(addOrRemoveStackEntry(params)),
    postAgendaItemVote: (params) =>
      dispatch(postAgendaItemVote(params)),
    changeAgendaItemStatus: (params) => dispatch(changeAgendaItemStatus(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AgendaItemDetail)

export default withRouter(Connected);