import {actionTypes} from './api';
import _sortBy from 'lodash/sortBy';
import {USER_ID} from './constants';

const initialState = {
	cache: {},
}




export default function reducer(state = initialState, action) {
	switch (action.type) {

		case (actionTypes.LOAD_TOPICS): {
			const {topics} = action;

			const obj = {};
			topics.forEach(t => obj[t.id] = t);

			const nextState = {
				...state,
				cache: obj,
			}
			return nextState;
		}

		case (actionTypes.CHANGE_VOTE): {

			const {event, topic_id, vote} = action.data;

			//const topic = state.all.filter(t => t.id === topic_id)[0]
			const topic = state.cache[topic_id];


			if (event === 'add_vote') {

				const nextVoteCount = topic.votes[vote.vote_type] + 1;

				const user_vote = vote.owner_id === USER_ID 
					? vote.vote_type
					: topic.votes.user_vote
				
				let nextOldVoteCount = topic.votes[vote.old_vote_type];

				const updatedTopic = {
					...topic,
					votes: {
						...topic.votes,
						[vote.vote_type]: nextVoteCount,
						user_vote,
					}
				}
				// check if vote has 'old_vote_type' prop
				// (it will be null if this is user's first vote on topic)
				// If old_vote_type is dif from
				// new vote type, decrement
				// votes of old_vote_type
				if (vote.old_vote_type && vote.old_vote_type !== vote.vote_type) {
					updatedTopic.votes[vote.old_vote_type] = updatedTopic.votes[vote.old_vote_type] - 1;
				}
				//console.log('updatedTopic', updatedTopic)

				// let updatedAll = state.all.filter(t => t.id !== topic.id);
				// updatedAll.push(updatedTopic);

				// updatedAll = _sortBy(updatedAll, (t) => {
				// 	return t.created_on
				// })



				const nextState = {
					...state,
					cache: {
						...state.cache,
						[topic_id]: updatedTopic,
					}					
				}

				return nextState;
			}

			else if (event === 'delete_vote') {
				const nextVoteCount = topic.votes[vote.vote_type] - 1;

				const user_vote = vote.owner_id === USER_ID 
					? null
					: topic.votes.user_vote

				const updatedTopic = {
					...topic,
					votes: {
						...topic.votes,
						[vote.vote_type]: nextVoteCount,
						user_vote,
					}
				}

				// let updatedAll = state.all.filter(t => t.id !== topic.id);
				// updatedAll.push(updatedTopic);

				// updatedAll = _sortBy(updatedAll, (t) => {
				// 	return t.created_on
				// })

				const nextState = {
					...state,
					cache: {
						...state.cache,
						[topic_id]: updatedTopic,
					}					
				}

				return nextState;
			}
		}


		// case actionTypes.UPDATE_VOTE_COUNTS: {
		// 	const {event, topic_id, votes} = action.data;
		// 	const topic = state.cache[topic_id];

		// 	const updatedTopic = {
		// 		...topic,
		// 		votes: {
		// 			...topic.votes,
		// 			...votes,
		// 		}
		// 	}

		// 	const nextState = {
		// 		...state,
		// 		cache: {
		// 			...state.cache,
		// 			[topic_id]: updatedTopic,
		// 		}
		// 	}
			
		// 	return nextState;
		// }


		case actionTypes.UPDATE_VOTE_COUNTS: {

			const {event, topics} = action.data;

			const updatedCache = {};

			topics.forEach(t => {
				const topic  = state.cache[t.id];
				if (topic) {	
					const updatedTopic = {
						...topic,
						votes: {
							...topic.votes,
							...t.votes,
						}
					}
					updatedCache[topic.id] = updatedTopic;
				}
			})

			const nextState = {
				...state,
				cache: {
					...state.cache,
					...updatedCache,
				}
			}
			
			return nextState;
		}


		case actionTypes.RECEIVE_TOPIC: {

			const {event, topic} = action.data;

			let updatedTopic = state.cache[topic.id];

			// if topic already exists in cache, merge objects
			if (updatedTopic) {
				updatedTopic = {
					...updatedTopic,
					...topic,
				}
			}
			// else set to received data
			else {
				updatedTopic = topic;
			}

			const updatedCache = {
				...state.cache,
				[topic.id]: updatedTopic,
			}

			const nextState = {
				...state,
				cache: {
					...state.cache,
					...updatedCache,
				}
			}
			
			return nextState;
		}


		case actionTypes.POST_VOTE: {

			const {event, topic_id, votes} = action.data;

			// get topic to update.  If doesn't
			// exist, return current state
			const topic  = state.cache[topic_id];
			if (!topic) {return state};

			const updatedTopic = {
				...topic,
				votes: {
					...topic.votes,
					...votes,
				},
			}

			const nextState = {
				...state,
				cache: {
					...state.cache,
					[topic_id]: updatedTopic,
				}
			}
			
			return nextState;
		}


		default: {
			return state;
		}

	}
}