import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './MeetingInvitationForm.css';
import {withRouter} from 'react-router-dom';

import {TextField} from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import {SelectField} from 'redux-form-material-ui';

import {COLORS} from '../../constants';
import {submitMeetingInvitationForm} from '../../services/api';
import history from '../../history';
import {getUserContacts, getUninvitedContacts} from '../../selectors';
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


class MeetingInvitationForm extends Component {

  handleCancel = (event) => {
    this.props.history.goBack();
  }

  handleSubmit = (values) => {
    const {match, meeting} = this.props;
    const {intent} = match.params;

    const params = {
      meeting_id: meeting.id,
      intent,
      values,
    }

    this.props.submitMeetingInvitationForm(params);
  }

  renderInvitees() {
    //const {contacts} = this.props;
    const {uninvitedContacts} = this.props;
    const renderedItems = uninvitedContacts.map((i, index) => (
      <MenuItem 
        key={i.id} 
        value={i.id} 
        primaryText={i.full_name} 
        style={styles.input}
      />
    ))
    return renderedItems;
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
      ? 'Update Invitation'
      : 'New Invitation'

    return (
      <form>
        <div style={styles.container}>

          <div style={styles.title}>
            {formTitle}
          </div>

          <div style={styles.inputsContainer}>
            <InputContainer>
              <Field 
                name="invitee_id" 
                component={SelectField} 
                hintText="Select person"
              >
                {this.renderInvitees()}
              </Field>
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
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center',
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
  const {match} = ownProps;
  //console.log('mapstatetoprops', this.props)
  let initialValues = {};
  return {
    initialValues,
    contacts: getUserContacts(state),
    uninvitedContacts: getUninvitedContacts(state),
  }
}

const mapDispatchToProps = (dispatch)  => ({
  submitMeetingInvitationForm: (params) => dispatch(submitMeetingInvitationForm(params)),
})

let Connected = reduxForm({
  form: 'meetingInvitationForm',
})(MeetingInvitationForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

//export default Connected;
export default withRouter(Connected);
