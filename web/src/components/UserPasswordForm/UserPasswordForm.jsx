import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {Field, reduxForm} from 'redux-form';
import {TextField} from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton';

import {COLORS} from '../../constants';
import {submitUserPasswordForm} from '../../services/session';
import {getUserData} from '../../selectors';
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


class UserPasswordForm extends Component {

  handleCancel = (event) => {
    this.props.history.goBack();
  }

  handleSubmit = (values) => {
    // TODO: all fields that fail validation
    // should show errors on submit.
    // Right now, failing fields only show 
    // error if they are dirty
    this.props.submitUserPasswordForm(values);
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

    const formTitle = 'Change Password';

    return (
      <form>
        <div style={styles.container}>

          <div style={styles.title}>
            {formTitle}
          </div>

          <div style={styles.inputsContainer}>
            <InputContainer>
              <Field 
                style={styles.input}
                fullWidth={true}
                name="password" 
                component={TextField}
                floatingLabelText="New password"
                autoFocus={true} 
                validate={required}
                type="password"
              />
            </InputContainer>

            <InputContainer>
              <Field 
                style={styles.input}
                fullWidth={true}
                name="password_again" 
                component={TextField}
                floatingLabelText="Confirm password"
                validate={required}
                type="password"
              />
            </InputContainer>

          </div>

          <div style={styles.buttonsContainer}>
            <Button
              label="Save"
              onClick={handleSubmit(this.handleSubmit)}
            />
            <Button
              label="Cancel"
              onClick={this.handleCancel}
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
  submitUserPasswordForm: (params) => dispatch(submitUserPasswordForm(params)),
})

let Connected = reduxForm({
  form: 'userPasswordForm',
})(UserPasswordForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

export default withRouter(Connected);
