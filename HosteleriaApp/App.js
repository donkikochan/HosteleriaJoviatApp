import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Navbar from "./Components/Navbar/Navbar";
import FooterNavbar from "./Components/FooterNavbar/FooterNavbar";
import CarouselDef from "./Components/Carousel/Carousel";

export default function App() {
  const handlePress = () => {
    console.log("Boton clicado");
    setIsActive(true);
    setInfo("Adios");
  };

  const [isActive, setIsActive] = useState(false);
  const [info, setInfo] = useState("Hola mundo");
  return (
    <View style={styles.container}>
      <Navbar />
      <CarouselDef />
      <Text>{info}</Text>
      <Button title="Click" onPress={handlePress} />
      <StatusBar style="auto" />
      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
