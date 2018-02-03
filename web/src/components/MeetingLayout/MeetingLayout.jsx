import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 
import MeetingsDashboard from '../MeetingsDashboard/MeetingsDashboard';
import MeetingDetail from '../MeetingDetail/MeetingDetail';
import MeetingForm from '../MeetingForm/MeetingForm';



class MeetingLayout extends Component {


	
	render() {
		const {match, location} = this.props

		return (
			<div>
				<Switch>

				  <Route exact path={`${match.url}/dashboard`} render={props => ( <MeetingsDashboard {...props} /> )} 
				  />

			  	<Route path={`${match.url}/:meeting_id(\\d+)`} render={props => ( <MeetingDetail {...props} /> )} 
			  	/>

			  	<Route path={`${match.url}/meeting_form/create`} render={props => ( <MeetingForm {...props} /> )} 
			  	/>


			  	{/*<Redirect to={`${match.url}/dashboard`} />*/}
			  	


			  </Switch>
		  </div>
		)
	}
}

//export default MeetingLayout
export default withRouter(MeetingLayout);