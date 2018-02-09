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
import {getAgendaItems} from '../../selectors';
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

  renderItems() {
    const items = this.props.agendaItems;
    if (!items.length) {return <NoItems />};
    const renderedItems = items.map(item => (
        <AgendaItemCard 
          key={item.id} 
          item={item} 
          onClick={() => this.handleRequestUpdateAgendaItem(item.id)}
          onClickVote={(vote_type) => this.handleRequestPostVote(item.id, vote_type)}
        />
      )
    )

    return (
      <FlipMove
        duration={1000}
        delay={10}
        easing={'cubic-bezier(0.25, 0.5, 0.75, 1)'}
        staggerDurationBy={30}
        staggerDelayBy={10}
      >
        {renderedItems}
      </FlipMove>
    )
  }


  render() {
    return (
    	<div className="MeetingAgenda-container">

    		<CardListContainer>
    			{this.renderItems()}
    		</CardListContainer>

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

const NoItems = () => (
  <div style={styles.noItems}>
    No agenda items
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