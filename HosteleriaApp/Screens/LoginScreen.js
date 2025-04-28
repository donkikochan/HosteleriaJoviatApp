"use client"

import { useState } from "react"
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native"
import Navbar from "../Components/Navbar/Navbar"
import ProfileBackArrow from "../Components/Navbar/ProfileBackArrow"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { auth, db } from "../Components/FirebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSecured, setSecured] = useState(true)
  const [loginResult, setLoginResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim())
      const user = userCredential.user
  
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        console.log("Usuario logueado con exito")
        setLoginResult(true)
        // Navigate to Profile screen
        navigation.navigate("Profile")
      } else {
        console.log("User document not found")
        setLoginResult(false)
      }
    } catch (error) {
      console.error("Error en el inicio de sesion: ", error.message)
      setLoginResult(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePass = () => {
    setSecured(!isSecured)
  }

  const handleBackNavigation = () => {
    navigation.navigate("Profile")
  }

  return (
    <View style={styles.container}>
      {/* Back arrow to navigate to Profile */}
      <TouchableOpacity 
        style={styles.backArrow} 
        onPress={handleBackNavigation}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      
      <ProfileBackArrow navigation={navigation} />
      <Navbar
        showGoBack={false}
        showLogIn={false}
        showSearch={false}
        text="Inici"
        screen="Home"
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

            <Text style={styles.label}>CORREU ELECTRÒNIC:</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail" size={25} color="black" />
              <TextInput
                placeholder="Correu Electrónic"
                maxLength={30}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>CONTRASENYA:</Text>
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
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Heu oblidat la contrasenya?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <FontAwesome5 name="spinner" size={20} color="white" style={styles.spinner} />
                  <Text style={styles.buttonText}>Procesando...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    position: "relative"
  },
  backArrow: {
    position: 'absolute',
    top: 110,
    left: 15,
    zIndex: 10,
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: "center",
    marginTop: 20
  },
  rect: {
    width: "90%",
    backgroundColor: "#E6E6E6",
    borderRadius: 9,
    marginTop: 120,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  group: {
    width: "100%",
  },
  rect2: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(0,0,0,1)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  iniciaLaSessio: {
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    fontWeight: "bold",
  },
  label: {
    color: "#121212",
    marginTop: 15,
    marginLeft: 25,
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 16,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginRight: 25,
  },
  input: {
    color: "#121212",
    height: 40,
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000000",
    marginLeft: 8,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loginError: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  loginValid: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#444",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 50,
  },
  buttonDisabled: {
    backgroundColor: "#888",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  forgotPassword: {
    color: "#0A16D6",
    textAlign: "center",
    marginTop: 15,
    textDecooration: "underline",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 10,
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
})

export default LoginScreen