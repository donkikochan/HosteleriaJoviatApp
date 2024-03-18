import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, Modal, Alert } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import markerJoviat from "./pin_joviat.png";
import { useNavigation } from "@react-navigation/native";
import { db } from "../FirebaseConfig";
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
import JoviatScreen from "../JoviatScreen/JoviatScreen";

const MapViewComponent = () => {
    const mapRef = useRef(null);
    const [restaurants, setRestaurants] = useState([]);
    const navigation = useNavigation();
    const [restaurantsReady, setRestaurantsReady] = useState(false);
    const [mapLayoutReady, setMapLayoutReady] = useState(false);

    const handleMapLayout = () => {
        setMapLayoutReady(true);
    };

    useEffect(() => {
        console.log("Fetching restaurants data...");
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Restaurant"));
                const restaurantsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRestaurants(restaurantsData);
                setRestaurantsReady(true);
            } catch (error) {
                console.error("Error fetching restaurants data:", error);
            }
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        if (mapLayoutReady && mapRef.current && restaurantsReady) {
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
    }, [mapLayoutReady, restaurantsReady]);
    
    

    const handleMarkerPress = (restaurantId) => {
        console.log("Marker pressed. Restaurant ID:", restaurantId);
        navigation.navigate("Restaurant", { id: restaurantId });
    };

    const goToRestaurant = (restaurantId, restaurantNom) => {
        Alert.alert (
            'Anar a ' + restaurantNom,
            'Esteu segur que voleu anar al restaurant \"' + restaurantNom + '\" ?',
            [
                {
                    text: "Sí",
                    onPress: () => {handleMarkerPress(restaurantId)}
                },
                {
                    text: "No",
                    style: "cancel"
                }
            ],
            {
                cancelable: true
            },
        )
    };

    const goToJoviat = () => {
        Alert.alert (
            'Anar a Restaurant Joviat',
            'Esteu segur que voleu anar al restaurant "Restaurant Joviat"?',
            [
                {
                    text: "Sí",
                    onPress: () => {navigation.navigate('Joviat')}
                },
                {
                    text: "No",
                    style: "cancel"
                }
            ],
            {
                cancelable: true
            },
        )
    };

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
                    <Callout onPress={() => goToJoviat()}>
                        <View style={styles.calloutContainer}>
                            <Text style={styles.calloutText}>Restaurant Joviat</Text>
                        </View>
                    </Callout>
                </Marker>

                {/* Marcadores para los restaurantes de Firebase */}
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitud,
                            longitude: restaurant.longitud,
                        }}
                        title={restaurant.nom}
                        identifier={restaurant.id}
                    >
                        <Image source={markerJoviat} style={{ width: 35, height: 50 }} />
                        <Callout onPress={() => goToRestaurant(restaurant.id, restaurant.nom)}>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutText}>{restaurant.nom}</Text>
                            </View>
                        </Callout>
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
    calloutContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: "10%",
    },
    calloutText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: "center",
        width: "100%",
        height: "100%",
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
});

export default MapViewComponent;
