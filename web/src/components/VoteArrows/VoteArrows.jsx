import React, {Component} from 'react';
import './VoteArrows.css';
import {COLORS} from '../../constants';
import {Icon} from 'react-fa';


const VoteArrows = (props) => {
	const {
		votes, 
		onClickVote, 
		disableVoting = false,
	} = props;

	const {up, down, meh, user_vote} = votes;
	const count = up - down;	

	return (
		<div style={styles.container}>

			<Block
				icon={getVoteIconName('UP')}
				count={up}
				active={user_vote === 'UP' || user_vote === 1}
				onClick={() => onClickVote('UP')}
				disabled={disableVoting}
			/>
			<div style={styles.divider}>
				{count}
			</div>
			<Block
				icon={getVoteIconName('DOWN')}
				count={down}
				active={user_vote === 'DOWN' || user_vote === -1}
				onClick={() => onClickVote('DOWN')}
				disabled={disableVoting}
			/>
		</div>
	)
}

const Block = ({icon, active, onClick, disabled}) => {
	// if active, merge icon styles object
	// with new style props and apply
	let s = styles.icon;
	if (active) {
		s = {
			...s, 
			color: COLORS.reactBlue,
			//fontSize: "330%",
		}
	}
	const click = (event) => {
		// make sure that event doesn't bubble up
		// Doing this so that when used in 
		// AgendaItemCard, clicking on card
		// in any spot that is NOT one of these
		// voting arrow regions will trigger
		// route change to detail view
		event.stopPropagation()
		if (disabled) {return};
		onClick();
	}
	return (
		<div style={styles.block}> 
			<div style={styles.iconContainer}>
				<Icon onClick={click} name={icon} style={s} />
			</div>
			
		</div>
	)
}



const getVoteIconName = (vote_type) => {
  let iconName;
  if (vote_type === 'UP') {
    //iconName = 'thumbs-o-up';
    iconName = 'caret-up';
  }
  else if (vote_type === 'DOWN') {
    //iconName = 'thumbs-o-down';
    iconName = 'caret-down';
  }
  else if (vote_type === 'MEH') {
    iconName = 'meh-o';
  }
  return iconName;
}





const styles = {
	container: {
		//border: 'solid black',
		//padding: '0px 20px 0 0px',
		display: 'flex',
		flexDirection: 'column',
		minWidth: '40px',
		textAlign: 'center',
	},
	block: {
		//border: 'solid blue',
		//marginBottom: '10px',
	},
	iconContainer: {
		//border: 'solid yellow',
		padding: '0px',
	},
	icon: {
		fontSize: '300%',
	},
	count: {
		//border: 'solid purple',
	},
	divider: {
		//height: 0,
		//borderBottom: 'solid 1px ' + COLORS.crimson,
		margin: '3px 3px 2px',
		textAlign: 'center',
		fontSize: '140%',
	},
}


export default VoteArrows;


