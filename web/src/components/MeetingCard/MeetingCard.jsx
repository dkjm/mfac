import React, {Component} from 'react';
import './MeetingCard.css';

import Paper from 'material-ui/Paper';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import {Icon} from 'react-fa';

import LabelValue from '../LabelValue';

import {COLORS} from '../../constants';



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

				<div style={styles.detailsContainer}>
					<LabelValue label="Created by" value={m.owner.full_name} />
        	<LabelValue label="Created on" value={m.inserted_at} last /> 
				</div>

			</Paper>

		)
	}
}


const styles = {
	paper: {
    marginBottom: '20px',
    padding: '10px',
  },
  title: {
  	fontSize: '130%',
  	marginBottom: '15px',
  	fontWeight: 'bold',
  },
  detailsContainer: {

  },
}





export default MeetingCard;