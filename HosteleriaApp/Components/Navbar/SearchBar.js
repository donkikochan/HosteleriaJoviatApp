import React from "react";
import { Dimensions } from "react-native";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View style={styles.searchSection}>
      <Ionicons
        style={styles.searchIcon}
        name="search"
        size={18}
        color="grey"
      />
      <TextInput style={styles.searchInput} clearButtonMode="while-editing" />
    </View>
  );
};

const searchBarWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  searchSection: {
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    height: 35,
  },
  searchIcon: {
    paddingLeft: 10,
  },
  searchInput: {
    borderColor: "gray",
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "white",
    borderRadius: 30,
  },
});

export default SearchBar;
