import React, {Component} from 'react';
import {Button, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import List from './List';

export default class Home extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('AddItem')}>
          <Text style={styles.buttonTitle}>Add User Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('List')}>
          <Text style={styles.buttonTitle}>Display User List</Text>
        </TouchableOpacity>

        {/* <View style={{height: '100%'}}>
          <List />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
