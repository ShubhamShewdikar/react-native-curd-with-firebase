import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Button,
  Platform,
} from 'react-native';
import database from '@react-native-firebase/database';
import CheckBox from '@react-native-community/checkbox';
import strings from '../res/strings';
import storage from '@react-native-firebase/storage';
let ImagePicker = require('react-native-image-picker');
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
import {useNavigation} from '@react-navigation/native';

let addItem = item => {
  const ref = database().ref('/items').push({
    firstName: item.firstName,
    lastName: item.lastName,
    dob: item.dob.toString(),
    married: item.married,
    avatar: item.avatar,
    nodeID: '0',
  });
  ref
    .set({
      firstName: item.firstName,
      lastName: item.lastName,
      dob: item.dob.toString(),
      married: item.married,
      avatar: item.avatar,
      nodeID: ref.key,
    })
    .then(() => console.log('Data updated.'));
};

export default function AddItem({route}) {
  const navigation = useNavigation();

  const {isEditUser, userData} = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [married, setMarried] = useState(false);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [open, setOpen] = useState(false);
  Moment.locale('en');

  if (isEditUser) {
    let imageRef = storage().ref('/' + userData.avatar);
    imageRef
      .getDownloadURL()
      .then(url => {
        //from url you can fetched the uploaded image easily
        const source = {uri: url};
        setImage(source);
      })
      .catch(e => console.log('getting downloadURL of image error => ', e));
  }

  const data = {
    firstName: firstName,
    lastName: lastName,
    dob: dob.toString(),
    married: married,
    avatar: avatar,
  };

  const handleSubmit = () => {
    {
      data.firstName && data.lastName && data.dob
        ? addItem(data)
        : Alert.alert(strings.all_field_required);
    }
    {
      data.firstName &&
        data.lastName &&
        data.dob &&
        navigation.navigate(strings.screens.home, {});
      Alert.alert(strings.user_added_msg);
    }
  };

  const handleDelete = async () => {
    database()
      .ref('/items')
      .on('value', snapshot => {
        snapshot.forEach(async item => {
          if (
            item.val().firstName === userData.firstName &&
            item.val().lastName === userData.lastName
          ) {
            await database()
              .ref('/items/' + userData.nodeID)
              .remove();

            navigation.navigate(strings.screens.home, {});
            Alert.alert(strings.user_deleted_msg);
          }
        });
      });
  };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0]?.uri};
        console.log('response', response);
        console.log('response.assets?.uri ', response.assets[0]?.uri);
        console.log(source);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);
    setAvatar(filename);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={{
            width: 120,
            height: 120,
            alignSelf: 'center',
            marginBottom: 30,
          }}
          onPress={selectImage}>
          <Image
            style={styles.logo}
            source={image ? image : require('../../assets/profile_icon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => uploadImage()}>
          <Text style={styles.buttonTitle}>{'Upload Image'}</Text>
        </TouchableOpacity>

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
        <TouchableOpacity onPress={() => setOpen(true)}>
          <TextInput
            style={styles.input}
            placeholder={strings.user.dob}
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setDOB(text)}
            value={
              isEditUser
                ? Moment(userData.dob).format('DD MMM YYYY').toString()
                : Moment(dob).format('DD MMM YYYY').toString()
            }
            editable={false}
          />
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={dob}
          onConfirm={getDob => {
            setDOB(getDob);
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            style={styles.checkbox}
            disabled={false}
            value={isEditUser ? userData.married : married}
            onValueChange={newValue => setMarried(newValue)}
          />
          <Text style={styles.label}>{strings.user.married}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
          <Text style={styles.buttonTitle}>
            {isEditUser ? strings.save : strings.add_user}
          </Text>
        </TouchableOpacity>
        {isEditUser && (
          <TouchableOpacity
            style={styles.buttonDelete}
            onPress={() => handleDelete()}>
            <Text style={styles.buttonTitle}>{strings.delete}</Text>
          </TouchableOpacity>
        )}
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
    height: 120,
    width: 120,
    alignSelf: 'center',
    margin: 30,
    borderRadius: 150 / 2,
    backgroundColor: '#FF9800',
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
    color: '#000000',
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
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
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 30,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
    alignSelf: 'center',
  },
  uploadBtn: {
    width: '50%',
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonDelete: {
    backgroundColor: '#ff0000',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 5,
    marginBottom: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
