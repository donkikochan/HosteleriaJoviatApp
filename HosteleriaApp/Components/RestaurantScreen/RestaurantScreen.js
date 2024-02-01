import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";
import Items from "../ChefList/ItemsChef";
import RestaurantInfoCard from "../RestaurantInfoCard/RestaurantInfoCard";

function RestaurantScreen({ route }) {
  const id = route?.params?.id;

  const itemsData = ["Chef-Nahuel Bigon", "Somellier-Vicotria Gomez", "Cocinero-Pedro Juarez"];
  const restaurantInfo = {
    titol: "         Restaurant Escola Joviat",
    descripcio: "Ven a descubrir una nueva experiencia gastronómica. Un concepto fresco, un servicio informal y actual.",
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
      <ScrollView>
      <RestaurantInfoCard {...restaurantInfo} />

      {itemsData.map((name, index) => (
        <Items key={index} name={name} />
      ))}
      </ScrollView>

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
