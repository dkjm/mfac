import React, {Component} from 'react';
import './MeetingInvitationCard.css';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import {COLORS} from '../../constants';
import {Icon} from 'react-fa';
import Paper from 'material-ui/Paper';

class MeetingInvitationCard extends Component {

  render() {
  	const {invitation, onRequestViewDetail} = this.props;
  	const i = invitation;
		
		const statusIcon = (
			<div>
				<CheckIcon />
			</div>
		)

		return (
			<Paper 
				style={styles.paper} 
				zDepth={2}
				onClick={onRequestViewDetail}
			>

				<div style={styles.title}>
					{i.invitee.full_name}
				</div>

				<div style={styles.subtitle}>
					Status: {i.status}
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
    //display: 'flex',
  },
  title: {
  	width: '90%',
  	fontSize: '110%',
  	marginBottom: '10px',
  	//fontWeight: 'bold',
  },
  subtitle: {
  	width: '90%',
  	fontSize: '90%',
  	marginBottom: '10px',
  	//fontWeight: 'bold',
  },
}





export default MeetingInvitationCard;