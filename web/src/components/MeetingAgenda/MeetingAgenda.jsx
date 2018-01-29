import React, { Component } from 'react';
import {connect} from 'react-redux';
import './MeetingAgenda.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import CardListContainer from '../CardListContainer';
import AgendaItemCard from '../AgendaItemCard';


class MeetingAgenda extends Component {

  renderItems() {
    const {items} = this.props.agenda;
    const renderedItems = items.map(item => (
        <AgendaItemCard 
          key={item.id} 
          item={item} 
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
    	</div>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    
  }
}

// not connecting this component directly
// thru redux store.  Going to use props
// passed in from parent component.  
// (I think parent is MeetingDetail)
// Currently using dummy data to simulate.
// Leaving mapState and mapDispatch in case
// we need to connect in future.
const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingAgenda)

export default withRouter(Connected);