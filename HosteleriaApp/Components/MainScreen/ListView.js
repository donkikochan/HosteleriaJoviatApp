import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const ListViewComponent = ({ data, navigation }) => {
  const renderAdditionalWorkers = (workers) => {
    return (
      <View style={styles.additionalWorkersContainer}>
        {workers.slice(2, 5).map((worker, index) => ( // Limita a mostrar solo las siguientes 3 imágenes de trabajadores adicionales
          <Image key={index} style={[styles.additionalWorkerImage, { marginLeft: index > 0 ? -15 : 0 }]} source={{ uri: worker.image }} />
        ))}
        {workers.length > 4 && ( // Muestra el texto solo si hay más de 3 trabajadores adicionales
          <Text style={styles.additionalWorkersText}>+{workers.length - 2} treballadors</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      {data.map((restaurant) => (
        <TouchableOpacity key={restaurant.id} onPress={() => navigation.navigate("Restaurant", { id: restaurant.id })}>
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{restaurant.nom}</Text>
              <Text style={styles.description}>{restaurant.direccio}</Text>
              <View style={styles.workersContainer}>
                {restaurant.workers.slice(0, 2).map((worker) => (
                  <View key={worker.id} style={styles.workerItem}>
                    <Image style={styles.workerImage} source={{ uri: worker.image }} />
                    <Text style={styles.workerName}>{worker.nom}</Text>
                  </View>
                ))}
                {restaurant.workers.length > 2 && renderAdditionalWorkers(restaurant.workers)}
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%", // Ocupa toda la anchura
    minHeight: 200,
    maxHeight: "auto",
  },
  image: {
    width: 115,
    height: 115, // Ajusta la altura según tus necesidades
    resizeMode: "cover",
    marginLeft: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
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
    borderWidth: 1,
    borderColor: "black",
  },
  workerName: {
    fontSize: 14,
  },
  additionalWorkersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  additionalWorkerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 2,
    borderWidth: 1,
    borderColor: "black",
  },
  additionalWorkersText: {
    fontSize: 13,
    color: "#FF5722", // Color naranja
    fontWeight: "bold", // Texto en negrita
  },
});

export default ListViewComponent;
