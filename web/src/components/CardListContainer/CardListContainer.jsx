import React, {Component} from 'react'
import './CardListContainer.css'


// Simple component to hold lists of items.
// Useful for maintaining consistent appearance across app
// Accepts "style" property which can be used to 
// override default styles,
// which are set in its css file


// padding: 25px;

const CardListContainer = (props) => {
	// default padding is set
	const {style} = props;
	return(
		<div style={style} className="CardListContainer-container">
			{props.children}
		</div>
	)
}

export default CardListContainer