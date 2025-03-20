"use client"

import { useState } from "react"
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, Alert } from "react-native"
import Navbar from "../Components/Navbar/Navbar"
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import { auth, db } from "../Components/FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, collection, addDoc } from "firebase/firestore"
import * as ImagePicker from "expo-image-picker"
import * as Device from "expo-device"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import DateTimePicker from "@react-native-community/datetimepicker"

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSecured, setSecured] = useState(true)
  const [registerResult, setRegisterResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // New state variables for additional fields
  const [nombre, setNombre] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [instagram, setInstagram] = useState("")
  const [mobilePhone, setMobilePhone] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleRegister = async () => {
    // Validate required fields
    if (!email || !password || !nombre || !apellidos) {
      Alert.alert("Error", "Por favor, rellena todos los campos obligatorios")
      return
    }

    setIsLoading(true)

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim())
      const user = userCredential.user

      // Format date of birth
      const formattedDate = formatDate(dateOfBirth)

      // Prepare user data for Firestore
      const userData = {
        username: nombre,
        apellidos: apellidos,
        email: email.trim(),
        instagram: instagram,
        academicStatus: "Alumne", // Set default value
        mobilePhone: mobilePhone,
        birth: formattedDate,
        createdAt: new Date(),
        userId: user.uid,
        verified: false, // Add verification status
      }

      // If profile image exists, upload it
      if (profileImage) {
        const imageUrl = await uploadProfileImage(profileImage, user.uid)
        userData.imageUrl = imageUrl
      }

      // Save user data to AltaUsers collection (waiting for verification)
      await addDoc(collection(db, "AltaUsers"), userData)

      // Also save minimal user data to users collection (regular user data)
      await setDoc(doc(db, "users", user.uid), {
        username: nombre,
        email: email.trim(),
        createdAt: new Date(),
      })

      console.log("Usuario registrado con éxito en AltaUsers")
      setRegisterResult(true)

      // Navigate to Profile screen instead of Home
      setTimeout(() => {
        navigation.navigate("Profile")
      }, 1500)
    } catch (error) {
      console.error("Error al registrar:", error)
      setRegisterResult(false)
      Alert.alert("Error", "No se pudo completar el registro. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePass = () => {
    setSecured(!isSecured)
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth
    setShowDatePicker(Platform.OS === "ios")
    setDateOfBirth(currentDate)
  }

  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a tu galería")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error)
      Alert.alert("Error", "No se pudo seleccionar la imagen")
    }
  }

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a tu cámara")
        return
      }

      // Check if running on a simulator/emulator
      if (Platform.OS === "ios" && !Device.isDevice) {
        Alert.alert("Error", "La cámara no está disponible en el simulador de iOS. Por favor, usa un dispositivo real.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error al tomar foto:", error)
      Alert.alert("Error", "No se pudo tomar la foto")
    }
  }

  const uploadProfileImage = async (uri, userId) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const fileName = `${userId}_${new Date().toISOString()}.jpg`
      const storage = getStorage()
      const storageRef = ref(storage, `images/${userId}/${fileName}`)

      const snapshot = await uploadBytes(storageRef, blob)
      const downloadURL = await getDownloadURL(snapshot.ref)

      console.log("Imagen de perfil disponible en:", downloadURL)
      return downloadURL
    } catch (error) {
      console.error("Error al subir la imagen de perfil:", error)
      throw error
    }
  }

  return (
    <View style={styles.container}>
      <Navbar showGoBack={true} showLogIn={false} showSearch={false} text="Inici" screen="Home" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.rect}>
          <View style={styles.group}>
            <View style={styles.rect2}>
              <View style={styles.headerContainer}>
                <Text style={styles.iniciaLaSessio}>REGISTRAR</Text>
              </View>
            </View>

            {registerResult === false && <Text style={styles.loginError}>Error al registrar. Revisa les dades.</Text>}
            {registerResult === true && <Text style={styles.loginValid}>Registre completat.</Text>}

            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <FontAwesome5 name="user-alt" size={40} color="#888" />
                </View>
              )}
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <FontAwesome name="camera" size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <FontAwesome name="image" size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nombre */}
            <Text style={styles.label}>NOMBRE:</Text>
            <View style={styles.inputBox}>
              <FontAwesome name="user" size={25} color="black" />
              <TextInput
                placeholder="Nombre"
                maxLength={30}
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            {/* Apellidos */}
            <Text style={styles.label}>APELLIDOS:</Text>
            <View style={styles.inputBox}>
              <FontAwesome name="user" size={25} color="black" />
              <TextInput
                placeholder="Apellidos"
                maxLength={50}
                style={styles.input}
                value={apellidos}
                onChangeText={setApellidos}
              />
            </View>

            {/* Email */}
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

            {/* Password */}
            <Text style={styles.label}>CONTRASENYA:</Text>
            <View style={styles.inputBox}>
              <TouchableOpacity onPress={handlePass}>
                <Ionicons name={isSecured ? "eye-off" : "eye"} size={25} color="black" />
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

            {/* Instagram */}
            <Text style={styles.label}>INSTAGRAM:</Text>
            <View style={styles.inputBox}>
              <FontAwesome name="instagram" size={25} color="#C13584" />
              <TextInput
                placeholder="@usuario (opcional)"
                maxLength={30}
                style={styles.input}
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
              />
            </View>

            {/* Mobile Phone */}
            <Text style={styles.label}>TELÉFONO MÓVIL:</Text>
            <View style={styles.inputBox}>
              <FontAwesome name="phone" size={25} color="black" />
              <TextInput
                placeholder="Número de teléfono"
                maxLength={15}
                style={styles.input}
                value={mobilePhone}
                onChangeText={setMobilePhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Date of Birth */}
            <Text style={styles.label}>FECHA DE NACIMIENTO:</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <FontAwesome name="calendar" size={20} color="#fff" />
                <Text style={styles.dateButtonText}>{formatDate(dateOfBirth)}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                />
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <FontAwesome5 name="spinner" size={20} color="white" style={styles.spinner} />
                  <Text style={styles.buttonText}>Procesando...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Registrar</Text>
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
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    alignItems: "center",
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
  profileImageSection: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#444",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#444",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  imageButton: {
    backgroundColor: "#0A16D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  dateContainer: {
    marginHorizontal: 25,
    marginTop: 5,
  },
  dateButton: {
    backgroundColor: "#0A16D6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 16,
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

export default RegisterScreen

