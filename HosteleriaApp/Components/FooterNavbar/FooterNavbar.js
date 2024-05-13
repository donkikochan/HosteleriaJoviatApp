import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ListViewComponent from "../MainScreen/ListView";

function FooterNavbar({ setActiveContent, navigation }) {
  const [activeButton, setActiveButton] = useState(setActiveContent);

  const handlePress = (buttonName) => {
    navigation.navigate(buttonName);
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.iconText, activeButton === "Profile"]}
        onPress={() => handlePress("Profile")}
      >
        <Ionicons
          name={activeButton === "Profile" ? "person" : "person-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.iconText, activeButton === "Home"]}
        onPress={() => handlePress("Home")}
      >
        <Ionicons
          name={activeButton === "Home" ? "home-sharp" : "home-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Inici</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.iconText, activeButton === "Favorite"]}
        onPress={() => handlePress("Favorite")}
      >
        <Ionicons
          name={activeButton === "Favorite" ? "heart" : "heart-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Favorits</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    color: "white",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 50,
    paddingVertical: 15,
    position: "relative",
    bottom: 0,
  },
  iconText: {
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default FooterNavbar;
