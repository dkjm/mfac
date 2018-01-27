function divideVotes(all_votes) {
	const up = [];
	const down = [];
	const meh = [];

	all_votes.forEach(v => {
		switch (v.vote_type) {
			case 'up': {
				up.push(v);
				break;
			}
			case 'down': {
				down.push(v);
				break;
			}
			case 'meh': {
				meh.push(v);
				break;
			}
			default: {
				throw new Error('vote_type unknown: ', v.vote_type);
			}
		}
	})

	return {
		up, down, meh
	}
}

// takes user id and an array of
// votes
function hasUserVotedForType(owner_id, votes) {
	let result = false;
	votes.forEach(v => {
		if (v.owner_id === owner_id) {
			result = true;
		}
	})
	return result;
}


function isUserOwnerOfVote(user_id, vote) {
	if (vote.user_id === user_id) {
		return true;
	}
	else {
		return false;
	}
}


export {
	divideVotes,
	hasUserVotedForType,
	isUserOwnerOfVote,
}