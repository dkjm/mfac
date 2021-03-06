import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 
import MeetingsDashboard from '../MeetingsDashboard/MeetingsDashboard';
import MeetingDetail from '../MeetingDetail/MeetingDetail';
import Stack from '../Stack/Stack';



class MeetingLayout extends Component {


	
	render() {
		const {match, location} = this.props

		return (
			<div>
				<Switch>

				  <Route exact path={`${match.url}/dashboard`} render={props => ( <MeetingsDashboard {...props} /> )} 
				  />

			  	<Route path={`${match.url}/:meeting_id`} render={props => ( <MeetingDetail {...props} /> )} 
			  	/>



			  	<Redirect to={`${match.url}/dashboard`} />
			  	


			  </Switch>
		  </div>
		)
	}
}

//export default MeetingLayout
export default withRouter(MeetingLayout);



// const MeetingLayout = ({ match }) => (
//   <Switch>
//   	<Route exact path={`${match.url}/dashboard`} render={props => ( <MeetingsDashboard {...props} /> )} 
//   	/>
//   	<Route path={`${match.url}/:meeting_id`} render={props => ( <MeetingDetail {...props} /> )} 
//   	/>
//     <Redirect to={`${match.url}/dashboard`} />
//   </Switch>
// ) 

// export default MeetingLayout;

// class MeetingLayout extends Component {
	
// 	render() {
// 		return (
// 			<div>
// 				MeetingLayout
// 			</div>
// 		)
// 	}
// }


// const mapStateToProps = (state, ownProps) => {
// 	return {
		
// 	}
// }

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		// key: bindActionCreators({
// 		// 	...myActions,
// 		// }, dispatch),
// 	}
// }

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps,
// )(MeetingLayout)