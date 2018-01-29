import React, { Component } from 'react';
import {connect} from 'react-redux'
import './App.css';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom';

import {toggleSnackbar} from '../../services/ui';
import * as selectors from '../../selectors';

import Header from '../Header/Header';
import NavDrawer from '../NavDrawer';
import Dashboard from '../Dashboard';
import MeetingLayout from '../MeetingLayout';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Snackbar from 'material-ui/Snackbar';
import FlipMove from 'react-flip-move';

//import injectTapEventPlugin from 'react-tap-event-plugin';
// must call injectTapEventPlugin 
// or material-ui components will cause
// react to throw error that onTouchTap 
// prop is unknown
// ** NOTE: Haven't installed dependency yet
// as problem has not come up - 180127 - MPP
//injectTapEventPlugin();

// set material UI theme options
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


class App extends Component {

  handleRequestCloseSnackbar = () => {
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

          <Switch>

            <Route 
              exact 
              path="/dashboard"
              render={props => (<Dashboard {...props} />)}
            />

            <Route 
              path="/meetings" 
              render={props => (
                <MeetingLayout {...props} />
              )} 
            />

            <Redirect to="/meetings/dashboard" />

            {/* 180127 - MPP - NoMatch will never
              be called with current routing setup  
            */}
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
    snackbar: selectors.getSnackbar(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
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
