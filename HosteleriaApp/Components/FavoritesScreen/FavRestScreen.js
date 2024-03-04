import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import Navbar from "../Navbar/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListViewComponent from "../MainScreen/ListView";
import MapViewComponent from "../MainScreen/MapView";

function FavRestScreen() {
  const navigation = useNavigation();
  const [activeContent, setContent] = useState("Favorite");
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);

  useEffect(() => {
    setContent("Favorite");
    const getFavoriteRestaurants = async () => {
      try {
        // Obtener todos los datos almacenados en AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        const favoriteRestaurantKeys = keys.filter((key) =>
          key.startsWith("restaurant_")
        );
        if (favoriteRestaurantKeys.length > 0) {
          const favoriteRestaurantData = await AsyncStorage.multiGet(
            favoriteRestaurantKeys
          );
          const favoriteRestaurants = favoriteRestaurantData.map(
            ([key, value]) => JSON.parse(value)
          );
          //const restObjects = Object.assign({}, ...favoriteRestaurants)
          setFavoriteRestaurants(favoriteRestaurants);
        } else {
          //console.log("No hay restaurantes favoritos almacenados.");
        }
      } catch (error) {
        console.error("Error al obtener los restaurantes favoritos", error);
      }
    };
    getFavoriteRestaurants();
  }, [navigation]);

  const renderContent = () => {
    if (favoriteRestaurants.length < 1) {
      return (
        <Text style={styles.noRestaurantsText}>
          No hay restaurantes favoritos almacenados
        </Text>
      );
    } else {
      return (
        <ListViewComponent data={favoriteRestaurants} navigation={navigation} />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={true}
        text="Login"
        screen="Login"
      />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
        <FooterNavbar
          setActiveContent={activeContent}
          navigation={navigation}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 120,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
  },
  noRestaurantsText: {
    alignSelf: "center",
    justifyContent: "space-between",
    textAlign: "center",
    position: "relative",
    alignItems: "center",
    display: "flex",
    marginTop: "50%",
    verticalAlign: "middle",
    paddingVertical: "20%",
    fontSize: 20,
  },
});

export default FavRestScreen;
