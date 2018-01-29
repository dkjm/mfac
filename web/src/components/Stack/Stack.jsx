import React, { Component } from 'react';
import {connect} from 'react-redux';
import './Stack.css';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import {loadTopics} from '../../services/api';

import {COLORS} from '../../constants';
import {getTopics} from '../../selectors';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CardListContainer from '../CardListContainer';
import TopicCard from '../TopicCard';


class Stack extends Component {

  componentWillMount() {
    this.props.loadTopics();
  }

  handleRequestAddTopic = () => {
  	const {match} = this.props;
  	// TODO:  make more robust routing instead
  	// of just doing replace as below
  	const path = match.path.replace('stack', 'topic_form/create');
  	this.props.history.push(path);
  }

  handleRequestUpdateTopic = (topic_id) => {
    const {match} = this.props;
    // TODO:  make more robust routing instead
    // of just doing replace as below
    const path = match.path.replace('stack', `topic_form/update/${topic_id}`);
    this.props.history.push(path);
  }


  renderTopics() {
    const {topics} = this.props;

    const renderedTopics = topics.map(t => (
      <TopicCard 
        key={t.id} 
        topic={t} 
        onRequestDetail={() => this.handleRequestUpdateTopic(t.id)} 
      />
    ))

    const startHandlerFunction = (e) => {
      // just leaving this here to see
      // that they can be used in API for
      // FlipMove component
    }
    const finishHandlerFunction = (e) => {
      // just leaving this here to see
      // that they can be used in API for
      // FlipMove component
    }

    // see available settings for FlipMove
    // component and experiment with them here:
    // http://joshwcomeau.github.io/react-flip-move/examples/#/laboratory?_k=xixhlw

    return (
      <FlipMove
        duration={1000}
        delay={10}
        easing={'cubic-bezier(0.25, 0.5, 0.75, 1)'}
        staggerDurationBy={30}
        staggerDelayBy={10}
        onStart={startHandlerFunction}
        onFinish={finishHandlerFunction}
      >
        {renderedTopics}
      </FlipMove>
    )
  }


  render() {
    // TODO: move style outside of render method
  	const style = {
  		position: 'fixed',
  		bottom: '20px',
  		right: '20px',
  		zIndex: '10',
  	}

    // TODO: find better color for button
    //const backgroundColor = COLORS.orange;
  	const backgroundColor = 'black';

    return (
    	<div className="Stack-container">

    		<FloatingActionButton
    			onClick={this.handleRequestAddTopic}
    			backgroundColor={backgroundColor} 
    			style={style}>
		      <ContentAdd />
		    </FloatingActionButton>

    		<CardListContainer>
    			{this.renderTopics()}
    		</CardListContainer>
    	</div>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    topics: getTopics(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTopics: () => {
      dispatch(loadTopics())
    },
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Stack)

export default withRouter(Connected);