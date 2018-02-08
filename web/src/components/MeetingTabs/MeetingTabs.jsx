import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {Route, Switch, Redirect} from 'react-router';
import {withRouter} from 'react-router-dom' 
import {COLORS} from '../../constants';



class MeetingTabs extends Component {

	navigateToPath = (path) => {
		const {location, match} = this.props;
		this.context.router.history.push(`${match.url}/${path}`);
	}

	render() {
		const {location, match} = this.props;
		const path = location.pathname;
		console.log(this.props)
		const style = {
			container: {
				margin: '10px 10px',
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
						title='Home' 
						onClick={() => this.navigateToPath('home')} 
						active={path.includes('home')}
					/>
					<Button
						title='Agenda' 
						onClick={() => this.navigateToPath('agenda')} 
						active={path.includes('agenda')}
					/>
					<Button
						title='People' 
						onClick={() => this.navigateToPath('participants')} 
						active={path.includes('participants')}
					/>
					<Button
						title='Invitations' 
						onClick={() => this.navigateToPath('invitations')} 
						active={path.includes('invitations')}
					/>
				</div>

			</div>
		)
	}

}



	
const Button = (props) => {
	const styles = {
		container: {
			padding: '10px',
			textAlign: 'center',
			backgroundColor: props.color || COLORS.blackGray,
			borderRadius: '2px',
			minWidth: props.width || '70px',
			boxShadow: '5px 5px 5px gray',
			margin: '5px',
			color: 'white',
			flexGrow: '1',
			maxWidth: '100px',
		},
		titleContainer: {
			display: 'flex',
		},
		title: {
			paddingBottom: '2px',
			margin: 'auto',
		},
	}

	if (props.active) {
		//style.boxShadow = '1px 1px 1px ' + COLORS.darkGray;
		styles.title.borderBottom = 'solid 1px ' + COLORS.reactBlue;
	}

	return (
		<div style={styles.container} onClick={props.onClick}>
			<div style={styles.titleContainer}>
				<div style={styles.title}>
					{props.title}
				</div>
			</div>
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

	}
}

const Connected = connect(
	mapStateToProps,
	mapDispatchToProps,
)(MeetingTabs)

export default withRouter(Connected);