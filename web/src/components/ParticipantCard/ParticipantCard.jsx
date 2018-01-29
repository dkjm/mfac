import React, {Component} from 'react'
import './ParticipantCard.css'


class ParticipantCard extends Component {

	render() {
		const p = this.props.participant;
		const {onClick} = this.props;
    return (
			<div onClick={onClick} className="ParticipantCard-container" key={p.id}>
				<div className="ParticipantCard-title">{p.full_name}</div>
	    </div>
		)
  }
}


export default ParticipantCard;