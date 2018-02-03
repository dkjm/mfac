import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './LoginForm.css';
import {withRouter} from 'react-router-dom';

import {TextField} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

import {COLORS} from '../../constants';
import {submitLoginForm} from '../../services/session';
import history from '../../history';
import {getAgendaItem} from '../../selectors';
import {required} from '../../validation';

// InputContainer is just a simple
// container for Fields.  Provides
// some consistent spacing, etc.
// TODO: Can prob just create a separate 
// component "Input" that has a Field
// and provides necessary spacing.
const InputContainer = ({children}) => {
  const style = {
    maxWidth: '400px',
    margin: 'auto',
  }
  return (
    <div style={style}>
      {children}
    </div>
  )
}


const Button = (props) => {
  const styles = {
    container: {
      maxWidth: '150px',
      flexGrow: '1',
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


class LoginForm extends Component {

  // TODO(MPP - 180131)
  handleForgot = (event) => {
    console.log('TODO - handleForgot')
  }

  handleSubmit = (values) => {
    this.props.submitLoginForm(values);
  }

  render() {

    const { 
      handleSubmit, 
      pristine,
      dirty, 
      reset, 
      submitting,
      match,
    } = this.props

    return (
      <form>
        <div style={styles.container}>

          <div style={styles.title}>
            Login
          </div>

          <div style={styles.inputsContainer}>
            <InputContainer>
              <Field 
                style={styles.input}
                fullWidth={true}
                name="username" 
                component={TextField}
                floatingLabelText="Username"
                autoFocus={true} 
                validate={required}
              />
            </InputContainer>

            <InputContainer>
              <Field 
                style={styles.input}
                fullWidth={true}
                name="password" 
                component={TextField}
                floatingLabelText="Password"
                multiLine={true} 
                validate={required}
              />
            </InputContainer>

          </div>

          <div style={styles.buttonsContainer}>
            <Button
              label="Submit"
              onClick={handleSubmit(this.handleSubmit)}
            />
            <Button
              label="Forgot"
              onClick={this.handleForgot}
            />
          </div>

        </div>
      </form>
    )
  }
}
  

const styles = {
  container: {
    padding: '15px',
  },
  title: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputsContainer: {
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  input: {
    minWidth: '60px',
    textAlign: 'left',
  },

}


const mapStateToProps = (state, ownProps) => { 
  return {

  }
}

const mapDispatchToProps = (dispatch)  => ({
  submitLoginForm: (params) => dispatch(submitLoginForm(params)),
})

let Connected = reduxForm({
  form: 'loginForm',
})(LoginForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

export default withRouter(Connected);