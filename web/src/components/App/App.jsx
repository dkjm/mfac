import React, { Component } from 'react';
import {connect} from 'react-redux'
import './App.css';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom';
import FlipMove from 'react-flip-move';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';

import Header from '../Header/Header';
import NavDrawer from '../NavDrawer';
import Dashboard from '../Dashboard';
import MeetingLayout from '../MeetingLayout';
import LoginForm from '../LoginForm';
import UserInvitations from '../UserInvitations';
import UserInvitationDetail from '../UserInvitationDetail';

import {COLORS, muiTheme} from '../../constants';
import {toggleSnackbar} from '../../services/ui';
import * as selectors from '../../selectors';
import {connectUserSocket, loadUserData} from '../../services/session';


//import injectTapEventPlugin from 'react-tap-event-plugin';
// must call injectTapEventPlugin 
// or material-ui components will cause
// react to throw error that onTouchTap 
// prop is unknown
// ** NOTE: Haven't installed dependency yet
// as problem has not come up - 180127 - MPP
//injectTapEventPlugin();


class App extends Component {

  componentWillMount() {
    const {
      isUserLoggedIn, 
      loadUserData, 
      connectUserSocket,
    } = this.props;

    if (isUserLoggedIn) {
      //loadUserData();
      connectUserSocket();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isUserLoggedIn, 
      loadUserData, 
      connectUserSocket,
    } = this.props;

    // if user wasn't logged in and now is, loadData
    if (!prevProps.isUserLoggedIn && isUserLoggedIn) {
      //loadUserData();
      connectUserSocket();
    }
  }

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
              path="/login"
              render={props => (<LoginForm {...props} />)}
            />

            <Route 
              exact
              path="/invitations"
              render={props => (<UserInvitations {...props} />)}
            />

            <Route 
              path="/invitations/:meeting_invitation_id"
              render={props => (<UserInvitationDetail {...props} />)}
            />

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

            <Redirect to="/login" />

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
    isUserLoggedIn: selectors.getIsUserLoggedIn(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbar: (params) => dispatch(toggleSnackbar(params)),
    connectUserSocket: (params) => dispatch(connectUserSocket(params)),
    loadUserData: (params) => dispatch(loadUserData(params)),
  }
}


const Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default withRouter(Connected);
