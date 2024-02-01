import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Items = ({ name }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.itemContainer, isPressed && styles.itemPressed]}
    >
      <Image
        source={require("./UserChef.png")} 
        style={styles.userIcon}
      />
      <Text style={styles.itemText}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A9A9A9",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 6,
    width: "100%",
  },
  itemPressed: {
    backgroundColor: "black",
  },
  itemText: {
    fontSize: 20,
    color: "white",
    marginLeft: 13,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
});

export default Items;
