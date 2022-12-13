import React, {Component} from 'react';
import {Button, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import List from './List';
import strings from '../res/strings';

export default class Home extends Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            this.props.navigation.navigate(strings.screens.add_item, {
              isEditUser: false,
              userData: [],
            })
          }>
          <Text style={styles.buttonTitle}>{strings.add_new_user}</Text>
        </TouchableOpacity>
        <View style={styles.listView}>
          <List />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#008eec',
    marginHorizontal: 30,
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
  listView: {
    height: '90%',
  },
});
