import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { useNavigation } from '@react-navigation/native';

const ItemPlaceWorker = ({ responsabilitat, restaurantName }) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ScrollView style={styles.scrollView}>
      <TouchableOpacity
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => navigation.goBack()}  // Navega hacia atrás cuando se presiona
        style={[
          styles.itemContainer,
          isPressed && styles.itemPressed,  // Cambia el estilo cuando se presiona
        ]}
      >
        <Text style={styles.itemText}>
          {responsabilitat} - {restaurantName}
        </Text>
      </TouchableOpacity>
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
    backgroundColor: "black",  // Estilo para cuando se presiona el elemento
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
