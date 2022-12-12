import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Button
} from 'react-native';
import database from '@react-native-firebase/database';
import DatePicker from 'react-native-datepicker';
import CheckBox from '@react-native-community/checkbox';
import strings from '../res/strings';
import storage from '@react-native-firebase/storage';
// import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


let addItem = item => {
  database().ref('/items').push({
    firstName: item.firstName,
    lastName: item.lastName,
    dob: item.dob,
    married: item.married,
  });
};

export default function AddItem({ route }) {
  const { isEditUser, userData} = route.params;  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState('');
  const [married, setMarried] = useState(false);
  const [imagePath, setImagePath] = useState();
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const data = {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    married: married,
  };

  const handleSubmit = () => {
    {data.firstName && data.lastName && data.dob ? addItem(data) : Alert.alert(strings.all_field_required); }
    {data.firstName && data.lastName && data.dob && Alert.alert(strings.user_added_msg); }
  };


  chooseFile = () => {
    console.log('Choose file');
    setStatus('')
    var options = {
        title: 'Select Image',
        customButtons: [
            { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
        ],
        storageOptions: {
            skipBackup: true, // do not backup to iCloud
            path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
        },
    };
    ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
            console.log('User cancelled image picker', storage());
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            let path = this.getPlatformPath(response).value;
            let fileName = this.getFileName(response.fileName, path);
            setImagePath(path)
            this.uploadImageToStorage(path, fileName);
        }
    });
};

getFileName = (name, path) => {
    if (name != null) { return name; }

    if (Platform.OS === "ios") {
        path = "~" + path.substring(path.indexOf("/Documents"));
    }
    return path.split("/").pop();
};

uploadImageToStorage = (path, name) => {
    setLoading(true)
    let reference = storage().ref(name);
    let task = reference.putFile(path);
    task.then(() => {
        console.log('Image uploaded to the bucket!');
        setLoading(false)
        setStatus('Image uploaded successfully')
    }).catch((e) => {
        status = 'Something went wrong';
        console.log('uploading image error => ', e);
        setLoading(false)
        setStatus('Something went wrong')
    });
};

/**
 * Get platform specific value from response
 */
getPlatformPath = ({ path, uri }) => {
    return Platform.select({
        android: { "value": path },
        ios: { "value": uri }
    })
};

getPlatformURI = (imagePath) => {
    let imgSource = imagePath;
    if (isNaN(imagePath)) {
        imgSource = { uri: this.state.imagePath };
        if (Platform.OS == 'android') {
            imgSource.uri = "file:///" + imgSource.uri;
        }
    }
    return imgSource
};

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          style={styles.logo}
          // source={() => this.getPlatformURI(imagePath)}
          source={require('../../assets/profile_icon.png')}
        />
         <Button title={'Upload Image'} onPress={() => this.chooseFile}></Button>

        <TextInput
          style={styles.input}
          placeholder={strings.user.first_name}
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFirstName(text)}
          value={isEditUser ? userData.firstName : firstName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={strings.user.last_name}
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setLastName(text)}
          value={isEditUser ? userData.lastName : lastName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <DatePicker
          style={[styles.input, styles.datePickerStyle]}
          date={isEditUser ? userData.dob : dob} // Initial date from state
          mode="date" // The enum of date, datetime and time
          placeholder={strings.user.last_name}
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
        value={isEditUser ? userData.married : married}
        onValueChange={(newValue) => setMarried(newValue)}
        />
        <Text style={styles.label}>{strings.user.married}</Text>
      </View>
        
        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonTitle}>{isEditUser ? strings.save : strings.add_user}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
