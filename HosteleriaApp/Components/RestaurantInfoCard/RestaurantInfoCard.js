import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function RestaurantInfoCard({ titol, descripcio, accio, sourceImage, screen }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.group2}>
        <View style={styles.group}>
          <View style={styles.group4}>
            <Text style={styles.nomRestaurant}>{titol}</Text>
            <View style={styles.descripcioRestaurantRow}>
              <Text style={styles.descripcioRestaurant}>{descripcio}</Text>
              <View style={styles.descripcioRestaurantFiller}></View>
              <TouchableOpacity
                style={styles.group3}
                onPress={() => navigation.navigate(screen)}
              >
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
    paddingBottom: 10,
  },
  group: {
    width: 360,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "center",
    alignSelf: "center",
  },
  group4: {
    width: 248,
    alignSelf: "center",
    paddingTop: 10,
  },
  nomRestaurant: {
    color: "rgba(0,0,0,1)",
    fontSize: 20,
    textAlign: "center",
    width: 224,
    marginLeft: 12,
    fontWeight: "bold",
  },
  descripcioRestaurant: {
    color: "rgba(0,0,0,1)",
    fontSize: 15,
    textAlign: "center",
    width: 200,
    marginRight: 50,
  },
  descripcioRestaurantFiller: {
    flex: 1,
    flexDirection: "row",
  },
  group3: {
    width: 91,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  iconaImatge: {
    width: 40,
    height: 40,
    marginRight: 26,
  },
  clickHere: {
    color: "#121212",
    textAlign: "center",
    fontSize: 18,
    width: 91,
    height: 25,
    fontWeight: "bold",
  },
  descripcioRestaurantRow: {
    flexDirection: "row",
    marginTop: 11,
    alignSelf: "center",
  },
});

export default RestaurantInfoCard;
