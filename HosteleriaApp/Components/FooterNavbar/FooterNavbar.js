import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function FooterNavbar() {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconText}>
        <Ionicons name="md-person" size={20} color="white" />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconText}>
        <Ionicons name="md-home-sharp" size={20} color="white" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconText}>
        <Ionicons name="md-heart" size={20} color="white" />
        <Text style={styles.text}>Favorite</Text>
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
    position: "absolute",
    bottom: 0,
  },
  iconText: {
    flexDirection: "column",
  },
  iconText: {
    alignItems: "center",
    textAlign: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default FooterNavbar;
