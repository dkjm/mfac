import React, {Component} from 'react'
import './LayoutBanner.css'
import '../index.css'
import reactLogo from '../logo.svg'

class LayoutBanner extends Component {

	render() {
		const {
			logo = reactLogo, 
			title,
		} = this.props

    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{title}</h1>
        </header>
      </div>
    )
  }
}

export default LayoutBanner