import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import DatePicker from 'react-native-datepicker';
import CheckBox from '@react-native-community/checkbox';

let addItem = item => {
  database().ref('/items').push({
    firstName: item.firstName,
    lastName: item.lastName,
    dob: item.dob,
    married: item.married,
  });
};

export default function AddItem() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [married, setMarried] = useState(false);

  const data = {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    married: married,
  };

  const handleSubmit = () => {
    addItem(data);
    Alert.alert('Item saved successfully');
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/profile_icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <DatePicker
          style={[styles.input, styles.datePickerStyle]}
          date={dob} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder="select DOB"
          format="DD-MM-YYYY"
          minDate="01-01-1930"
          maxDate="12-12-2022"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              marginLeft: 0,
              width: 30,
              height: 30,
            },
            dateText:{
              fontSize: 14,
              alignSelf: 'flex-start',
              marginLeft: 40,
            },
            placeholderText: {
              alignSelf: 'flex-start',
              marginLeft: 40,
            },
            dateInput: {
              borderWidth: 0,
            }
          }}
          onDateChange={(dob) => {
            setDOB(dob);
          }}
        />
        <View style={styles.checkboxContainer}>
        <CheckBox
        style={styles.checkbox}
        disabled={false}
        value={married}
        onValueChange={(newValue) => setMarried(newValue)}
        />
        <Text style={styles.label}>Married</Text>
      </View>
        
        
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonTitle}>ADD USER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#6565fc',
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    width: '100%',
  },
  logo: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingLeft: 16,
  },
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
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: '#788eec',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePickerStyle: {
    width: '85%',
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 20,
    marginHorizontal: 30,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
    alignSelf: "center",
  },
});
