import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {getIsUserLoggedIn} from '../../selectors';

/** 
  Higher order component for making sure
  that user is logged in.  If not logged in,
  will be bounced to /login route.
**/
export default (WrappedComponent) => {
  class AuthProtected extends Component {

    componentWillMount() {
      const {isUserLoggedIn, history} = this.props

      if (!isUserLoggedIn) {
        console.warn('Unauthorized');
        history.push('/login')
      }
    }

    componentWillReceiveProps(nextProps) {
      const {isUserLoggedIn, history} = this.props
 
      if (isUserLoggedIn && !nextProps.isUserLoggedIn) {
        console.warn('Unauthorized');
        history.push('/login')
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }




  const mapStateToProps = (state, ownProps) => {
    return {
      isUserLoggedIn: getIsUserLoggedIn(state),
    }
  }

  const Connected = connect(
    mapStateToProps,
  )(AuthProtected)

  return withRouter(Connected);
}
