import React, { Component } from 'react';
import {connect} from 'react-redux';
import './MeetingResources.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import * as selectors from '../../selectors';
import CardListContainer from '../CardListContainer';
import ResourceCard from '../ResourceCard';


class MeetingResources extends Component {

  renderItems() {
    const renderedItems = this.props.resources.map(item => <ResourceCard key={item.id} resource={item} />)

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
    	<div className="MeetingResources-container">
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

const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetingResources)

export default withRouter(Connected);
