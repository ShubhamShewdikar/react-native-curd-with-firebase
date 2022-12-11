import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';

export default function ItemComponent({items}) {
  const renderEntity = ({item, index}) => {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/profile_icon.png')}
            />
            <View style={styles.detailsView}>
              <Text style={styles.buttonTitle}>
                {item.firstName + ' ' + item.lastName}
              </Text>
              <Text style={styles.textStyle}>{item.dob}</Text>
              <Text style={styles.textStyle}>{item.married}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {items && (
        <View style={styles.listContainer}>
          <FlatList
            data={items}
            renderItem={renderEntity}
            keyExtractor={item => item.id}
            removeClippedSubviews={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  itemtext: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
  entityContainer: {
    marginTop: 16,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  entityText: {
    fontSize: 20,
    color: '#333333',
  },
  logo: {
    height: 80,
    width: 80,
    alignSelf: 'center',
    margin: 15,
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
});
