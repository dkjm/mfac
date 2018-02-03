import React, {Component} from 'react';
import './LabelValue.css';
import {COLORS} from '../../constants';


const styles = {
	container: {
		//border: 'solid black',
		marginBottom: '30px',
	},
	label: {
		//border: 'solid blue',
		fontSize: '80%',
		marginBottom: '5px',
		//backgroundColor: COLORS.lightGray,
		//padding: '5px',
	},
	value: {
		//border: 'solid orange',
		//padding: '5px',
	},
}

class LabelValue extends Component {

	render() {
		const {label, value} = this.props;
		return(
			<div style={styles.container}>

				<div style={styles.label}>
					{label}
				</div>

				<div style={styles.value}>
					{value}
				</div>

			</div>
		)
	}
}

export default LabelValue;