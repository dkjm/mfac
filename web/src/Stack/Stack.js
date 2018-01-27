import React, { Component } from 'react';
import {connect} from 'react-redux'
import './Stack.css';
import {withRouter} from 'react-router-dom' 
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import {
  loadTopics,
  socketConnect,
  connectMeetingSocket,
  postTopic,
} from '../api';

import CardListContainer from '../CardListContainer';

import * as selectors from '../selectors';

import TopicCard from '../TopicCard';

import FlipMove from 'react-flip-move';

import {COLORS} from '../constants';




const owner_id = 2;
const meeting_id = 1;



class Stack extends Component {

  componentWillMount() {
    this.props.loadTopics();
    //this.props.connectMeetingSocket(meeting_id);
  }

  handleRequestAddTopic = () => {
  	// todo:  get actual data from form
  	// Actually, this action should just bring
  	// us to form
  	// const data = {};
  	// this.props.postTopic(data);
  	const {match} = this.props;
  	// todo:  make more robust routing instead
  	// of just doing replace as below
  	const path = match.path.replace('stack', 'topic_form/create');
  	this.props.history.push(path);
  }

  handleRequestUpdateTopic = (topic_id) => {
    const {match} = this.props;
    // todo:  make more robust routing instead
    // of just doing replace as below
    //const path = match.path.replace('stack', `topic_form/intent=update&topic_id=${topic_id}`);
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
      //console.log('startHandlerFunction', e)
    }
    const finishHandlerFunction = (e) => {
      //console.log('finishHandlerFunction', e)
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

    //return renderedTopics
  }


  render() {
  	const style = {
  		position: 'fixed',
  		bottom: '20px',
  		right: '20px',
  		zIndex: '10',
  	}

  	//const backgroundColor = '#FF6D00';
  	const backgroundColor = COLORS.orange;

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
    topics: selectors.getTopics(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTopics: () => {
      dispatch(loadTopics())
    },
    // connectMeetingSocket: (meeting_id) => {
    //   dispatch(connectMeetingSocket(meeting_id))
    // },
    postTopic: (params) => {
      dispatch(postTopic(params))
    },
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Stack)

export default withRouter(Connected);
//export default Connected;



