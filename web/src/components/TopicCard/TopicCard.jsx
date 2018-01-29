import React, { Component } from 'react';
import {connect} from 'react-redux';
import './TopicCard.css';

import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';

import {postVote} from '../../services/api'
import {COLORS} from '../../constants';

import {Icon} from 'react-fa';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';


const makeVoteIcon = (vote_type) => {
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
  return iconName;
}


class TopicCard extends Component {

  renderVoteBlock = (vote_type) => {
    const {topic} = this.props;
    const iconName = makeVoteIcon(vote_type);
    

    const style = {}
    const iconStyle = {fontSize: '200%',}

    // set background color to blue if user
    // has cast this vote_type
    if (topic.votes.user_vote === vote_type) {
      style.backgroundColor = COLORS.reactBlueTransparent;
    }

    const icon = (
      <Icon 
        style={iconStyle} 
        className="TopicCard-vote-block-icon" 
        name={iconName} 
      />
    )

    // TODO: couldn't get debounce to work
    // when passing it a redux action;
    // otherwise it works as expected;
    // Might have to do with react creating
    // "synthetic event" on click.
    const handler = _debounce(
      () => this.props.postVote(topic.id, vote_type),
      1000,
      {leading: true, trailing: false}
    )

    return (
      <div onClick={handler} className="pointer">
     
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
      <div className="TopicCard-container">

        {this.renderDetailButton()}

        <div className="TopicCard-title">
          {topic.title}
        </div>

        <div className="TopicCard-body">
          {topic.body}
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
    postVote: (topic_id, vote_type) => {
      return dispatch(postVote(topic_id, vote_type))
    },
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicCard)
