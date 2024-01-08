import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        clearButtonMode="while-editing"
      />
      <TouchableOpacity>
        <Ionicons name="md-menu" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    color: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: "fixed",
    top: 110,
  },
  text: {
    color: "white",
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 25,
    paddingHorizontal: 10,
    height: 35,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
});

export default Navbar;
