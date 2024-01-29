import React from "react";
import { StyleSheet, View } from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";
import Items from "../ChefList/ItemsChef";
import RestaurantInfoCard from "../RestaurantInfoCard/RestaurantInfoCard";

function RestaurantScreen({ route }) {
  const id = route?.params?.id;

  const itemsData = ["Item 1", "Item 2", "Item 3"];
  const restaurantInfo = {
    titol: "Nombre del Restaurante",
    descripcio: "Descripción del Restaurante",
    accio: "Ver Más",
    sourceImage: "ios-restaurant",
    screen: "DetalleRestaurante",
  };

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        text="Login"
      />
      <CarouselDef />

      <RestaurantInfoCard {...restaurantInfo} />

      {itemsData.map((name, index) => (
        <Items key={index} name={name} />
      ))}

      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RestaurantScreen;
