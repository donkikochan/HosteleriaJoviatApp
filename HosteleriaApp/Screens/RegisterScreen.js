import { useState, useRef } from "react"
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform, Alert, KeyboardAvoidingView, SafeAreaView } from "react-native"
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

  // Add refs for TextInput components
  const nombreRef = useRef(null)
  const apellidosRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const instagramRef = useRef(null)
  const mobilePhoneRef = useRef(null)

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

      // Navigate back to previous screen
      setTimeout(() => {
        navigation.goBack()
      }, 1500)
    } catch (error) {
      console.error("Error al registrar:", error)
      setRegisterResult(false)
      
      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/email-already-in-use":
          Alert.alert(
            "Email ya registrado",
            "Este correo electrónico ya está registrado. Por favor, utiliza otro correo o inicia sesión si ya tienes una cuenta.",
            [
              {
                text: "Iniciar sesión",
                onPress: () => navigation.navigate("Login")
              },
              {
                text: "OK",
                style: "cancel"
              }
            ]
          )
          break
        case "auth/invalid-email":
          Alert.alert(
            "Email inválido",
            "Por favor, introduce una dirección de correo electrónico válida."
          )
          break
        case "auth/weak-password":
          Alert.alert(
            "Contraseña débil",
            "La contraseña debe tener al menos 6 caracteres."
          )
          break
        default:
          Alert.alert(
            "Error de registro",
            "Ha ocurrido un error durante el registro. Por favor, inténtalo de nuevo."
          )
      }
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
    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate)
    }
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

  const handleInstagramSubmit = () => {
    mobilePhoneRef.current.focus()
  }

  const handleMobilePhoneSubmit = () => {
    handleRegister()
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.label}>NOM:</Text>
              <View style={styles.inputBox}>
                <FontAwesome name="user" size={25} color="black" />
                <TextInput
                  placeholder="Nom"
                  maxLength={30}
                  style={styles.inputField}
                  value={nombre}
                  onChangeText={setNombre}
                  onSubmitEditing={() => apellidosRef.current.focus()}
                  ref={nombreRef}
                />
              </View>

              {/* Apellidos */}
              <Text style={styles.label}>COGNOMS:</Text>
              <View style={styles.inputBox}>
                <FontAwesome name="user" size={25} color="black" />
                <TextInput
                  placeholder="Cognoms"
                  maxLength={50}
                  style={styles.inputField}
                  value={apellidos}
                  onChangeText={setApellidos}
                  onSubmitEditing={() => emailRef.current.focus()}
                  ref={apellidosRef}
                />
              </View>

              {/* Email */}
              <Text style={styles.label}>CORREU ELECTRÒNIC:</Text>
              <View style={styles.inputBox}>
                <Ionicons name="mail" size={25} color="black" />
                <TextInput
                  placeholder="Correu electrònic"
                  style={styles.inputField}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  ref={emailRef}
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>CONTRASENYA:</Text>
              <View style={styles.inputBox}>
                <FontAwesome name="lock" size={25} color="black" />
                <TextInput
                  placeholder="Contrasenya"
                  secureTextEntry={isSecured}
                  style={styles.inputField}
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={() => instagramRef.current.focus()}
                  ref={passwordRef}
                />
                <TouchableOpacity onPress={handlePass} style={styles.passwordToggle}>
                  <FontAwesome name={isSecured ? "eye" : "eye-slash"} size={20} color="black" />
                </TouchableOpacity>
              </View>

              {/* Instagram */}
              <Text style={styles.label}>INSTAGRAM:</Text>
              <View style={styles.inputBox}>
                <FontAwesome name="instagram" size={25} color="black" />
                <TextInput
                  placeholder="Instagram"
                  style={styles.inputField}
                  value={instagram}
                  onChangeText={setInstagram}
                  onSubmitEditing={() => mobilePhoneRef.current.focus()}
                  ref={instagramRef}
                />
              </View>

              {/* Teléfono móvil */}
              <Text style={styles.label}>TELÈFON MÒBIL:</Text>
              <View style={styles.inputBox}>
                <FontAwesome name="phone" size={25} color="black" />
                <TextInput
                  placeholder="Telèfon mòbil"
                  style={styles.inputField}
                  keyboardType="phone-pad"
                  value={mobilePhone}
                  onChangeText={setMobilePhone}
                  onSubmitEditing={handleRegister} 
                  ref={mobilePhoneRef}
                />
              </View>

              {/* Date of Birth Section */}
              <Text style={styles.label}>DATA DE NAIXEMENT:</Text>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <FontAwesome name="calendar" size={20} color="#333" style={styles.dateIcon} />
                <Text style={styles.dateButtonText}>{formatDate(dateOfBirth)}</Text>
              </TouchableOpacity>

              {/* Date Picker - Only show when needed */}
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  style={styles.datePicker}
                  maximumDate={new Date()}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleRegister} 
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  rect: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  group: {
    width: "100%",
  },
  rect2: {
    marginTop: Platform.OS === 'ios' ? 0 : 0,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iniciaLaSessio: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  imageButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  imageButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 50,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingLeft: 10,
  },
  passwordToggle: {
    marginLeft: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginError: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  loginValid: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
})

export default RegisterScreen