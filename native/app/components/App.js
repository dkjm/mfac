/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {NativeModules} from 'react-native';
import {NativeRouter, Switch, Route, Link} from 'react-router-native';
import configureStore from '../store/configureStore';
import LoginForm from './LoginForm';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const store = configureStore();
console.warn('store', store)

type Props = {};

class App extends Component<Props> {

  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <Route exact path="/" component={LoginForm} />
        </NativeRouter>
      </Provider>
    );
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export default App;