import React, {Component} from 'react';
import './UserSettings.css';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Route, Switch, Redirect} from 'react-router';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import PencilIcon from 'material-ui/svg-icons/editor/mode-edit';

import authProtected from '../AuthProtected';
import LabelValue from '../LabelValue';
import UserProfileForm from '../UserProfileForm';
import UserPasswordForm from '../UserPasswordForm';

import {COLORS} from '../../constants';
import {getUserData} from '../../selectors';


const EditButton = (props) => {
  return (
    <FloatingActionButton
      onClick={props.onClick}
      mini={true}
      iconStyle={{fill: COLORS.blackGray}}
      backgroundColor={COLORS.reactBlue}>
      <PencilIcon />
    </FloatingActionButton>
  )
}

const ChangePasswordButton = (props) => {
  const styles = {
    container: {
      flexGrow: '1',
      padding: '0px 40px',
    },
    root: {

    },
    buttonStyle: {
      minHeight: '60px'
    },
    labelStyle: {
      color: COLORS.white,
    },
  }
  return (
    <div style={styles.container}>
      <RaisedButton 
        style={styles.root}
        buttonStyle={styles.buttonStyle}
        labelStyle={styles.labelStyle}
        label={props.label} 
        backgroundColor={COLORS.blackGray}
        onClick={props.onClick}
        fullWidth={true}
      />
    </div>
  )
}


class UserSettings extends Component {

  handleRequestUpdateProfile = () => {
    const {match, history} = this.props;
    const path = '/settings/user_profile_form';
    history.push(path);
  }

  handleRequestChangePassword = () => {
    const {match, history} = this.props;
    const path = '/settings/user_password_form';
    history.push(path);
  }

  renderDetails() {
    const {userData} = this.props;
    const u = userData;
    return (
      <div style={styles.detailsContainer}>
        <LabelValue label="Name" value={u.full_name} />
        <LabelValue label="Email" value={u.email} />
        <LabelValue label="User name" value={u.user_name} />
        <LabelValue label="Joined" value={u.inserted_at} />
      </div>
    )
  }

  renderProfile() {
    const {userData, match} = this.props;
    if (!userData) {return null};

    return(
      <div>
        <Paper 
          style={styles.paper} 
          zDepth={2}
        >
          <div style={styles.editButtonContainer}>
            <EditButton onClick={this.handleRequestUpdateProfile} />
          </div>

          {this.renderDetails()}

        </Paper>

        <div style={styles.bottomButtonsContainer}>
          <ChangePasswordButton
            label="Change Password"
            onClick={this.handleRequestChangePassword}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <Switch>
        <Route 
          exact 
          path="/settings/user_profile_form" 
          render={props => (<UserProfileForm {...props} />)}
        />
        <Route 
          exact 
          path="/settings/user_password_form" 
          render={props => (<UserPasswordForm {...props} />)}
        />
        <Route 
          exact 
          path="/settings" 
          render={props => this.renderProfile()}
        />
        
      </Switch>
    )
  }
}

const styles = {
  paper: {
    margin: '10px 15px 20px',
    padding: '10px',
    textAlign: 'left',
  },
  bottomButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0px 0px 40px',
  },
  editButtonContainer: {
    float: 'right',
    // textAlign: 'right',
    // position: 'absolute',
    // right: '10px',
  },
  headerSectionContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  detailsSectionContainer: {

  },
  stackSectionContainer: {

  },
  leftBlock: {

  },
  rightBlock: {
    padding: '18px 0 0 20px',
    flexGrow: '3',
  },
  rightBlockTop: {
    display: 'flex',
  },
  title: {
    width: '90%',
    fontSize: '110%',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  status: {
    width: '10%',
  },
  rightBlockBottom: {

  },
  body: {

  },
  icon: {
    transform: 'rotate(0.875turn)',
    padding: '0 !important',
  },
}

const mapStateToProps = (state, ownProps) => {
  return {
    userData: getUserData(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}


let Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettings)

Connected = withRouter(Connected);

export default authProtected(Connected);