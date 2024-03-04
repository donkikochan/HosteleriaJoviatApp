import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import { signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig";

const Profile = () => {
  //funcion para manejar el cierre de sesión
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const { currentUser } = useAuth();
  console.log("Current user: ", currentUser);

  const navigation = useNavigation();
  const [activeContent, setContent] = useState("Profile");

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Navbar
          showGoBack={false}
          showLogIn={true}
          showSearch={false}
          text="Login"
          screen="Login"
        />
        <ScrollView>
          <Text>Necesitas iniciar sesión para acceder a esta página.</Text>
          <Button
            title="Iniciar sesión"
            onPress={() => navigation.navigate("Login")}
          />
        </ScrollView>
        <FooterNavbar
          setActiveContent={activeContent}
          navigation={navigation}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        text="Login"
        screen="Login"
      />
      <ScrollView>
        <Text>Aquí va la información de perfil</Text>
        <Button title="Cerrar Sesión" onPress={handleLogOut} />
      </ScrollView>
      <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 120,
  },
});
export default Profile;
