import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './AgendaItemForm.css';
import {withRouter} from 'react-router-dom';

// use TextField from 'redux-form-material-ui'
// so that it works with redux form
// DO NOT use TextField from 'material-ui'
import {TextField} from 'redux-form-material-ui'
//import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {COLORS} from '../../constants';
import {submitAgendaItemForm} from '../../services/api';
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


class AgendaItemForm extends Component {

	handleCancel = (event) => {
		this.props.history.goBack();
	}

	handleSubmit = (values) => {
		// TODO: all fields that fail validation
		// should show errors on submit.
		// Right now, failing fields only show 
		// error if they are dirty
		const {match, meeting} = this.props;
		const {
			intent, 
			agenda_item_id,
		} = match.params;

		const data = {
			intent,
			agenda_item_id,
			meeting_id: meeting.id,
			values,
		}

		this.props.submitAgendaItemForm(data);
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
	  	? 'Update Agenda Item'
	  	: 'New Agenda Item'

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
				      	name="body" 
				      	component={TextField}
				      	floatingLabelText="Body"
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
	// 1. get topic_id from match.
	// 2. get topic from state
	// 3. if topic exists, use it for initialValues
	// else initialValues is empty obj
	const {match} = ownProps;
	const {agenda_item_id, intent} = match.params;
	let initialValues = {};
	let agendaItem;
	// if: intent is update and agendaItem
	// has value in state, use those values
	// as initialValues for form
	// else: use empty object
	if (intent === 'update') {
		agendaItem = getAgendaItem(state, {agenda_item_id})
		if (agendaItem) {
			initialValues = {
				title: agendaItem.title,
				body: agendaItem.body,
			}
		} 
	}
	
	return {
		initialValues,
	}
}

const mapDispatchToProps = (dispatch)  => ({
  submitAgendaItemForm: (params) => dispatch(submitAgendaItemForm(params)),
})

let Connected = reduxForm({
  form: 'agendaItemForm',
})(AgendaItemForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

//export default Connected;
export default withRouter(Connected);
