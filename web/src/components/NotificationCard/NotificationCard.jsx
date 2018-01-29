import React, {Component} from 'react'
import './NotificationCard.css'


class NotificationCard extends Component {

	render() {
		const n = this.props.notification;
		const {onClick} = this.props;
    return (
			<div onClick={onClick} className="NotificationCard-container" key={n.id}>
	      <div className="NotificationCard-text">{n.text}</div>
	    </div>
		)
  }
}


export default NotificationCard;