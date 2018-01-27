export const TOGGLE_NAV_DRAWER = 'ui/TOGGLE_NAV_DRAWER'
export const TOGGLE_SNACKBAR = 'ui/TOGGLE_SNACKBAR'

export const toggleNavDrawer = () => (dispatch) => {
	const action = {
		type: TOGGLE_NAV_DRAWER,
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

const initialState = {
	navDrawer: {
		open: false,
	},
	snackbar: {
		open: false,
		message: '',
	},
}


export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_NAV_DRAWER: {
			const nextState = {
				...state,
				navDrawer: {
					...state.navDrawer,
					open: !state.navDrawer.open,
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

		default: {
			return state;
		}
	}
}