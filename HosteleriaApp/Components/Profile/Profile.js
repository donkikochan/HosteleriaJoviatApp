"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
  Linking,
  Alert,
} from "react-native"
import { useAuth } from "../../AuthContext"
import { useNavigation } from "@react-navigation/native"
import Navbar from "../Navbar/Navbar"
import FooterNavbar from "../FooterNavbar/FooterNavbar"
import { signOut } from "firebase/auth"
import { auth, db } from "../FirebaseConfig"
import { doc, getDoc, collection, getDocs, updateDoc, query, where } from "firebase/firestore"
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as Device from "expo-device"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Calendar } from "react-native-calendars"

const Profile = () => {
  const handleLogOut = async () => {
    try {
      await signOut(auth)
      console.log("Sesión cerrada")
    } catch (error) {
      console.error("Error al cerrar sesión", error)
    }
  }

  const { currentUser } = useAuth()
  const navigation = useNavigation()
  const [activeContent, setContent] = useState("Profile")
  const [userData, setUserData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [image, setImage] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurants, setSelectedRestaurants] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const totalPages = Math.ceil(selectedRestaurants.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const currentItems = selectedRestaurants.slice(startIndex, startIndex + itemsPerPage)
  const [showRestaurantPicker, setShowRestaurantPicker] = useState(false)
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)
  const [showResponsibilityModal, setShowResponsibilityModal] = useState(false)
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null)
  const [responsibility, setResponsibility] = useState("")
  const [responsibilityType, setResponsibilityType] = useState("")
  const [showImagePickerModal, setShowImagePickerModal] = useState(false)
  const [restaurantImages, setRestaurantImages] = useState({})
  const [showProfileImagePickerModal, setShowProfileImagePickerModal] = useState(false)
  const [restaurantPickerPage, setRestaurantPickerPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isVerified, setIsVerified] = useState(null)
  const [isCheckingVerification, setIsCheckingVerification] = useState(true)

  // Función para cargar los restaurantes desde Firebase
  const fetchRestaurants = async () => {
    setIsLoadingRestaurants(true)
    try {
      const restaurantsCollection = collection(db, "Restaurant")
      const restaurantsSnapshot = await getDocs(restaurantsCollection)

      // Log the raw data to see what we're getting
      console.log(
        "Raw restaurant data:",
        restaurantsSnapshot.docs.map((doc) => doc.data()),
      )

      const restaurantsList = restaurantsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().nom || "Restaurant sin nombre", // Make sure we're using the "nom" field
        address: doc.data().address || "",
        imageUrl: doc.data().imageUrl || null,
      }))

      console.log("Restaurantes procesados:", restaurantsList)
      setRestaurants(restaurantsList)
    } catch (error) {
      console.error("Error al cargar los restaurantes:", error)
      Alert.alert("Error", "No se pudieron cargar los restaurantes")
    } finally {
      setIsLoadingRestaurants(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const handleAddRestaurant = (restaurant) => {
    if (!selectedRestaurants.some((r) => r.id === restaurant.id)) {
      setSelectedRestaurants([...selectedRestaurants, restaurant])
    }
  }

  const handleRemoveRestaurant = (restaurantToRemove) => {
    setSelectedRestaurants(selectedRestaurants.filter((restaurant) => restaurant.id !== restaurantToRemove.id))

    // Also remove the restaurant image if it exists
    if (restaurantImages[restaurantToRemove.id]) {
      const updatedImages = { ...restaurantImages }
      delete updatedImages[restaurantToRemove.id]
      setRestaurantImages(updatedImages)
    }
  }

  // Add this function to handle opening the responsibility modal
  const handleOpenResponsibilityModal = (restaurantId, currentResponsibility) => {
    setCurrentRestaurantId(restaurantId)

    // Check if the current responsibility matches any predefined type
    const predefinedTypes = ["Cuiner", "Cambrer", "Gerent", "Nateja"]
    if (predefinedTypes.includes(currentResponsibility)) {
      setResponsibilityType(currentResponsibility)
      setResponsibility("")
    } else if (currentResponsibility) {
      setResponsibilityType("Altres")
      setResponsibility(currentResponsibility)
    } else {
      setResponsibilityType("")
      setResponsibility("")
    }

    setShowResponsibilityModal(true)
  }

  // Add this function to save the responsibility
  const saveResponsibility = async () => {
    if (currentRestaurantId) {
      const finalResponsibility = responsibilityType === "Altres" ? responsibility : responsibilityType

      try {
        const updatedRestaurants = selectedRestaurants.map((restaurant) => {
          if (restaurant.id === currentRestaurantId) {
            return { ...restaurant, responsibility: finalResponsibility }
          }
          return restaurant
        })

        setSelectedRestaurants(updatedRestaurants)

        // Update the user's data in Firestore
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid)
          await updateDoc(userRef, { restaurants: updatedRestaurants })
        }

        setShowResponsibilityModal(false)
        setResponsibility("")
        setResponsibilityType("")
      } catch (error) {
        console.error("Error updating responsibility:", error)
        Alert.alert("Error", "No se pudo actualizar la responsabilidad. Por favor, inténtelo de nuevo.")
      }
    }
  }

  // Function to open image picker modal for a specific restaurant
  const openImagePickerForRestaurant = (restaurantId) => {
    setCurrentRestaurantId(restaurantId)
    setShowImagePickerModal(true)
  }

  // Function to open profile image picker modal
  const openProfileImagePicker = () => {
    setShowProfileImagePickerModal(true)
  }

  // Modify the takePhoto function to better handle errors and permissions
  const takePhoto = async (isProfilePhoto = false) => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission needed", "Sorry, we need camera permissions to make this work!")
        return
      }

      // Check if running on a simulator/emulator
      if (Platform.OS === "ios" && !Device.isDevice) {
        Alert.alert("Error", "Camera is not available on iOS simulator. Please use a real device.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      }).catch((error) => {
        console.error("Error launching camera:", error)
        Alert.alert(
          "Camera Error",
          "There was a problem opening the camera. Please try again or use the gallery option.",
        )
        return { canceled: true }
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        if (isProfilePhoto) {
          setImage(result.assets[0].uri)
          uploadImage(result.assets[0].uri)
          setShowProfileImagePickerModal(false)
        } else {
          handleImageSelected(result.assets[0].uri)
          setShowImagePickerModal(false)
        }
      }
    } catch (error) {
      console.error("Error in takePhoto function:", error)
      Alert.alert("Error", "There was a problem with the camera. Please try using the gallery option instead.")
    }
  }

  // Function to pick image from gallery
  const pickImageFromGallery = async (isProfilePhoto = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (isProfilePhoto) {
        setImage(result.assets[0].uri)
        uploadImage(result.assets[0].uri)
        setShowProfileImagePickerModal(false)
      } else {
        handleImageSelected(result.assets[0].uri)
        setShowImagePickerModal(false)
      }
    }
  }

  // Function to handle the selected image for restaurant
  const handleImageSelected = async (uri) => {
    if (currentRestaurantId) {
      // Update the restaurant images state
      setRestaurantImages({
        ...restaurantImages,
        [currentRestaurantId]: uri,
      })

      // Upload the image to Firebase Storage
      uploadRestaurantImage(uri, currentRestaurantId)
    }
  }

  // Function to upload restaurant image to Firebase Storage
  const uploadRestaurantImage = async (uri, restaurantId) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const fileName = `restaurant_${restaurantId}_${new Date().toISOString()}.jpg`
      const storage = getStorage()
      const storageRef = ref(storage, `images/restaurants/${fileName}`)

      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log("Restaurant image available at", downloadURL)

            // Update the restaurant images state with the download URL
            setRestaurantImages({
              ...restaurantImages,
              [restaurantId]: downloadURL,
            })

            // Update the restaurants array with the image URL
            const updatedRestaurants = selectedRestaurants.map((restaurant) => {
              if (restaurant.id === restaurantId) {
                return { ...restaurant, imageUrl: downloadURL }
              }
              return restaurant
            })

            setSelectedRestaurants(updatedRestaurants)
          })
        })
        .catch((error) => {
          console.error("Error uploading restaurant image: ", error)
        })
    } catch (error) {
      console.error("Error preparing restaurant image upload: ", error)
    }
  }

  const handleSave = async () => {
    if (currentUser && userData) {
      const userRef = doc(db, "users", currentUser.uid)
      try {
        const updatedUserData = {
          ...userData,
          imageUrl: image,
          restaurants: selectedRestaurants,
        }

        if (image) {
          updatedUserData.imageUrl = image
        }

        await updateDoc(userRef, updatedUserData)
        setUserData(updatedUserData)
        console.log("Perfil actualizado con éxito")
        setEditMode(false)
      } catch (error) {
        console.error("Error al actualizar el perfil: ", error)
      }
    }
  }

  // Function to upload profile image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const fileName = `${currentUser.uid}_${new Date().toISOString()}.jpg`
      const storage = getStorage()
      const storageRef = ref(storage, `images/${currentUser.uid}/${fileName}`)

      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log("Profile image available at", downloadURL)
            setImage(downloadURL)
            updateProfileImage(downloadURL)
          })
        })
        .catch((error) => {
          console.error("Error uploading profile image: ", error)
        })
    } catch (error) {
      console.error("Error preparing profile image upload: ", error)
    }
  }

  const updateProfileImage = async (url) => {
    if (currentUser && url) {
      const userRef = doc(db, "users", currentUser.uid)
      try {
        await updateDoc(userRef, { imageUrl: url })
        console.log("Perfil actualizado con éxito con la nueva URL de imagen")
      } catch (error) {
        console.error("Error al actualizar el perfil con la nueva imagen: ", error)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Function to open social media links
  const openLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Error opening URL:", err))
    }
  }

  useEffect(() => {
    if (currentUser) {
      const checkVerificationStatus = async () => {
        setIsCheckingVerification(true)
        try {
          // First check if user exists in regular users collection
          const userRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserData(userData)

            // Check if user is in AltaUsers collection
            const altaUsersQuery = collection(db, "AltaUsers")
            const q = query(altaUsersQuery, where("userId", "==", currentUser.uid))
            const altaUsersSnapshot = await getDocs(q)

            // If user is in AltaUsers collection, they need verification
            if (!altaUsersSnapshot.empty) {
              setIsVerified(false)
            } else {
              // User is not in AltaUsers, so they don't need verification
              setIsVerified(true)
            }

            if (userData.imageUrl) {
              setImage(userData.imageUrl)
            }
            if (userData.restaurants) {
              setSelectedRestaurants(userData.restaurants)

              // Initialize restaurant images from the data
              const images = {}
              userData.restaurants.forEach((restaurant) => {
                if (restaurant.imageUrl) {
                  images[restaurant.id] = restaurant.imageUrl
                }
              })
              setRestaurantImages(images)
            }
            if (userData.birth) {
              const [day, month, year] = userData.birth.split("/")
              setDate(new Date(year, month - 1, day))
            }
          } else {
            console.log("No se encontró el documento del usuario.")
            setIsVerified(false)
          }
        } catch (error) {
          console.error("Error al obtener el documento del usuario:", error)
          setIsVerified(false)
        } finally {
          setIsCheckingVerification(false)
        }
      }

      checkVerificationStatus()
    } else {
      setIsCheckingVerification(false)
    }
  }, [currentUser])

  // Implement the RestaurantPicker component with pagination and search
  const RestaurantPicker = () => {
    const [filteredRestaurants, setFilteredRestaurants] = useState([])
    const restaurantsPerPage = 5

    useEffect(() => {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRestaurants(filtered)
      setRestaurantPickerPage(0)
    }, [searchQuery, restaurants])

    const totalRestaurantPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage)
    const startRestaurantIndex = restaurantPickerPage * restaurantsPerPage
    const displayedRestaurants = filteredRestaurants.slice(
      startRestaurantIndex,
      startRestaurantIndex + restaurantsPerPage,
    )

    const handleCloseModal = () => {
      setRestaurantPickerPage(0)
      setSearchQuery("")
      setShowRestaurantPicker(false)
    }

    return (
      <Modal visible={showRestaurantPicker} transparent={true} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Llistat de Restaurant</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <FontAwesome5 name="times" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar restaurante..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
                autoCorrect={false}
              />
              {searchQuery !== "" && (
                <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery("")}>
                  <FontAwesome5 name="times-circle" size={16} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            {isLoadingRestaurants ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A16D6" />
                <Text style={styles.loadingText}>Cargando restaurantes...</Text>
              </View>
            ) : filteredRestaurants.length === 0 ? (
              <View style={styles.noRestaurantsContainer}>
                {searchQuery ? (
                  <Text style={styles.noRestaurantsText}>No se encontraron restaurantes con "{searchQuery}"</Text>
                ) : (
                  <Text style={styles.noRestaurantsText}>No hay restaurantes disponibles</Text>
                )}
              </View>
            ) : (
              <>
                <View style={styles.restaurantListContainer}>
                  {displayedRestaurants.map((restaurant) => (
                    <TouchableOpacity
                      key={restaurant.id}
                      style={styles.restaurantItem}
                      onPress={() => {
                        handleAddRestaurant(restaurant)
                        handleCloseModal()
                      }}
                    >
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.paginationControls}>
                  <TouchableOpacity
                    style={[styles.paginationButton, restaurantPickerPage === 0 && styles.paginationButtonDisabled]}
                    onPress={() => setRestaurantPickerPage(Math.max(0, restaurantPickerPage - 1))}
                    disabled={restaurantPickerPage === 0}
                  >
                    <Text style={styles.paginationButtonText}>Anterior</Text>
                  </TouchableOpacity>

                  <Text style={styles.paginationInfo}>
                    Página {restaurantPickerPage + 1} de {totalRestaurantPages || 1}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      restaurantPickerPage >= totalRestaurantPages - 1 && styles.paginationButtonDisabled,
                    ]}
                    onPress={() =>
                      setRestaurantPickerPage(Math.min(totalRestaurantPages - 1, restaurantPickerPage + 1))
                    }
                    disabled={restaurantPickerPage >= totalRestaurantPages - 1}
                  >
                    <Text style={styles.paginationButtonText}>Siguiente</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    )
  }

  const confirmDeleteRestaurant = (restaurant) => {
    Alert.alert("Eliminar restaurante", `¿Estás seguro de que quieres eliminar ${restaurant.name}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: () => handleRemoveRestaurant(restaurant),
        style: "destructive",
      },
    ])
  }

  // Render verification waiting screen
  const renderVerificationWaiting = () => {
    return (
      <View style={styles.container}>
        <Navbar showGoBack={false} showLogIn={false} showSearch={false} text="Perfil" screen="Profile" />
        <View style={styles.verificationContainer}>
          <View style={styles.verificationContent}>
            <ActivityIndicator size="large" color="#0A16D6" style={styles.verificationSpinner} />
            <Text style={styles.verificationTitle}>Esperando verificación</Text>
            <Text style={styles.verificationText}>
              Tu cuenta está pendiente de verificación por parte del administrador.
            </Text>
            <Text style={styles.verificationText}>Recibirás acceso completo una vez que tu cuenta sea verificada.</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
      </View>
    )
  }

  if (isCheckingVerification) {
    return (
      <View style={styles.container}>
        <Navbar showGoBack={false} showLogIn={false} showSearch={false} text="Perfil" screen="Profile" />
        <View style={styles.loadingVerificationContainer}>
          <ActivityIndicator size="large" color="#0A16D6" />
          <Text style={styles.loadingVerificationText}>Cargando perfil...</Text>
        </View>
        <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
      </View>
    )
  }

  if (currentUser && isVerified === false) {
    return renderVerificationWaiting()
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Navbar showGoBack={false} showLogIn={true} showSearch={false} text="Entrar" screen="Login" />
        <ScrollView>
          <View style={[styles.userInfo, { paddingBottom: 50 }]}>
            <Text style={styles.titleEdition}>Necessites iniciar sessió per accedir a aquesta pàgina.</Text>
            <Image source={require("../../assets/logo.png")} style={styles.profileImage} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.botonText}>Inicia sessió</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("RegisterScreen")}>
              <Text style={styles.botonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Navbar showGoBack={true} showLogIn={false} showSearch={false} text="Login" screen="Login" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={editMode ? styles.titleEdition : styles.title}>Benvingut al vostre perfil d'usuari</Text>

        {/* Profile image section - Moved up directly below the title */}
        <View style={styles.profileImageSection}>
          {image ? (
            <TouchableOpacity onPress={openProfileImagePicker}>
              <Image source={{ uri: image }} style={styles.profileImage} />
              {editMode && (
                <View style={styles.editProfileImageOverlay}>
                  <FontAwesome5 name="camera" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addProfilePhotoButton}
              onPress={openProfileImagePicker}
              disabled={!editMode}
            >
              <FontAwesome5 name="user-circle" size={80} color="#0A16D6" />
              {editMode && (
                <View style={styles.addProfilePhotoText}>
                  <Text style={styles.addPhotoText}>Añadir foto</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Username */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nom d'usuari:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData ? userData.username : ""}
              onChangeText={(text) => setUserData({ ...userData, username: text })}
            />
          ) : (
            <Text style={styles.value}>{userData ? userData.username : ""}</Text>
          )}
        </View>

        {/* Birth date */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Data de naixement:</Text>
          {editMode ? (
            <View style={styles.dateInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={userData?.birth || ""}
                editable={false}
                placeholder=""
              />
              <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.calendarIcon}>
                <FontAwesome5 name="calendar-alt" size={24} color="#0A16D6" />
              </TouchableOpacity>
              {showCalendar && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={(day) => {
                      const formattedDate = formatDate(day.dateString)
                      setUserData({ ...userData, birth: formattedDate })
                      setSelectedDate(day.dateString)
                      setShowCalendar(false)
                    }}
                    markedDates={{
                      [selectedDate]: { selected: true, selectedColor: "#0A16D6" },
                    }}
                    style={styles.calendar}
                    theme={{
                      selectedDayBackgroundColor: "#0A16D6",
                      todayTextColor: "#0A16D6",
                      arrowColor: "#0A16D6",
                    }}
                  />
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.value}>{userData ? userData.birth : ""}</Text>
          )}
        </View>

        {/* Academic status section */}
        <View style={styles.academicSection}>
          <View style={styles.infoContainer}>
            <Text style={editMode ? styles.labelEstat : styles.label}>Estat acadèmic:</Text>
            <Text style={styles.value}>{userData ? userData.academicStatus : "Alumne"}</Text>
          </View>
        </View>

        {/* Instagram field */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            <FontAwesome name="instagram" size={20} color="#C13584" /> Instagram:
          </Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData?.instagram || ""}
              onChangeText={(text) => setUserData({ ...userData, instagram: text })}
              placeholder="@username"
            />
          ) : userData?.instagram ? (
            <TouchableOpacity onPress={() => openLink(`https://instagram.com/${userData.instagram.replace("@", "")}`)}>
              <Text style={styles.socialValue}>{userData.instagram}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>No disponible</Text>
          )}
        </View>

        {/* LinkedIn field */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            <FontAwesome5 name="linkedin" size={20} color="#0077B5" /> LinkedIn:
          </Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData?.linkedin || ""}
              onChangeText={(text) => setUserData({ ...userData, linkedin: text })}
              placeholder="URL o username"
            />
          ) : userData?.linkedin ? (
            <TouchableOpacity
              onPress={() =>
                openLink(
                  userData.linkedin.includes("http")
                    ? userData.linkedin
                    : `https://linkedin.com/in/${userData.linkedin}`,
                )
              }
            >
              <Text style={styles.socialValue}>{userData.linkedin}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>No disponible</Text>
          )}
        </View>

        {/* Mobile phone field */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            <FontAwesome5 name="mobile-alt" size={20} color="#34B7F1" /> Telèfon mòbil:
          </Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={userData?.mobilePhone || ""}
              onChangeText={(text) => setUserData({ ...userData, mobilePhone: text })}
              placeholder="+34 000 000 000"
              keyboardType="phone-pad"
            />
          ) : userData?.mobilePhone ? (
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${userData.mobilePhone}`)}>
              <Text style={styles.socialValue}>{userData.mobilePhone}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.value}>No disponible</Text>
          )}
        </View>

        {/* Restaurant list section */}
        <View style={styles.restaurantSection}>
          {editMode ? (
            <>
              <Text style={styles.sectionTitle}>Llistat restaurant:</Text>
              <TouchableOpacity style={styles.restaurantPickerButton} onPress={() => setShowRestaurantPicker(true)}>
                <Text style={styles.restaurantPickerButtonText}>Afegir Restaurant</Text>
                <FontAwesome5 name="chevron-down" size={16} color="#0A16D6" />
              </TouchableOpacity>

              <RestaurantPicker />

              {selectedRestaurants.length > 0 && (
                <View style={styles.selectedRestaurants}>
                  {selectedRestaurants.map((restaurant) => (
                    <View key={restaurant.id} style={styles.selectedRestaurantItem}>
                      <View style={styles.restaurantInfoContainer}>
                        {restaurant.imageUrl ? (
                          <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImageSmall} />
                        ) : (
                          <View style={[styles.restaurantImagePlaceholder, { width: 30, height: 30 }]}>
                            <FontAwesome5 name="utensils" size={12} color="#ccc" />
                          </View>
                        )}
                        <View style={styles.restaurantTextContainer}>
                          <Text style={styles.selectedRestaurantText}>{restaurant.name}</Text>
                          <Text style={styles.editModeResponsibilityText}>
                            Responsabilidad: {restaurant.responsibility || ""}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.restaurantActionButtons}>
                        <TouchableOpacity
                          onPress={() => handleOpenResponsibilityModal(restaurant.id, restaurant.responsibility)}
                          style={styles.editResponsibilityButton}
                        >
                          <FontAwesome5 name="pencil-alt" size={16} color="#FFD700" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => confirmDeleteRestaurant(restaurant)}
                          style={styles.removeRestaurantButton}
                        >
                          <FontAwesome5 name="times" size={16} color="#FF0000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            selectedRestaurants.length > 0 && (
              <View style={styles.restaurantDisplayList}>
                <Text style={styles.sectionTitle}>Llistat restaurant:</Text>
                {selectedRestaurants.map((restaurant) => (
                  <View key={restaurant.id} style={styles.restaurantDisplayItem}>
                    <View style={styles.restaurantDisplayRow}>
                      {restaurant.imageUrl ? (
                        <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImageSmall} />
                      ) : (
                        <View style={[styles.restaurantImagePlaceholder, { width: 20, height: 20, marginRight: 5 }]}>
                          <FontAwesome5 name="utensils" size={10} color="#ccc" />
                        </View>
                      )}
                      <Text style={styles.restaurantListItem}>{restaurant.name}</Text>
                    </View>
                    <Text style={styles.responsibilityText}>Responsabilidad: {restaurant.responsibility || ""}</Text>
                  </View>
                ))}
              </View>
            )
          )}
        </View>

        {/* Edit and logout buttons */}
        <View style={styles.buttonSection}>
          <View style={styles.edit}>
            <Text style={styles.editText}>Editar dades</Text>
            <FontAwesome name="pencil-square" size={25} color={"#0A16D6"} onPress={() => setEditMode(!editMode)} />
          </View>

          {editMode && (
            <TouchableOpacity style={[styles.boton, { backgroundColor: "#444" }]} onPress={handleSave}>
              <Text style={styles.botonText}>Desar canvis</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.boton, { backgroundColor: "#444", marginTop: 10 }]} onPress={handleLogOut}>
            <Text style={styles.botonText}>Tancar Sessió</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <FooterNavbar setActiveContent={activeContent} navigation={navigation} />

      {/* Responsibility Modal */}
      <Modal
        visible={showResponsibilityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResponsibilityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escribe tu responsabilidad</Text>
              <TouchableOpacity onPress={() => setShowResponsibilityModal(false)} style={styles.closeButton}>
                <FontAwesome5 name="times" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.responsibilityOptions}>
              {["Cuiner", "Cambrer", "Gerent", "Nateja", "Altres"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.responsibilityOption,
                    responsibilityType === option && styles.responsibilityOptionSelected,
                  ]}
                  onPress={() => setResponsibilityType(option)}
                >
                  <View style={styles.radioButton}>
                    {responsibilityType === option && <View style={styles.radioButtonSelected} />}
                  </View>
                  <Text style={styles.responsibilityOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {responsibilityType === "Altres" && (
              <TextInput
                style={styles.responsibilityInput}
                value={responsibility}
                onChangeText={setResponsibility}
                placeholder="Describe tu responsabilidad aquí"
                multiline={true}
                numberOfLines={2}
              />
            )}

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!responsibilityType || (responsibilityType === "Altres" && !responsibility)) &&
                  styles.saveButtonDisabled,
              ]}
              onPress={saveResponsibility}
              disabled={!responsibilityType || (responsibilityType === "Altres" && !responsibility)}
            >
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Image Picker Modal */}
      <Modal
        visible={showProfileImagePickerModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfileImagePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: 250 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar foto de perfil</Text>
              <TouchableOpacity onPress={() => setShowProfileImagePickerModal(false)} style={styles.closeButton}>
                <FontAwesome5 name="times" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.imagePickerOptions}>
              <TouchableOpacity style={styles.imagePickerOption} onPress={() => takePhoto(true)}>
                <FontAwesome5 name="camera" size={24} color="#0A16D6" />
                <Text style={styles.imagePickerOptionText}>Tomar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imagePickerOption} onPress={() => pickImageFromGallery(true)}>
                <FontAwesome5 name="images" size={24} color="#0A16D6" />
                <Text style={styles.imagePickerOptionText}>Galería</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    ...Platform.select({
      ios: {
        width: "50%",
        marginTop: -60,
      },
      android: {
        flex: 1,
        marginLeft: 10,
        alignSelf: "flex-start",
        flexDirection: "row",
        marginTop: 5,
        zIndex: 1,
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 120,
  },
  boton: {
    marginTop: 25,
    backgroundColor: "#444",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
  },
  botonText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
    marginTop: 10,
  },
  titleEdition: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    textAlign: "center",
    marginTop: 20,
  },
  value: {
    fontSize: 18,
  },
  socialValue: {
    fontSize: 18,
    color: "#0A16D6",
    textDecorationLine: "underline",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 100,
  },
  userInfo: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 10,
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 8,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    minWidth: 120,
  },
  labelEstat: {
    fontWeight: "bold",
    fontSize: 18,
    minWidth: 120,
    ...Platform.select({
      ios: {
        marginTop: -60,
      },
      android: {
        alignSelf: "flex-start",
      },
    }),
  },
  input: {
    borderBottomWidth: 1,
    marginLeft: 10,
    color: "#0A16D6",
    fontSize: 20,
    paddingRight: 40,
    minWidth: 150,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 15,
  },
  editProfileImageOverlay: {
    position: "absolute",
    bottom: 20,
    right: 5,
    backgroundColor: "rgba(10, 22, 214, 0.7)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addProfilePhotoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
  },
  addProfilePhotoText: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "rgba(10, 22, 214, 0.7)",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addPhotoText: {
    color: "#fff",
    fontSize: 12,
  },
  edit: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  editText: {
    fontSize: 20,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A16D6",
  },
  closeButton: {
    padding: 5,
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  restaurantName: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  academicSection: {
    width: "100%",
    marginTop: 0,
    paddingHorizontal: 10,
  },
  restaurantSection: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  restaurantPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
    marginHorizontal: 10,
  },
  restaurantPickerButtonText: {
    color: "#0A16D6",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedRestaurants: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  selectedRestaurantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
  },
  selectedRestaurantText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 10,
  },
  removeRestaurantButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  restaurantDisplayList: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 5,
  },
  restaurantListItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  calendarIcon: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
  calendarContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "white",
    zIndex: 1000,
    elevation: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    margin: 5,
  },
  restaurantActionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editResponsibilityButton: {
    padding: 8,
    marginRight: 5,
  },
  responsibilityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  restaurantDisplayItem: {
    marginBottom: 10,
  },
  responsibilityText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 30,
    fontStyle: "italic",
  },
  responsibilityOptions: {
    marginBottom: 20,
  },
  responsibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  responsibilityOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  responsibilityOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0A16D6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#0A16D6",
  },
  saveButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  restaurantInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  restaurantImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  addPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  editPhotoButton: {
    padding: 8,
    marginRight: 5,
  },
  imagePickerOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  imagePickerOption: {
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: "45%",
  },
  imagePickerOptionText: {
    marginTop: 10,
    color: "#0A16D6",
    fontSize: 16,
  },
  restaurantDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantListContainer: {
    marginBottom: 15,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  paginationButton: {
    backgroundColor: "#0A16D6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 20,
  },
  verificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  verificationContent: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationSpinner: {
    marginBottom: 20,
  },
  verificationTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0A16D6",
    textAlign: "center",
  },
  verificationText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  logoutButton: {
    backgroundColor: "#444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingVerificationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingVerificationText: {
    marginTop: 15,
    fontSize: 18,
    color: "#666",
  },
  restaurantImagePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  restaurantTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  editModeResponsibilityText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 2,
  },
})

export default Profile

