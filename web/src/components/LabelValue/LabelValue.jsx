import React, {Component} from 'react';
import './LabelValue.css';
import {COLORS} from '../../constants';


class LabelValue extends Component {

	render() {
		// TODO(MP 2/8): I had styles defined
		// outside of Component, but I was unable
		// to change values in object dynamically.
		// Ended up putting inside to be able to
		// change them (e.g. if "last" is passed
		// as prop)
		const styles = {
			container: {
				marginBottom: '20px',
			},
			label: {
				fontSize: '80%',
				marginBottom: '5px',
			},
			value: {

			},
		}

		const {label, value, last} = this.props;

		if (last) {styles.container.marginBottom = 0};
		
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