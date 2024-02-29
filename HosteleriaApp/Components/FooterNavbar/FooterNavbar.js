import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import ListViewComponent from "../MainScreen/ListView";

function FooterNavbar({setActiveContent, navigation}) {

    const [activeButton, setActiveButton] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener("state", (e) => {
            // Obtener el nombre de la pantalla actual
            const currentRouteName = e.data.state.routeNames[e.data.state.index];
            setActiveButton(currentRouteName); // Actualizar el estado del botón activo
            setActiveContent(currentRouteName)
            //console.log('Evento de cambio de estado de navegación:', e);
        });

        return unsubscribe; // Limpiar el efecto al desmontar el componente
    }, [navigation]); // Volver a ejecutar el efecto cuando cambia la navegación

    const handlePress = (buttonName) => {
        setActiveButton(buttonName);
        //console.log("After setActiveButton:", buttonName);
        setActiveContent(buttonName);
        navigation.navigate(buttonName);
        setActiveButton(buttonName);
        //console.log("After setActiveButton:", buttonName);
        setActiveContent(buttonName);
    };
    /*useEffect(() => {
        console.log(activeButton); // Esta función de devolución de llamada se ejecutará después de que activeButton se haya actualizado.
    }, [activeButton]);*/
    /*useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            console.log('Evento de cambio de estado de navegación:', e);
        });

        return unsubscribe;
    }, [navigation]);*/

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.iconText,
          activeButton === "Profile" && styles.activeButton,
        ]}
        onPress={() => handlePress("Profile")}
      >
        <Ionicons
          name={activeButton === "Profile" ? "person" : "person-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconText,
          activeButton === "Home" && styles.activeButton,
        ]}
        onPress={() => handlePress("Home")}
      >
        <Ionicons
          name={activeButton === "Home" ? "md-home-sharp" : "md-home-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconText,
          activeButton === "Favorite" && styles.activeButton,
        ]}
        onPress={() => handlePress("Favorite")}
      >
        <Ionicons
          name={activeButton === "Favorite" ? "md-heart" : "md-heart-outline"}
          size={30}
          color="white"
        />
        <Text style={styles.text}>Favorite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    color: "white",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: 50,
    paddingVertical: 15,
    position: "relative",
    bottom: 0,
  },
  iconText: {
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});

export default FooterNavbar;
