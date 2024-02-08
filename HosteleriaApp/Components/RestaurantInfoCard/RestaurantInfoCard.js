import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function RestaurantInfoCard({ titol, descripcio, web, tel, ubicacion }) {
  const navigation = useNavigation();

  const openWebLink = () => {
    if (web.startsWith("http://") || web.startsWith("https://")) {
      Linking.openURL(web);
    } else {
      console.error("URL no válida");
    }
  };

  const openTelefonoLink = () => {
    const formattedTel = `tel:${tel}`;
    Linking.openURL(formattedTel);
  };

  const openUbicacionLink = () => {
    Linking.openURL(ubicacion).catch((err) => {
      console.error("Error al abrir la ubicación", err);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.group2}>
        <View style={styles.group}>
          <View style={styles.group4}>
            <Text style={styles.nomRestaurant}>{titol}</Text>
            <View style={styles.descripcioRestaurantRow}>
              <Text style={styles.descripcioRestaurant}>{descripcio}</Text>
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
          style={[styles.boton, { backgroundColor: "#444", marginLeft: 5 }]}
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
    textAlign: "center",
    fontWeight: "bold",
  },
  descripcioRestaurant: {
    color: "rgba(0,0,0,1)",
    fontSize: 15,
    textAlign: "center",
    width: "110%",
  },
  group3: {
    width: 91,
    alignItems: "flex-end",
    justifyContent: "center",
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
