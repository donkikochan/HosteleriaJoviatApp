// ListView.js
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const ListViewComponent = ({ data, navigation }) => {
  return (
    <ScrollView>
      {data.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          onPress={() =>
            navigation.navigate("Restaurant", { id: restaurant.id })
          } // Agrega la navegación aquí
        >
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{restaurant.nom}</Text>
              <Text style={styles.description}>{restaurant.direccio}</Text>
              {/* Renderizar trabajadores aquí si es necesario */}
              <View style={styles.workersContainer}>
                {restaurant.workers.map((worker) => (
                  <View key={worker.id} style={styles.workerItem}>
                    <Image
                      style={styles.workerImage}
                      source={{ uri: worker.image }}
                    />
                    <Text style={styles.workerName}>{worker.nom}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Image style={styles.image} source={{ uri: restaurant.foto[0] }} />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%", // Ocupa toda la anchura
  },
  image: {
    width: 100,
    height: 100, // Ajusta la altura según tus necesidades
    resizeMode: "cover",
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  workersContainer: {
    marginTop: 10,
  },
  workerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  workerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  workerName: {
    fontSize: 14,
  },
});

export default ListViewComponent;
