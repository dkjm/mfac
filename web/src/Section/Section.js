import React, {Component} from 'react'
import './Section.css'
import {COLORS} from '../constants';

const styles = {
	container: {
		backgroundColor: COLORS.grayBackground,
		margin: '10px',
		borderRadius: '10px',
	},
	title: {
		//color: COLORS.reactBlue,
	}
}

class Section extends Component {

	render() {
		const {title, body} = this.props;
		return(
			<div style={styles.container} className="Section-container">
				<div style={styles.title} className="Section-title">
					{title}
				</div>
				<div className="Section-body">
					{body}
				</div>
			</div>
		)
	}
}

export default Section