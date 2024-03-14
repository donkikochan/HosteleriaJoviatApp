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

function FavRestScreen() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContent, setActiveContent] = useState("Favorite");
  const navigation = useNavigation(); // Obtener el objeto de navegación utilizando useNavigation

  useEffect(() => {
    const getFavoriteRestaurants = async () => {
      try {
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
          setFavoriteRestaurants(favoriteRestaurants);
          setFilteredRestaurants(favoriteRestaurants);
        } else {
          console.log("No hay restaurantes favoritos almacenados.");
        }
      } catch (error) {
        console.error("Error al obtener los restaurantes favoritos", error);
      }
    };
    getFavoriteRestaurants();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = favoriteRestaurants.filter((restaurant) =>
      restaurant.nom.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={true}
        text="Login"
        screen="Login"
        handleSearch={handleSearch}
      />
      <ScrollView style={styles.contentContainer}>
        <ListViewComponent data={filteredRestaurants} />
      </ScrollView>
      <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
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
  },
});

export default FavRestScreen;
