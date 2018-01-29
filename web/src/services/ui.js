import {COMPANY_NAME} from '../constants';

export const TOGGLE_NAV_DRAWER = 'ui/TOGGLE_NAV_DRAWER';
export const TOGGLE_SNACKBAR = 'ui/TOGGLE_SNACKBAR';
export const SET_HEADER_TEXT = 'ui/SET_HEADER_TEXT';

export const toggleNavDrawer = (params = {}) => (dispatch) => {
	const action = {
		type: TOGGLE_NAV_DRAWER,
		open: params.open,
	}
	return dispatch(action)
}

export const toggleSnackbar = (params = {}) => (dispatch) => {
	const action = {
		type: TOGGLE_SNACKBAR,
		message: params.message,
		open: params.open,
	}
	return dispatch(action)
}

export const setHeaderText = (params = {}) => (dispatch) => {
	const action = {
		type: SET_HEADER_TEXT,
		text: params.text,
	}
	return dispatch(action)
}

const initialState = {
	navDrawer: {
		open: false,
	},
	snackbar: {
		open: false,
		message: '',
	},
	header: {
		open: true,
		text: COMPANY_NAME,
	}
}


export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_NAV_DRAWER: {
			const nextState = {
				...state,
				navDrawer: {
					...state.navDrawer,
					open: action.open,
				},
			}
			return nextState;
		}

		case TOGGLE_SNACKBAR: {
			const nextState = {
				...state,
				snackbar: {
					...state.snackbar,
					open: action.open,
					message: action.message,
				},
			}
			return nextState;
		}

		case SET_HEADER_TEXT: {
			const nextState = {
				...state,
				header: {
					...state.header,
					text: action.text,
				},
			}
			return nextState;
		}

		default: {
			return state;
		}
	}
}