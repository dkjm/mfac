import React, {Component} from 'react';
import './AgendaItemDetail.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';

import VoteArrows from '../VoteArrows';
import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';
import {
  postAgendaItemVote,
  submitAgendaItemStackEntryForm,
  requestRemoveAgendaItemStackEntry,
} from '../../services/api';
import {
  getAgendaItem, 
  getUserData,
  getIsUserInStack,
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
      backgroundColor={COLORS.reactBlue}>
      <PencilIcon />
    </FloatingActionButton>
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
        {item.owner_full_name}
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
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
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


class AgendaItemDetail extends Component {

  handleRequestPostVote = (vote_type) => {
    const {match} = this.props;
    const {agenda_item_id} = match.params;
    const params = {
      agenda_item_id,
      vote_type,
    }
    this.props.postAgendaItemVote(params);
  }

  handleRequestAddAgendaItemStackEntry = () => {
    const {match} = this.props;
    const {agenda_item_id} = match.params;
    this.props.submitAgendaItemStackEntryForm({agenda_item_id});
  }

  handleRequestRemoveAgendaItemStackEntry = () => {
    const {match} = this.props;
    const {agenda_item_id} = match.params;
    this.props.requestRemoveAgendaItemStackEntry({agenda_item_id});
  }

  handleRequestUpdateAgendaItem = () => {
    const {match, history} = this.props;
    // TODO(MPP):  make more robust routing instead of just doing replace as below
    const path = match.url.replace('agenda_item', `agenda_item_form/update`);
    history.push(path);
  }

  render() {
    const {
      agendaItem,
      userData, 
      isUserInStack,
    } = this.props;

    if (!agendaItem) {return null};
    const i = agendaItem;

    return(
      <div>
      <Paper 
        style={styles.paper} 
        zDepth={2}
      >
        <div style={styles.editButtonContainer}>
          { i.status !== 'CLOSED' && i.owner.id === userData.id && <EditButton onClick={this.handleRequestUpdateAgendaItem} />
          }
        </div>

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

              <div style={styles.status}>
                {i.status === 'CLOSED' && statusIcon}
              </div>
            </div>

            <div style={styles.rightBlockBottom}>
              <div style={styles.body}>
                {i.body.length < bodyLimit ? i.body : i.body.substring(0, bodyLimit) + '...'}
              </div>
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

        <div styles={styles.stackSectionContainer}>
          <StackSection 
            onRequestAdd={this.handleRequestAddAgendaItemStackEntry}
            onRequestRemove={this.handleRequestRemoveAgendaItemStackEntry}
            items={i.stack_entries} 
            showButton={i.status !== 'CLOSED'}
            iconType={isUserInStack ? 'minus' : 'plus'}
          />
        </div>

      </Paper>
      </div>
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
  const {agenda_item_id} = ownProps.match.params;
  return {
    agendaItem: getAgendaItem(state, {agenda_item_id}),
    userData: getUserData(state),
    isUserInStack: getIsUserInStack(state, {agenda_item_id}),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submitAgendaItemStackEntryForm: (params) => dispatch(submitAgendaItemStackEntryForm(params)),
    requestRemoveAgendaItemStackEntry: (params) => dispatch(requestRemoveAgendaItemStackEntry(params)),
    postAgendaItemVote: (params) =>
      dispatch(postAgendaItemVote(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(AgendaItemDetail)

export default withRouter(Connected);