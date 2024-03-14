import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation desde React Navigation
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListViewComponent from "../MainScreen/ListView";

function FavRestScreen() {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContent, setActiveContent] = useState("");
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
        showGoBack={false}
        showLogIn={true}
        showSearch={true}
        text="Login"
        screen="Login"
        handleSearch={handleSearch}
      />
      <ScrollView style={styles.contentContainer}>
        <ListViewComponent data={filteredRestaurants} />
      </ScrollView>
      <FooterNavbar setActiveContent={setActiveContent} navigation={navigation} />
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
