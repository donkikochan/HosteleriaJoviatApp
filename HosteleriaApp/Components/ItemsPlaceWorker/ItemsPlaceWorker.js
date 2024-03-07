import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView,View } from "react-native";

const ItemPlaceWorker = ({ responsabilitat, restaurantName }) => {
 

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>
         {responsabilitat} - {restaurantName}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 4,
    marginVertical: 6,
    alignSelf: "center",
    width: "95%",
    borderWidth: 0.5,
    borderColor: "black",
  },
  itemPressed: {
    backgroundColor: "black",
  },
  itemText: {
    fontSize: 20,
    color: "black",
    marginLeft: 13,
    marginRight: 10,
    flex: 1,
    textAlign: "center",
  },
});

export default ItemPlaceWorker;
