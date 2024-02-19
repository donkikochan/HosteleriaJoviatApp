// MapView.js
import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import markerJoviat from "./pin_joviat.png";
import { db } from "../FirebaseConfig";
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
const MapViewComponent = () => {
  const mapRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Obtener datos de Firebase al montar el componente
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Restaurant"));
      const restaurantsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRestaurants(restaurantsData);
    };

    fetchData();

    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.fitToSuppliedMarkers(
          restaurants.map((r) => r.id),
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }, 1000);
    }
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 41.72196997077061,
          longitude: 1.81823808510676,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Marcador para la ubicación inicial */}
        <Marker
          coordinate={{
            latitude: 41.72196997077061,
            longitude: 1.81823808510676,
          }}
          title="Restaurant Joviat"
          identifier="initial_marker"
        >
          <Image source={markerJoviat} style={{ width: 35, height: 50 }} />
        </Marker>

        {/* Marcadores para los restaurantes de Firebase */}
        {restaurants.map((restaurant) => (
          <Marker
            coordinate={{
              latitude: restaurant.latitud,
              longitude: restaurant.longitud,
            }}
            title={restaurant.nom}
            identifier={restaurant.id}
          >
            <Image source={markerJoviat} style={{ width: 35, height: 50 }} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    height: Dimensions.get("window").height,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewComponent;
