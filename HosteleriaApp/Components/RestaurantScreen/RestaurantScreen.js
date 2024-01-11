import { StyleSheet, View } from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";

function RestaurantScreen() {
  return (
    <View>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        text="Login"
      />
      <CarouselDef />
      <FooterNavbar />
    </View>
  );
}

export default RestaurantScreen();
