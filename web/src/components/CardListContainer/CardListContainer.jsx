import React, {Component} from 'react';
import './CardListContainer.css';


// Simple component to hold lists of items.
// Useful for maintaining consistent appearance across app
// Accepts "style" property which can be used to 
// override default styles

const styles = {
	padding: '0px 15px',
}
// padding: 0px 20px;

const CardListContainer = (props) => {
	// if style prop given, merge styles
	let mergedStyles = styles;
	if (props.style) {
		mergedStyles = {
			...mergedStyles,
			...props.style,
		}
	}

	return(
		<div style={mergedStyles}>
			{props.children}
		</div>
	)
}

export default CardListContainer;