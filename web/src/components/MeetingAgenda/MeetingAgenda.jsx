import React, { Component } from 'react';
import {connect} from 'react-redux';
import './MeetingAgenda.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import CardListContainer from '../CardListContainer';
import AgendaItemCard from '../AgendaItemCard';

import {COLORS} from '../../constants';
import {getAgendaItems, getFilteredAgendaItems} from '../../selectors';
import {postAgendaItemVote} from '../../services/api';


class MeetingAgenda extends Component {

  handleRequestPostVote = (agenda_item_id, vote_type) => {
    const params = {
      agenda_item_id,
      vote_type,
    }
    this.props.postAgendaItemVote(params);
  }

  handleRequestAddAgendaItem = () => {
    const {match} = this.props;
    // TODO:  make more robust routing instead
    // of just doing replace as below
    const path = match.path.replace('agenda', 'agenda_item_form/create');
    this.props.history.push(path);
  }

  handleRequestUpdateAgendaItem = (agenda_item_id) => {
    const {match} = this.props;
    // TODO:  make more robust routing instead
    // of just doing replace as below
    //const path = match.path.replace('agenda', `agenda_item_form/update/${agenda_item_id}`);
    const path = match.path.replace('agenda', `agenda_item/${agenda_item_id}`);
    this.props.history.push(path);
  }

  renderItems(status) {
    const {
      closedItems,
      openItems,
      pendingItems,
    } = this.props;

    let items;
    if (status === 'CLOSED') {
      items = closedItems;
    }
    if (status === 'PENDING') {
      items = pendingItems;
    }
    if (status === 'OPEN') {
      items = openItems;
    }
    else if (status === 'notClosed') {
      items = pendingItems.concat(openItems);
    }

    const renderedItems = items.map(item => (
        <AgendaItemCard 
          key={item.id} 
          item={item} 
          onClick={() => this.handleRequestUpdateAgendaItem(item.id)}
          onClickVote={(vote_type) => this.handleRequestPostVote(item.id, vote_type)}
        />
      )
    )
    
    return renderedItems;
  }

  render() {
    const {openItems} = this.props;
    return (
    	<div>

        {/*{openItems.length > 0 && (<Section title="OPEN" items={this.renderItems('OPEN')} />)}*/}
        <Section title="OPEN" items={this.renderItems('OPEN')} />
        <Section title="REMAINING" items={this.renderItems('PENDING')} />
        <Section title="CLOSED" items={this.renderItems('CLOSED')} last />

        <FloatingActionButton
          onClick={this.handleRequestAddAgendaItem}
          backgroundColor={COLORS.reactBlue} 
          iconStyle={{fill: COLORS.blackGray}}
          style={styles.fab}>
          <ContentAdd />
        </FloatingActionButton>

    	</div>
    )
  }
}

const Section = ({title, items, last}) => {
  const styles = {
    container: {
      marginBottom: '20px',
      
    },
    bottom: {
      width: '90%',
      margin: 'auto',
      marginTop: '30px',
      //borderBottom: 'solid 2px ' + COLORS.reactBlue,
      borderBottom: 'solid 2px ' + COLORS.cyan100,
    },
    title: {
      padding: '0px 20px 10px',
      fontSize: '150%',
      fontWeight: 'bold',
      color: COLORS.blackGray,
      textAlign: 'center',
      //borderBottom: 'solid 1px ' + COLORS.reactBlue,
    },
    items: {

    },
    noItems: {
      textAlign: 'center',
      fontStyle: 'italic',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        {title}
      </div>
      {
        items.length
        ? (
          <div style={styles.items}>
            <CardListContainer>
              <FlipMove
                duration={1000}
                delay={10}
                easing={'cubic-bezier(0.25, 0.5, 0.75, 1)'}
                staggerDurationBy={30}
                staggerDelayBy={10}
              >
                {items}
              </FlipMove>
            </CardListContainer>
          </div>
        ) :
        (
          <div style={styles.noItems}>
            No items
          </div>
        )
      }

      {!last && <div style={styles.bottom} />}
        
    </div>
  )
}

const NoItems = ({message}) => (
  <div style={styles.noItems}>
    {message || 'No agenda items'}
  </div>
)

// TODO: consolidate all styles in this file,
// get ride of css file
const styles = {
  fab: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '10',
  },
  noItems: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: '100px',
  },
}


const mapStateToProps = (state) => {
  return {
    closedItems: getFilteredAgendaItems(state, {status: 'CLOSED'}),
    openItems: getFilteredAgendaItems(state, {status: 'OPEN'}),
    pendingItems: getFilteredAgendaItems(state, {status: 'PENDING'}),
    agendaItems: getAgendaItems(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    postAgendaItemVote: (params) => {
      dispatch(postAgendaItemVote(params));
    },
  }
}

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingAgenda)

export default withRouter(Connected);