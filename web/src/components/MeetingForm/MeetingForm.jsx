import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './MeetingForm.css';
import {withRouter} from 'react-router-dom';

import {TextField} from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton';

import {COLORS} from '../../constants';
import {submitMeetingForm} from '../../services/api';
import history from '../../history';
import {getMeeting} from '../../selectors';
import {required} from '../../validation';

// InputContainer is just a simple
// container for Fields.  Provides
// some consistent spacing, etc.
// TODO: Can prob just create a separate 
// component "Input" that has a Field
// and provides necessary spacing.
const InputContainer = ({children}) => {
  const s = {
    maxWidth: '400px',
    margin: 'auto',
  }
  return (
    <div style={s}>
      {children}
    </div>
  )
}


const Button = (props) => {
  const s = {
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
    <div style={s.container}>
      <RaisedButton 
        style={s.root}
        buttonStyle={s.buttonStyle}
        labelStyle={s.labelStyle}
        label={props.label} 
        backgroundColor={COLORS.blackGray}
        onClick={props.onClick}
        fullWidth={true}
      />
    </div>
  )
}


class MeetingForm extends Component {

  handleCancel = (event) => {
    this.props.history.goBack();
  }

  handleSubmit = (values) => {
    // TODO: all fields that fail validation
    // should show errors on submit.
    // Right now, failing fields only show 
    // error if they are dirty
    const {match, meeting} = this.props;
    const {intent} = match.params;
    const meeting_id = meeting ? meeting.id : null;

    const data = {
      intent,
      meeting_id,
      values,
    }

    this.props.submitMeetingForm(data);
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

    const {intent} = match.params

    const formTitle = intent === 'update'
      ? 'Update Meeting'
      : 'New Meeting'

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
                name="title" 
                component={TextField}
                floatingLabelText="Title"
                autoFocus={true} 
                validate={required}
              />
            </InputContainer>

            <InputContainer>
              <Field 
                style={styles.input}
                fullWidth={true}
                name="description" 
                component={TextField}
                floatingLabelText="Description"
                multiLine={true} 
                validate={required}
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
    padding: '15px 0',
  },
  title: {
    fontSize: '130%',
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: '25px',
  },
  input: {
    minWidth: '60px',
    textAlign: 'left',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}
  


const mapStateToProps = (state, ownProps) => {
  const {match, meeting} = ownProps;
  let initialValues = {};
  if (meeting) {
    initialValues = {
      title: meeting.title,
      description: meeting.description,
    }
  }
  return {
    initialValues,
  }
}

const mapDispatchToProps = (dispatch)  => ({
  submitMeetingForm: (params) => dispatch(submitMeetingForm(params)),
})

let Connected = reduxForm({
  form: 'meetingForm',
})(MeetingForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

//export default Connected;
export default withRouter(Connected);
