import React, {Component} from 'react';
import './MeetingCard.css';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import {COLORS} from '../../constants';
import {Icon} from 'react-fa';
import Paper from 'material-ui/Paper';

class MeetingCard extends Component {

  render() {
  	const {
  		meeting, 
  		onClick, 
  	} = this.props

		const m = meeting;
		
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

				<div style={styles.title}>
					{m.title}
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
  title: {
  	width: '90%',
  	fontSize: '110%',
  	marginBottom: '10px',
  	//fontWeight: 'bold',
  },
}





export default MeetingCard;