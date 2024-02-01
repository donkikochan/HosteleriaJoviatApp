import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function RestaurantInfoCard({ titol, descripcio, sourceImage, screen }) {
  const navigation = useNavigation();
  const webLink = "https://www.joviat.com/joviat-hoteleria/";
  const telefonoLink = "tel:938723383";
  const ubicacionLink =
    "https://www.google.com/maps/place/Restaurant+Joviat/@41.7213402,1.8170503,18z/data=!3m1!5s0x12a4586c232215e9:0xb15a44460c06a97!4m19!1m12!4m11!1m3!2m2!1d1.818586!2d41.7219854!1m6!1m2!1s0x12a4586c16126e95:0x635d84a8f511a19d!2sCarrer+de+Rubió+i+Ors,+5,+08241+Manresa,+Barcelona!2m2!1d1.8186347!2d41.7220115!3m5!1s0x12a4586c16126e95:0x635d84a8f511a19d!8m2!3d41.7220115!4d1.8186347!16s%2Fg%2F11c0vpj8y_?entry=ttu";

  const openWebLink = () => {
    Linking.openURL(webLink);
  };

  const openTelefonoLink = () => {
    Linking.openURL(telefonoLink);
  };

  const openUbicacionLink = () => {
    Linking.openURL(ubicacionLink);
  };

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
                <Text style={[styles.clickHere, { fontSize: 12 }]}>
                  Ver Más
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.botonesContainer}>
        {/* Botón Web */}
        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: "#444", marginRight: 5, marginLeft: 10 },
          ]}
          onPress={openWebLink} 
        >
          <Text style={styles.botonText}>Web</Text>
        </TouchableOpacity>
        {/* Botón Teléfono */}
        <TouchableOpacity
          style={[
            styles.boton,
            { backgroundColor: "#444", marginLeft: 5 },
          ]}
          onPress={openTelefonoLink} 
        >
          <Text style={styles.botonText}>Teléfono</Text>
        </TouchableOpacity>
        {/* Botón Ubicación */}
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: "#444", marginLeft: 5 }]}
          onPress={openUbicacionLink} 
        >
          <Text style={styles.botonText}>Ubicación</Text>
        </TouchableOpacity>
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
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20, 
  },
  boton: {
    backgroundColor: "#444", 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1, 
  },
  botonText: {
    color: "#fff", 
  },
});

export default RestaurantInfoCard;
