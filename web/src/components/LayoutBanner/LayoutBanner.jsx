import React, {Component} from 'react';
import './LayoutBanner.css';
import reactLogo from '../../resources/logo.svg'

class LayoutBanner extends Component {

	render() {
		const {
			logo = reactLogo, 
			title,
		} = this.props

    return (
      <div style={styles.container}>
        <header style={styles.header}>
        {
          logo && (
            <img 
              src={logo} 
              style={styles.logo} 
              className="App-logo"
              alt="logo" 
            />
          )
        }
          
          <div styles={styles.title}>{title}</div>
        </header>
      </div>
    )
  }
}

const styles = {
  container: {
  },
  header: {

  },
  logo: {

  },
  title: {

  },
}

export default LayoutBanner;