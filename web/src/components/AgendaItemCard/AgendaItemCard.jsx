import React, {Component} from 'react';
import './AgendaItemCard.css';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import {COLORS} from '../../constants';
import {Icon} from 'react-fa';
import Paper from 'material-ui/Paper';
import VoteArrows from '../VoteArrows';

// limit for how many chars of body
// we want to display in card
const bodyLimit = 90;

class AgendaItemCard extends Component {

  render() {
  	const {
  		item, 
  		onClick, 
  		onClickVote,
  	} = this.props

		const i = item;
		
		const statusIcon = (
			<div>
				<CheckIcon />
			</div>
		)

		return (
			<Paper 
				style={styles.paper} 
				zDepth={2}
				onClick={onClick}
			>

				<div style={styles.leftBlock}>
					<VoteArrows 
						onClickVote={onClickVote} 
						votes={i.votes} 
						disableVoting={i.status === 'CLOSED'}
					/>
				</div>

				<div style={styles.rightBlock}>
					<div style={styles.rightBlockTop}>
						<div style={styles.title}>
							{i.title}
						</div>

						<div style={styles.status}>
							{i.status === 'CLOSED' && statusIcon}
						</div>
					</div>

					<div style={styles.rightBlockBottom}>
						<div style={styles.body}>
							{i.body.length < bodyLimit ? i.body : i.body.substring(0, bodyLimit) + '...'}
						</div>
					</div>

				</div>

			</Paper>

		)
	}
}


const styles = {
	paper: {
    marginBottom: '20px',
    padding: '10px',
    textAlign: 'left',
    display: 'flex',
  },
  leftBlock: {

  },
  rightBlock: {
  	padding: '18px 0 0 20px',
  	flexGrow: '3',
  },
  rightBlockTop: {
  	display: 'flex',
  },
  title: {
  	width: '90%',
  	fontSize: '110%',
  	marginBottom: '10px',
  	fontWeight: 'bold',
  },
  status: {
  	width: '10%',
  },
  rightBlockBottom: {

  },
  body: {

  },
	icon: {
		transform: 'rotate(0.875turn)',
		padding: '0 !important',
	},
}





export default AgendaItemCard;