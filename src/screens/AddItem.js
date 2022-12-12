import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import database from "@react-native-firebase/database";
import DatePicker from "react-native-datepicker";
import CheckBox from "@react-native-community/checkbox";
import strings from "../res/strings";
import storage from "@react-native-firebase/storage";
// import ImagePicker from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
let ImagePicker = require("react-native-image-picker");

let addItem = (item) => {
  database().ref("/items").push({
    firstName: item.firstName,
    lastName: item.lastName,
    dob: item.dob,
    married: item.married,
    avatar: item.avatar,
  });
};

export default function AddItem({ route }) {
  const { isEditUser, userData } = route.params;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [married, setMarried] = useState(false);
  const [imagePath, setImagePath] = useState();
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [avatar, setAvatar] = useState(null);

  if (isEditUser) {
    let imageRef = storage().ref("/" + userData.avatar);
    imageRef
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        const source = { uri: url };
        setImage(source)
      })
      .catch((e) => console.log("getting downloadURL of image error => ", e));
  }

  const data = {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
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
        Alert.alert(strings.user_added_msg);
    }
  };

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.assets[0]?.uri };
        console.log("response", response);
        console.log("response.assets?.uri ", response.assets[0]?.uri);
        console.log(source);
        setImage(source);
      }
    });
  };

  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(filename).putFile(uploadUri);
    setAvatar(filename);
    // set progress state
    task.on("state_changed", (snapshot) => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      "Photo uploaded!",
      "Your photo has been uploaded to Firebase Cloud Storage!"
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity
          style={{
            width: 120,
            height: 120,
            alignSelf: "center",
            marginBottom: 30,
          }}
          onPress={selectImage}
        >
          <Image
            style={styles.logo}
            source={image ? image : require("../../assets/profile_icon.png")}
          />
        </TouchableOpacity>
        <Button title={"Upload Image"} onPress={uploadImage}></Button>

        <TextInput
          style={styles.input}
          placeholder={strings.user.first_name}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFirstName(text)}
          value={isEditUser ? userData.firstName : firstName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={strings.user.last_name}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setLastName(text)}
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
              position: "absolute",
              left: 0,
              marginLeft: 0,
              width: 30,
              height: 30,
            },
            dateText: {
              fontSize: 14,
              alignSelf: "flex-start",
              marginLeft: 40,
            },
            placeholderText: {
              alignSelf: "flex-start",
              marginLeft: 40,
            },
            dateInput: {
              borderWidth: 0,
            },
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
          <Text style={styles.buttonTitle}>
            {isEditUser ? strings.save : strings.add_user}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  subContainer: {
    flex: 1,
    width: "100%",
  },
  logo: {
    height: 120,
    width: 120,
    alignSelf: "center",
    margin: 30,
    borderRadius: 150 / 2,
    backgroundColor: "#FF9800",
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#788eec",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerStyle: {
    width: "85%",
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
