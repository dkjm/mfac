import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {Route, Switch, Redirect} from 'react-router';
import LayoutBanner from '../LayoutBanner/LayoutBanner';
import CardListContainer from '../CardListContainer/CardListContainer';
import Section from '../Section/Section';
import {withRouter} from 'react-router-dom' 
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import {COLORS} from '../constants';



class MeetingHome extends Component {
	
	renderParticipants() {
		const {meeting} = this.props;
		const items = meeting.participants;
		const renderedItems = items.map((item, index) => {
			
			return (
				<ParticipantCard key={item.id} participant={item} />
			)
		})

		// override default padding of CardListContainer
		const style = {
			padding: '10px',
		}
		return (
			<CardListContainer style={style}>
				{renderedItems}
			</CardListContainer>
		)
	}

	renderAgendaItems() {
		const {meeting} = this.props;
		const items = meeting.agenda.items;
		const renderedItems = items.map((item, index) => {
			
			return (
				<AgendaItemCard key={item.id} item={item} />
			)
		})

		// override default padding of CardListContainer
		const style = {
			padding: '10px',
		}
		return (
			<CardListContainer style={style}>
				{renderedItems}
			</CardListContainer>
		)
	}

	navigateToPath = (path) => {
		this.context.router.history.push(`${location.pathname}/${path}`);
	}


	render() {
		// don't really need any of the flex props
		// below.  was just trying them out
		const style = {
			container: {
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

				<Section 
					title="PARTICIPANTS"
					body={this.renderParticipants()}
				/>
				<Section 
					title="AGENDA"
					body={this.renderAgendaItems()}
				/>
			</div>
		)
	}

}



	
const Button = (props) => {
	const style = {
		padding: '10px',
		textAlign: 'center',
		//backgroundColor: COLORS.reactBlue,
		backgroundColor: props.color || COLORS.darkGray,
		borderRadius: '10px',
		minWidth: props.width || '70px',
		boxShadow: '10px 10px 10px gray',
		margin: '5px',
		color: 'white',
	}
	return (
		<div style={style} onClick={props.onClick}>
			{props.title}
		</div>
	)
}


class ParticipantCard extends Component {
	
	render() {
		const p = this.props.participant;
		const style = {
			padding: '10px',
			textAlign: 'left',
		}
		return (
			<div style={style}>
				{p.full_name}
			</div>
		)
	}
}


class AgendaItemCard extends Component {
	
	render() {
		const i = this.props.item;
		const styles = {
			container: {
				padding: '10px',
				textAlign: 'left',
				display: 'flex',
				minHeight: '30px',
			},
			title: {
				//flexGrow: '2',
				width: '90%',
			},
			statusContainer: {
				//flexGrow: '1',
				width: '10%',
			},
			check: {

			}
		}

		const statusIcon = (
			<div style={styles.check}>
				<CheckIcon />
			</div>
		)

		return (
			<div style={styles.container}>
				<div style={styles.title}>
					{i.title}
				</div>
				<div style={styles.statusContainer}>
					{i.status === 'closed' &&statusIcon}
				</div>
			</div>
		)
	}
}

MeetingHome.contextTypes = {
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
)(MeetingHome)

export default withRouter(Connected)