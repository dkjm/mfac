import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './ProposalForm.css';
import {withRouter} from 'react-router-dom';


import {TextField} from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton';

import {COLORS} from '../../constants';
import {submitProposalForm} from '../../services/api';
import {getProposal} from '../../selectors';
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


class ProposalForm extends Component {

  handleCancel = (event) => {
    this.props.history.goBack();
  }

  handleSubmit = (values) => {
    // TODO: all fields that fail validation
    // should show errors on submit.
    // Right now, failing fields only show 
    // error if they are dirty
    const {
      match,
      submitProposalForm,
    } = this.props;

    const {
      intent, 
      proposal_id,
      agenda_item_id,
    } = match.params;

    const data = {
      agenda_item_id,
      proposal_id,
      intent,
      values,
    }

    submitProposalForm(data);
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

    const {intent} = match.params;

    const formTitle = intent === 'update'
      ? 'Update Proposal'
      : 'New Proposal'

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
  const {match} = ownProps;
  const {
    agenda_item_id, 
    proposal_id, 
    intent,
  } = match.params;
  let initialValues = {};
  let proposal;
  // if: intent is update and proposal
  // has value in state, use those values
  // as initialValues for form
  // else: use empty object
  if (intent === 'update') {
    proposal = getProposal(state, {agenda_item_id, proposal_id})
    if (proposal) {
      initialValues = {
        title: proposal.title,
        description: proposal.description,
      }
    } 
  }
  
  return {
    initialValues,
  }
}

const mapDispatchToProps = (dispatch)  => ({
  submitProposalForm: (params) => dispatch(submitProposalForm(params)),
})

let Connected = reduxForm({
  form: 'proposalForm',
})(ProposalForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

//export default Connected;
export default withRouter(Connected);
