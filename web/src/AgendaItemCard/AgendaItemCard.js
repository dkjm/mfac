import React, {Component} from 'react'
import './AgendaItemCard.css'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import {COLORS} from '../constants';


class AgendaItemCard extends Component {

  render() {
		const i = this.props.item;
		

		const statusIcon = (
			<div>
				<CheckIcon />
			</div>
		)

		return (
			<div onClick={this.props.onClick} className="AgendaItemCard-container" key={i.id}>

				<div className="AgendaItemCard-top-container">
					<div className="AgendaItemCard-title">
						{i.title}
					</div>

					<div className="AgendaItemCard-status-container">
						{i.status === 'closed' && statusIcon}
					</div>
				</div>

				<div className="AgendaItemCard-text">
					{i.text}
				</div>

			</div>
		)
	}
}


const styles = {
	container: {
		padding: '10px',
		textAlign: 'left',
		display: 'flex',
		minHeight: '30px',
	},
	title: {
		//flexGrow: '2',
		width: '90%',
	},
	statusContainer: {
		//flexGrow: '1',
		width: '10%',
	},
	check: {

	}
}


export default AgendaItemCard;