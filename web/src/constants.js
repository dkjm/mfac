import Axios from 'axios';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export const COLORS = {
	white: '#ffffff',
	black: '#000000',
	lightGray: '#9da6b5',
	darkGray: '#777c84',
	darkerGray: '#5c6677',
	grayBackground: '#c9d2e2',
	crimson: '#700808',
	navy: '#304f8e',
	orange: '#fc6907',
	blackGray: '#292f38',
	lightPurple: '#8884d8',
	lightGreen: '#82ca9d',
	reactBlue: 'rgb(119, 210, 249)',
	reactBlueTransparent: 'rgba(119, 210, 249, .7)',
	midnightGray: 'rgb(91, 91, 91)',
  cyan50: '#E0F7FA',
  cyan100: '#B2EBF2',
  cyan200: '#80DEEA',
  cyan300: '#4DD0E1',
}

// export const API_ENTRY = 'http://localhost:8000/api';
// export const API_ENTRY_WS = 'ws://localhost:8000';
export const API_ENTRY = 'http://localhost:4000/api/v0';
export const API_ENTRY_WS = 'ws://localhost:4000/socket';
// export const axios = Axios.create({
//   baseURL: API_ENTRY,
//   timeout: 3000,
//   headers: {
//   	'Authorization': `Bearer ${localStorage.getItem('token')}`,
//   },
// })

export const HEADER_HEIGHT = 64;
export const NAV_DRAWER_WIDTH = 242;

export const COMPANY_NAME = 'Meetings App';
export const COMPANY_LOGO = '';


// set material UI theme options
export const muiTheme = getMuiTheme({
  //spacing: spacing,
  //fontFamily: 'Roboto, sans-serif',
  fontFamily: 'Verdana, sans-serif',
  palette: {
    //primary1Color: '#304f8e',
    primary1Color: COLORS.blackGray,
    primary2Color: '#304f8e',
    primary3Color: '#304f8e',
    //primary2Color: cyan700,
    //primary3Color: grey400,
    accent1Color: COLORS.reactBlue,
    //accent2Color: grey100,
    //accent3Color: grey500,
    //textColor: darkBlack,
    //alternateTextColor: white,
    //canvasColor: white,
    //borderColor: grey300,
    //disabledColor: fade(darkBlack, 0.3),
    //pickerHeaderColor: cyan500,
    //clockCircleColor: fade(darkBlack, 0.07),
    //shadowColor: fullBlack,
  }
})

// using this to temporarily keep 
// consistency across data changes
// Normally this val will come
// from some session data
export const USER_ID = 2;
export const MEETING_ID = 1;