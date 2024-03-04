import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const ItemPlaceWorker = () => {
 
  const workerPlaces = [
    "Lugar de Trabajo 1",
    "Lugar de Trabajo 2",
    "Lugar de Trabajo 3",
    "Lugar de Trabajo 4",
    "Lugar de Trabajo 4",
    "Lugar de Trabajo 4",
    "Lugar de Trabajo 4",
    "Lugar de Trabajo 4"
   
  ];

  const [isPressed, setIsPressed] = useState(new Array(workerPlaces.length).fill(false));

  return (
    <ScrollView style={styles.scrollView}>
      {workerPlaces.map((place, index) => (
        <TouchableOpacity
          key={index}
          onPressIn={() => {
            let pressedStates = [...isPressed];
            pressedStates[index] = true;
            setIsPressed(pressedStates);
          }}
          onPressOut={() => {
            let pressedStates = [...isPressed];
            pressedStates[index] = false;
            setIsPressed(pressedStates);
          }}
          style={[
            styles.itemContainer,
            isPressed[index] && styles.itemPressed,
          ]}
        >
          <Text style={styles.itemText}>{place}</Text>
        </TouchableOpacity>
      ))}
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
