import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 
import {COLORS} from '../constants';



class MeetingTabs extends Component {

	navigateToPath = (path) => {
		const {location, match} = this.props;
		this.context.router.history.push(`${match.url}/${path}`);
	}


	render() {
		const {location, match} = this.props;
		const pieces = location.pathname.split('/');
		// last piece is part of path we are
		// interested in
		const activeTab = pieces[pieces.length - 1];
		
		// don't really need any of the flex props
		// below.  was just trying them out
		const style = {
			container: {
				margin: '10px 10px',
				// textAlign: 'center',
				// display: 'flex',
				// flexDirection: 'column',
				// justifyContent: 'center',
			},
			buttonsContainer: {
				textAlign: 'center',
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
			},
		}
		return (
			<div style={style.container}>

				<div style={style.buttonsContainer}>
					<Button
						title='Main' 
						onClick={() => this.navigateToPath('home')} 
						active={activeTab === 'home'}
					/>
					<Button
						title='Stack' 
						onClick={() => this.navigateToPath('stack')} 
						active={activeTab === 'stack'}
					/>
					<Button
						title='Agenda' 
						onClick={() => this.navigateToPath('agenda')} 
						active={activeTab === 'agenda'}
					/>
					<Button
						title='People' 
						onClick={() => this.navigateToPath('participants')} 
						active={activeTab === 'participants'}
					/>
					<Button
						title='Resources' 
						onClick={() => this.navigateToPath('resources')} 
						active={activeTab === 'resources'}
					/>
				</div>

			</div>
		)
	}

}



	
const Button = (props) => {
	const style = {
		padding: '10px',
		textAlign: 'center',
		//backgroundColor: COLORS.reactBlue,
		//backgroundColor: props.color || COLORS.darkGray,
		//backgroundColor: props.color || '#2979FF',
		backgroundColor: props.color || COLORS.midnightGray,
		borderRadius: '2px',
		minWidth: props.width || '70px',
		boxShadow: '5px 5px 5px gray',
		margin: '5px',
		color: 'white',
		flexGrow: '1',
		maxWidth: '100px',
	}

	if (props.active) {
		//style.color = COLORS.reactBlue,
		style.boxShadow = '1px 1px 1px ' + COLORS.darkGray;
	}

	return (
		<div style={style} onClick={props.onClick}>
			{props.title}
		</div>
	)
}


MeetingTabs.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
	return {
		
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		// key: bindActionCreators({
		// 	...myActions,
		// }, dispatch),
	}
}

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingTabs)

export default withRouter(Connected)