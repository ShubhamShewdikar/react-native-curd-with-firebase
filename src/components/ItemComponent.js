import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import strings from '../res/strings';
import Moment from 'moment';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

export default function ItemComponent({users}) {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const handleDelete = item => {
    database()
      .ref('/items')
      .on('value', snapshot => {
        snapshot.forEach(async itemVal => {
          if (
            itemVal.val().firstName === item.firstName &&
            itemVal.val().lastName === item.lastName
          ) {
            database()
              .ref('/items/' + item.nodeID)
              .remove();

            navigation.navigate(strings.screens.home, {});
          }
        });
        Alert.alert(strings.user_deleted_msg);
      });
  };

  const getImage = avatar => {
    let imageRef = storage().ref('/' + avatar);
    imageRef
      .getDownloadURL()
      .then(url => {
        //from url you can fetched the uploaded image easily
        const source = {uri: url};
        setImage(source);
      })
      .catch(e => console.log('getting downloadURL of image error => ', e));
  };

  const renderEntity = ({item, index}) => {
    console.log('>>>> item skdjhkshkhdkfhsk', item);
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(strings.screens.add_item, {
              isEditUser: true,
              userData: item,
            });
          }}>
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <Image
                style={styles.logo}
                source={
                  item.avatar
                    ? {
                        uri: `https://firebasestorage.googleapis.com/v0/b/userlist-d7b56.appspot.com/o/${item.avatar}?alt=media&token=a4db048d-0eec-469b-a10d-2771ec18173d`,
                      }
                    : require('../../assets/profile_icon.png')
                }
              />
              <View style={styles.detailsView}>
                <Text style={styles.buttonTitle}>
                  {item.firstName + ' ' + item.lastName}
                </Text>
                <Text style={styles.textStyle}>
                  {Moment(item.dob).format('DD MMM YYYY').toString()}
                </Text>
                <Text style={styles.textStyle}>
                  {item.married ? strings.user.married : strings.user.unmarried}
                </Text>
              </View>
              <View style={styles.deleteView}>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Image
                    style={styles.deleteLogo}
                    source={require('../../assets/delete.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {users && (
        <View style={styles.listContainer}>
          <FlatList
            data={users}
            renderItem={renderEntity}
            keyExtractor={item => item.id}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
    width: '100%',
  },
  logo: {
    height: 80,
    width: 80,
    margin: 15,
    alignSelf: 'center',
    borderRadius: 150 / 2,
    backgroundColor: '#FF9800',
  },
  textStyle: {
    fontSize: 15,
    color: 'black',
    alignItems: 'center',
    padding: 5,
  },
  detailsView: {
    alignSelf: 'center',
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  deleteView: {
    alignSelf: 'center',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    marginRight: 15,
    right: 0,
  },
  deleteLogo: {
    height: 20,
    width: 20,
  },
});
