import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ItemComponent from "../components/ItemComponent";
import database from "@react-native-firebase/database";

let itemsRef = database().ref("/items");

export default function List() {
  const [usersArray, setUsersArray] = React.useState([]);
  React.useEffect(() => {
    itemsRef.on("value", (snapshot) => {
      let data = snapshot.val();
      const items = Object.values(data);
      setUsersArray(items);
    });
  }, []);

  return (
    <View style={styles.container}>
      {usersArray.length > 0 ? (
        <ItemComponent users={usersArray} />
      ) : (
        <Text>No items</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ebebeb",
  },
});
