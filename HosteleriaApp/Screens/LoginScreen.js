import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import RestaurantInfoCard from "../Components/RestaurantInfoCard/RestaurantInfoCard";
import Navbar from "../Components/Navbar/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../Components/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado con exito");
      //Navegar al homescreen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error en el inicio de sesion: ", error.message);
    }
  };

  return (
      <View style={styles.container}>
        <Navbar
            showGoBack={false}
            showLogIn={true}
            showSearch={false}
            text="Home"
            screen="Home"
        />
        <View style={styles.rect}>
          <View style={styles.group}>
            <View style={styles.rect2}>
              <Text style={styles.iniciaLaSessio}>INICIA LA SESSIÓ</Text>
            </View>
            <Text style={styles.correuElectronic}>CORREU ELECTRÒNIC:</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail" size={25} color="black" />
              <TextInput
                  placeholder="Correu Electrónic"
                  maxLength={30}
                  style={styles.placeholder}
                  value={email}
                  onChangeText={setEmail}
              ></TextInput>
            </View>
            <Text style={styles.contrasenya}>CONTRASENYA:</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-open" size={25} color="black" />
              <TextInput
                  placeholder="Contrasenya"
                  secureTextEntry={true}
                  maxLength={30}
                  style={styles.contrasenya2}
                  value={password}
                  onChangeText={setPassword}
              ></TextInput>
            </View>
            <Text style={styles.loremIpsum}>Heu oblidat la contrasenya?</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                Enviar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rect: {
    width: "90%",
    height: 300,
    borderColor: "#000000",
    backgroundColor: "#E6E6E6",
    borderRadius: 9,
    marginTop: 180,
    justifyContent: "center",
    alignSelf: "center"
  },
  correuElectronic: {
    color: "#121212",
    marginTop: 32,
    marginLeft: 25,
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 18,
  },
  placeholder: {
    color: "#121212",
    height: 25,
    width: 268,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000000",
    marginLeft: 8,
    borderRadius: 5,
  },
  contrasenya: {
    color: "#121212",
    marginTop: 35,
    marginLeft: 25,
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 18,
  },
  contrasenya2: {
    color: "#121212",
    height: 25,
    width: 268,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 0.5,
    borderColor: "#000000",
    marginLeft: 8,
    borderRadius: 5,
  },
  loremIpsum: {
    color: "rgba(60,106,148,1)",
    fontSize: 12.5,
    textDecorationLine: "underline",
    marginTop: 10,
    marginLeft: 25,
  },
  rect2: {
    width: "90%",
    height: 38,
    backgroundColor: "rgba(0,0,0,1)",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  iniciaLaSessio: {
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#444",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 100,
  },
  group: {
    justifyContent: "center",
    marginLeft: 20,
    marginBottom: 50,
  },
  inputBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
