import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const Items = ({ name, foto, position, isLast }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.itemContainer,
        isPressed && styles.itemPressed,
        isLast && styles.lastItem,
      ]}
    >
      <Image source={{ uri: foto }} style={styles.userIcon} />
      <Text style={styles.itemText}>{`${position} - ${name}`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    flexShrink: 1,
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 10,
  },
  lastItem: {
    marginBottom: 50,
  },
});

export default Items;
