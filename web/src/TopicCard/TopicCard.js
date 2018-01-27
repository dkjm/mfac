import React, { Component } from 'react';
import {connect} from 'react-redux';
import './TopicCard.css';


import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';
import {
  divideVotes, 
  isUserOwnerOfVote,
  hasUserVotedForType,
} from '../utils'

import {
  socketConnect,
  makeSocketConnect,
  socketConnectNoClosure,
  postVote,
} from '../api'

import {COLORS} from '../constants';
import {Icon} from 'react-fa';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

const owner_id = 2;


class TopicCard extends Component {


  componentWillMount() {
    // const socketConnect = this.props.makeSocketConnect(this.props.topic.id)
    // console.log('===', socketConnect)
    // socketConnect();
    //const socket = socketConnect();
    //this.setState({socket})
    // const socket = this.props.socketConnectNoClosure(this.props.topic.id);
    // this.setState({socket})
    //console.log('socket', socket);
    //socketConnect(this.props.topic.id)
  }

  // postVote = (vote_type) => {
  //   const data = {vote_type};
  //   //this.state.socket.send(JSON.stringify(data));
  //   // socket above works.  Testing doing this via ajax request
  //   this.postVote(data);
  // }

  renderVoteBlock = (vote_type) => {
    const {topic} = this.props;
    // make icon
    let iconName;
    if (vote_type === 'up') {
      iconName = 'thumbs-o-up';
    }
    else if (vote_type === 'down') {
      iconName = 'thumbs-o-down';
    }
    else if (vote_type === 'meh') {
      iconName = 'meh-o';
    }

    const style = {}
    const iconStyle = {fontSize: '200%',}
    // hasUserVotedForType(owner_id, votes)
    if (topic.votes.user_vote === vote_type) {
      style.backgroundColor = COLORS.reactBlueTransparent;
    }

    const icon = (
      <Icon style={iconStyle} className="TopicCard-vote-block-icon" name={iconName} />
    )

    const upTriangle = (
      <div style={style} className="center TopicCard-upTriangle" />
    )

    // todo: couldn't get debounce to work
    // when passing it a redux action;
    // otherwise it works as expected
    const handler = _debounce(
      () => this.props.postVote(topic.id, vote_type),
      1000,
      {leading: true, trailing: false}
    )

    return (
      <div onClick={handler}  className="pointer">
     
        <div style={style} className="TopicCard-vote-block">
          <div className="TopicCard-vote-icon-container TopicCard-block-child">
            {icon}
          </div>

          <div className="TopicCard-vote-type TopicCard-block-child">
            {topic.votes[vote_type]}
          </div>
        </div>
      </div>
    )
  }

  renderDetailButton = () => {
    const {onRequestDetail} = this.props;
    return (
      <div className="TopicCard-detail-button-container">
        <FloatingActionButton
          backgroundColor={COLORS.midnightGray}
          onClick={onRequestDetail}
          mini={true}
        >
          <ArrowForward />
      </FloatingActionButton>
      </div>
    )
  }

  render() {
    const {topic} = this.props;

    return(
      <div className="TopicCard-container" key={topic.id}>

        {this.renderDetailButton()}

        <div className="TopicCard-title">
          {topic.title}
        </div>

        <div className="TopicCard-body">{topic.body}
        </div>

        <div className="TopicCard-votes-blocks">
          {this.renderVoteBlock('up')}
          {this.renderVoteBlock('down')}
          {this.renderVoteBlock('meh')}
        </div>
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
    makeSocketConnect: (topic_id) => {
      return dispatch(makeSocketConnect(topic_id))
    },
    socketConnectNoClosure: (topic_id) => {
      return dispatch(socketConnectNoClosure(topic_id))
    },
    postVote: (topic_id, vote_type) => {
      return dispatch(postVote(topic_id, vote_type))
    },
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicCard)
