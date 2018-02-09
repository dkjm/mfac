import React, {Component} from 'react';
import './SpinningLogo.css';
import reactLogo from '../../resources/logo.svg'

const SpinningLogo = (props) => {
	return (
		<div style={styles.container}>
			<img 
        src={reactLogo} 
        style={styles.logo} 
        className="spinning-logo"
        alt="logo" 
      />
		</div>
	)
}


const styles = {
  container: {
  	minWidth: '60px',
  },
  header: {

  },
  logo: {
  	//display: 'block',
  },
  title: {

  },
}

export default SpinningLogo;