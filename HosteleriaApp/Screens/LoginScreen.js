import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Navbar from "../Components/Navbar/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../Components/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSecured, setSecured] = useState(true);
  const [loginResult, setLoginResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
  
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("Usuario logueado con exito");
        setLoginResult(true);
        // Navigate to Profile screen
        navigation.navigate("Profile");
      } else {
        console.log("User document not found");
        setLoginResult(false);
      }
    } catch (error) {
      console.error("Error en el inicio de sesion: ", error.message);
      setLoginResult(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePass = () => {
    setSecured(!isSecured);
  };

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={false}
        showLogIn={true}
        showSearch={false}
        text="Inici"
        screen="Home"
      />
      <View style={styles.rect}>
        <View style={styles.group}>
          <View style={styles.rect2}>
            <View style={styles.headerContainer}>
              <Text style={styles.iniciaLaSessio}>INICIA LA SESSIÓ</Text>
            </View>
          </View>
          {loginResult === false && (
            <Text style={styles.loginError}>
              No s'ha trobat aquest usuari. Revisa les credencials.
            </Text>
          )}
          {loginResult === true && (
            <Text style={styles.loginValid}>Estàs loguejat.</Text>
          )}
          {isLoading && (
            <ActivityIndicator size="large" color="#000" style={styles.loader} />
          )}
          <Text style={styles.correuElectronic}>CORREU ELECTRÒNIC:</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail" size={25} color="black" />
            <TextInput
              placeholder="Correu Electrónic"
              maxLength={30}
              style={styles.placeholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            ></TextInput>
          </View>
          <Text style={styles.contrasenya}>CONTRASENYA:</Text>
          <View style={styles.inputBox}>
            <TouchableOpacity onPress={handlePass}>
              <Ionicons
                name={isSecured ? "eye-off" : "eye"}
                size={25}
                color="black"
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Contrasenya"
              secureTextEntry={isSecured}
              maxLength={30}
              style={styles.contrasenya2}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            ></TextInput>
          </View>
          <TouchableOpacity>
            <Text style={styles.loremIpsum}>Heu oblidat la contrasenya?</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {isLoading ? "Carregant..." : "Enviar"}
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
    alignSelf: "center",
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  iniciaLaSessio: {
    color: "rgba(255,255,255,1)",
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
  buttonDisabled: {
    opacity: 0.7,
  },
  group: {
    justifyContent: "center",
    marginLeft: 20,
    marginBottom: 50,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
  },
  loginError: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  loginValid: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  loader: {
    marginTop: 10,
  },
});

export default LoginScreen;
