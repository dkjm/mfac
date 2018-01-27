import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import './TopicForm.css';

// use TextField from redux form mat ui
// so that it works with redux form
import {TextField} from 'redux-form-material-ui'
//import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import {COLORS} from '../constants';
import RaisedButton from 'material-ui/RaisedButton';

import {submitTopicForm} from '../api';
import history from '../history';
import {getTopic} from '../selectors';


// InputContainer is just a simple
// container for Fields.  Provides
// some consistent spacing, etc.
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

		},
	}
	return (
		<div style={styles.container}>
			<RaisedButton 
				style={styles.root}
				buttonStyle={styles.buttonStyle}
				labelStyle={styles.labelStyle}
				label={props.label} 
				backgroundColor={COLORS.reactBlue}
				onClick={props.onClick}
				fullWidth={true}
			/>
		</div>
	)
}


class TopicForm extends Component {

	constructor(props) {
    super(props);
  	this.state = {
    	snackbarOpen: false,
  	}
  }

  handleRequestCloseSnackbar = () => {
  	console.log('handleRequestCloseSnackbar')
  }

	handleCancel = () => {
		console.log('cancel');
		history.goBack();
	}

	handleSubmit = (values) => {
		console.log('handleSubmit', values);
		// todo: pass meeting_id arg to 
		// submitTopicForm, along with
		// field values.  Using fake
		// meeting_id for now
		const {match} = this.props;
		const {intent, topic_id} = match.params;
		const data = {
			intent,
			meeting_id: 1,
			topic_id,
			values,
		}

		this.props.submitTopicForm(data)
	}

	render() {

		const { 
	  	handleSubmit, 
	  	pristine, 
	  	reset, 
	  	submitting,
	  	match,
	  } = this.props

	  const styles = {
	  	input: {
	  		minWidth: '60px',
	  		textAlign: 'left',
	  	}
	  }

	  const {intent} = match.params

	  const formTitle = intent === 'update'
	  	? 'Update Topic'
	  	: 'Create Topic'

		return (
	    <form>
	    	<div className="TopicForm-container">

	    		<div className="TopicForm-title">
	    			{formTitle}
	    		</div>

	    		<div className="TopicForm-fields-container">
	    			<InputContainer>
				      <Field 
				      	style={styles.input}
				      	fullWidth={true}
				      	name="title" 
				      	component={TextField}
				      	floatingLabelText="Title"
				      	autoFocus={true} 
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
				      />
				    </InputContainer>

			    </div>

			    <div className="TopicForm-buttons-container">
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
  


const mapStateToProps = (state, ownProps) => {
	// get topic_id from match.
	// get topic from state
	// if topic exists, use it for initialValues
	// else initialValues is empty obj
	const {match} = ownProps;
	const {topic_id} = match.params;
	const topic = getTopic(state, {topic_id})

	const initialValues = !topic ? {}
		: {
				title: topic.title,
				body: topic.body,
			}

	return {
		initialValues,
	}
}

const mapDispatchToProps = (dispatch)  => ({
  submitTopicForm: (params) => dispatch(submitTopicForm(params)),
})

let Connected = reduxForm({
  form: 'topic',
})(TopicForm)

Connected = connect(
  mapStateToProps,
  mapDispatchToProps
)(Connected)

export default Connected;
