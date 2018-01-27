import React, {Component} from 'react'
import './MeetingCard.css'


class MeetingCard extends Component {

	render() {
		const m = this.props.meeting;
		const {onClick} = this.props;
    return (
			<div onClick={onClick} className="MeetingCard-container" key={m.id}>
				<div className="MeetingCard-title">{m.title}</div>
	      <div className="MeetingCard-text">{m.text}</div>
	    </div>
		)
  }
}


export default MeetingCard;