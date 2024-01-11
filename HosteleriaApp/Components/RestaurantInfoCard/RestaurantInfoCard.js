import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function RestaurantInfoCard({ titol, descripcio, accio, sourceImage }) {
  return (
    <View style={styles.container}>
      <View style={styles.group2}>
        <View style={styles.group}>
          <View style={styles.group4}>
            <Text style={styles.nomRestaurant}>{titol}</Text>
            <View style={styles.descripcioRestaurantRow}>
              <Text style={styles.descripcioRestaurant}>{descripcio}</Text>
              <View style={styles.descripcioRestaurantFiller}></View>
              <TouchableOpacity style={styles.group3}>
                <Ionicons
                  name={sourceImage}
                  style={styles.iconaImatge}
                  size={40}
                  resizeMode="cover"
                ></Ionicons>
                <Text style={styles.clickHere}>{accio}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
    backgroundColor: "rgba(230, 230, 230,0)",
  },
  group2: {
    overflow: "visible",
    borderRadius: 9,
    borderWidth: 0,
    borderColor: "#000000",
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
  },
  group: {
    width: 360,
    height: 130,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "center",
  },
  group4: {
    width: 248,
    height: 105,
    alignSelf: "center",
  },
  nomRestaurant: {
    fontFamily: "open-sans-700",
    color: "rgba(0,0,0,1)",
    fontSize: 19,
    textAlign: "center",
    width: 224,
    height: 26,
    marginLeft: 12,
  },
  descripcioRestaurant: {
    fontFamily: "open-sans-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 11,
    textAlign: "center",
    width: 99,
    height: 61,
  },
  descripcioRestaurantFiller: {
    flex: 1,
    flexDirection: "row",
  },
  group3: {
    width: 91,
    height: 68,
    alignItems: "flex-end",
  },
  iconaImatge: {
    width: 40,
    height: 40,
    marginRight: 26,
  },
  clickHere: {
    fontFamily: "open-sans-700",
    color: "#121212",
    textAlign: "center",
    fontSize: 18,
    width: 91,
    height: 25,
  },
  descripcioRestaurantRow: {
    height: 68,
    flexDirection: "row",
    marginTop: 11,
  },
});

export default RestaurantInfoCard;
