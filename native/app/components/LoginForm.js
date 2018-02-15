import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {connectUserSocket} from '../services/session';


type Props = {};
class LoginForm extends Component<Props> {

  componentDidMount() {
    const {connectUserSocket} = this.props;
    connectUserSocket();
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Login form
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})


const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    connectUserSocket: (params) => dispatch(connectUserSocket(params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm)