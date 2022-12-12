import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import strings from "../res/strings";

export default function ItemComponent({ users }) {
  const navigation = useNavigation();

  const renderEntity = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(strings.screens.add_item, {
              isEditUser: true,
              userData: item,
            });
          }}
        >
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <Image
                style={styles.logo}
                source={require("../../assets/profile_icon.png")}
              />
              <View style={styles.detailsView}>
                <Text style={styles.buttonTitle}>
                  {item.firstName + " " + item.lastName}
                </Text>
                <Text style={styles.textStyle}>{item.dob}</Text>
                <Text style={styles.textStyle}>
                  {item.married ? strings.user.married : strings.user.unmarried}
                </Text>
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
            keyExtractor={(item) => item.id}
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
    alignItems: "center",
  },
  subContainer: {
    backgroundColor: "#FFFFFF",
    marginVertical: 4,
    width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  listContainer: {
    marginTop: 20,
    padding: 20,
    width: "100%",
  },
  logo: {
    height: 80,
    width: 80,
    alignSelf: "center",
    margin: 15,
  },
  textStyle: {
    fontSize: 15,
    color: "black",
    alignItems: "center",
    padding: 5,
  },
  detailsView: {
    alignSelf: "center",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
