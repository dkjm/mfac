import React, { Component } from 'react';
import {connect} from 'react-redux'
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 

import {
  loadTopics,
  socketConnect,
  connectMeetingSocket,
} from './api';

import {toggleSnackbar} from './services/ui';

import * as selectors from './selectors';

import TopicCard from './TopicCard';
import Header from './Header/Header';
import NavDrawer from './NavDrawer/NavDrawer';
import Dashboard from './Dashboard/Dashboard';
import MeetingsDashboard from './MeetingsDashboard/MeetingsDashboard';
import MeetingLayout from './MeetingLayout/MeetingLayout';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Snackbar from 'material-ui/Snackbar';
import FlipMove from 'react-flip-move';



//import injectTapEventPlugin from 'react-tap-event-plugin'


// must call or material-ui components will cause
// react to throw error that onTouchTap prop is unknown
// injectTapEventPlugin()

// get them, to be inserted into MUI wrapper in 
// App.js render method
//const muiTheme = getMuiTheme(lightBaseTheme)
const muiTheme = getMuiTheme({
  //spacing: spacing,
  //fontFamily: 'Roboto, sans-serif',
  fontFamily: 'Verdana, sans-serif',
  palette: {
    primary1Color: '#304f8e',
    primary2Color: '#304f8e',
    primary3Color: '#304f8e',
    //primary2Color: cyan700,
    //primary3Color: grey400,
    accent1Color: '#fc6907',
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




//const endpoint = "http://localhost:8000/topics&id=5/";
//const endpoint = "http://localhost:8000/topics/?topic_id=5/";

const owner_id = 2;
const meeting_id = 1;



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    //console.log('nextProps', nextProps);
  }

  handleRequestCloseSnackbar = () => {
    console.log('handleRequestCloseSnackbar')
    const params = {
      open: false,
      message: '',
    }
    this.props.toggleSnackbar(params);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">

            <Header />
            <NavDrawer />
            {/* Todo: make renderTopSection a route in below switch */}
            <Switch>
              
              <Route 
                exact
                path="/groups" 
                render={() => (
                  this.renderTopSection()
                )}
              />
              <Route exact path="/dashboard"
                render={props => (<Dashboard {...props} />)}
              />

              <Route path="/meetings" render={props => (<MeetingLayout {...props} />)} />

              {/* // below wasn't working
              <Route path="/meetings"
                render={(p) => (
                  <Switch>
                    <Route {...p} path="/dashboard" component={MeetingsDashboard} />
                    
                    
                  </Switch>
                )}
              />*/}
              <Route component={NoMatch} />
              
            </Switch>

          <Snackbar
            open={this.props.snackbar.open}
            message={this.props.snackbar.message}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestCloseSnackbar}
          />
            
        </div>
      </MuiThemeProvider>
    )
  }
}

const NoMatch = () => {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">No matching route found.</h1>
      </header>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    topics: selectors.getTopics(state),
    snackbar: selectors.getSnackbar(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadTopics: () => {
      dispatch(loadTopics())  // shouldComponentUpdate(nextProps) {
  //  // if (nextProps.location !== this.props.location) {
  //  //  //console.log('shouldComponentUpdate', true)
  //  //  return true;
  //  // }
  //  // return true;
  // }
    },
    // connectMeetingSocket: (meeting_id) => {
    //   dispatch(connectMeetingSocket(meeting_id));
    // },
    toggleSnackbar: (params) => {
      dispatch(toggleSnackbar(params));
    }
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default withRouter(Connected);
//export default Connected;



