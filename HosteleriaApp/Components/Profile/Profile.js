import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
<<<<<<< Updated upstream
} from "react-native";
import { useAuth } from "../../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import { signOut } from "firebase/auth";
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { updateDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
=======
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
>>>>>>> Stashed changes

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
  console.log(
    "Current User UID: ",
    currentUser ? currentUser.uid : "No user logged in"
  );

<<<<<<< Updated upstream
  const navigation = useNavigation();
  const [activeContent, setContent] = useState("Profile");
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
=======
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
>>>>>>> Stashed changes

  // Función para actualizar los datos del usuario en Firestore
  const handleSave = async () => {
    if (currentUser && userData) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        // Crear un nuevo objeto con los datos de usuario existentes
        let updatedUserData = { ...userData, imageUrl: image };

        // Si image no es null, actualizar imageUrl en el objeto
        if (image) {
          updatedUserData.imageUrl = image;
        }

        // Actualizar el documento del usuario con los nuevos datos
        await updateDoc(userRef, updatedUserData);

        setUserData(updatedUserData);

        console.log("Perfil actualizado con éxito");
        setEditMode(false); // Salir del modo de edición
      } catch (error) {
        console.error("Error al actualizar el perfil: ", error);
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // que el nombre del archivo sea único
    const fileName = `${currentUser.uid}_${new Date().toISOString()}.jpg`;

    const storage = getStorage();
    const storageRef = ref(storage, `images/${currentUser.uid}/${fileName}`);

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
          updateProfileImage(downloadURL);
        });
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  };

  const updateProfileImage = async (url) => {
    if (currentUser && url) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(userRef, { imageUrl: url });
        console.log("Perfil actualizado con éxito con la nueva URL de imagen");
      } catch (error) {
        console.error(
          "Error al actualizar el perfil con la nueva imagen: ",
          error
        );
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", currentUser.uid);
        try {
<<<<<<< Updated upstream
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
=======
          // First check if user exists in regular users collection
          const userRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userRef)
      
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserData(userData)
      
            // Check if user is in RechazarUser collection
            const rechazarUsersQuery = collection(db, "RechazarUser")
            const q = query(rechazarUsersQuery, where("userId", "==", currentUser.uid))
            const rechazarUsersSnapshot = await getDocs(q)
      
            if (!rechazarUsersSnapshot.empty) {
              // User is rejected
              setIsRejected(true)
              setIsVerified(false)
              const rejectedUserData = rechazarUsersSnapshot.docs[0].data()
              setRejectionReason(rejectedUserData.rejectionReason || "No se ha proporcionado un motivo")
            } else {
              // Check if user is in AltaUsers collection
              const altaUsersQuery = collection(db, "AltaUsers")
              const altaQ = query(altaUsersQuery, where("userId", "==", currentUser.uid))
              const altaUsersSnapshot = await getDocs(altaQ)
      
              if (!altaUsersSnapshot.empty) {
                setIsVerified(false)
                setIsRejected(false)
              } else {
                setIsVerified(true)
                setIsRejected(false)
              }
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
>>>>>>> Stashed changes
          } else {
            console.log("No se encontró el documento del usuario.");
          }
        } catch (error) {
          console.error("Error al obtener el documento del usuario:", error);
        }
      };

      fetchUserData();
    }
<<<<<<< Updated upstream
  }, [currentUser]);
=======
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
            {isRejected ? (
              <>
                <FontAwesome5 name="times-circle" size={50} color="#FF0000" style={styles.verificationIcon} />
                <Text style={[styles.verificationTitle, { color: '#FF0000' }]}>Solicitud Rechazada</Text>
                <Text style={styles.verificationText}>Has sido rechazado por este motivo:</Text>
                <Text style={[styles.verificationText, { fontStyle: 'italic', fontWeight: 'bold' }]}>{rejectionReason}</Text>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color="#0A16D6" style={styles.verificationSpinner} />
                <Text style={styles.verificationTitle}>Esperando verificación</Text>
                <Text style={styles.verificationText}>
                  Tu cuenta está pendiente de verificación por parte del administrador.
                </Text>
                <Text style={styles.verificationText}>Recibirás acceso completo una vez que tu cuenta sea verificada.</Text>
              </>
            )}
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
>>>>>>> Stashed changes

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Navbar
          showGoBack={false}
          showLogIn={true}
          showSearch={false}
          text="Entrar"
          screen="Login"
        />
        <ScrollView>
          <View style={[styles.userInfo, { paddingBottom: 50 }]}>
            <Text style={styles.titleEdition}>
              Necessites iniciar sessió per accedir a aquesta pàgina.
            </Text>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.profileImage}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.boton,
              { backgroundColor: "#444", marginHorizontal: 130 },
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.botonText}>Inicia sessió</Text>
          </TouchableOpacity>
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
      <ScrollView contentContainerStyle={styles.content}>
<<<<<<< Updated upstream
        <Text style={editMode ? styles.titleEdition : styles.title}>
          Benvingut al vostre perfil d'usuari
        </Text>
        <View style={styles.userInfo}>
          {userData &&
            userData.imageUrl &&
            (editMode ? (
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={{ uri: image || (userData && userData.imageUrl) }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            ) : (
              <Image
                source={{ uri: userData.imageUrl }}
                style={styles.profileImage}
=======
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
          <View style={styles.labelWithIcon}>
            <View style={styles.iconContainer}>
              <FontAwesome5 
                name="user" 
                color="#666" // Neutral gray color
                size={20} // Adjust size as needed
>>>>>>> Stashed changes
              />
            ))}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Nom d'usuari:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={userData ? userData.username : ""}
                onChangeText={(text) =>
                  setUserData({ ...userData, username: text })
                }
              />
            ) : (
              <Text style={styles.value}>
                {userData ? userData.username : ""}
              </Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Data de naixement:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={userData ? userData.birth : ""}
                onChangeText={(text) =>
                  setUserData({ ...userData, birth: text })
                }
              />
            ) : (
              <Text style={styles.value}>{userData ? userData.birth : ""}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={editMode ? styles.labelEstat : styles.label}>
              Estat acadèmic:
            </Text>
            {editMode ? (
<<<<<<< Updated upstream
              <Picker
                selectedValue={userData ? userData.academicStatus : ""}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  setUserData({ ...userData, academicStatus: itemValue })
=======
              <View style={styles.academicStatusToggle}>
                <TouchableOpacity
                  style={[
                    styles.academicStatusOption,
                    userData?.academicStatus === "Alumne" && styles.academicStatusOptionSelected
                  ]}
                  onPress={() => setUserData({ ...userData, academicStatus: "Alumne" })}
                >
                  <Text style={styles.academicStatusOptionText}>Alumne</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.academicStatusOption,
                    userData?.academicStatus === "Ex-alumne" && styles.academicStatusOptionSelected
                  ]}
                  onPress={() => setUserData({ ...userData, academicStatus: "Ex-alumne" })}
                >
                  <Text style={styles.academicStatusOptionText}>Ex-alumne</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.value}>{userData?.academicStatus || "Alumne"}</Text>
            )}
          </View>
        </View>

        {/* Instagram field */}
        <View style={styles.infoContainer}>
          <View style={styles.labelWithIcon}>
            <FontAwesome name="instagram" size={20} color="#C13584" style={styles.iconStyle} />
            <Text style={styles.label}>Instagram:</Text>
          </View>
          <View style={styles.valueContainer}>
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
        </View>

        {/* LinkedIn field */}
        <View style={styles.infoContainer}>
          <View style={styles.labelWithIcon}>
            <FontAwesome5 name="linkedin" size={20} color="#0077B5" style={styles.iconStyle} />
            <Text style={styles.label}>LinkedIn:</Text>
          </View>
          <View style={styles.valueContainer}>
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
>>>>>>> Stashed changes
                }
                mode="dropdown"
                dropdownIconColor={"#444"}
                dropdownIconRippleColor={"#444"}
              >
                <Picker.Item
                  label="Alumne"
                  value="Alumne"
                  onPress={handleSave}
                  color={"#0A16D6"}
                  style={styles.pickerStyles}
                />
                <Picker.Item
                  label="Ex-alumne"
                  value="Ex-alumne"
                  onPress={handleSave}
                  color={"#0A16D6"}
                  style={styles.pickerStyles}
                />
              </Picker>
            ) : (
              <Text style={styles.value}>
                {userData ? userData.academicStatus : ""}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.edit}>
          <Text style={styles.editText}>Editar dades</Text>
          <FontAwesome
            name="pencil-square"
            size={25}
            color={"#0A16D6"}
            onPress={() => setEditMode(!editMode)}
          />
        </View>
<<<<<<< Updated upstream
        {editMode && (
          <TouchableOpacity
            style={[styles.boton, { backgroundColor: "#444", marginLeft: 5 }]}
            onPress={handleSave}
          >
            <Text style={styles.botonText}>Desar canvis</Text>
=======

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
>>>>>>> Stashed changes
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.boton, { backgroundColor: "#444", marginLeft: 5 }]}
          onPress={handleLogOut}
        >
          <Text style={styles.botonText}>Tancar Sessió</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    ...Platform.select({
      ios: {
        width: "50%",
        marginTop: -90,
      },
      android: {
        flex: 1,
        marginLeft: 10,
        alignSelf: "flex-start",
        flexDirection: "row",
        marginTop: "-5%",
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
  },
  botonText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 50,
    textAlign: "center",
    marginTop: -55,
  },
  titleEdition: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 50,
    textAlign: "center",
    marginTop: 50,
  },
  value: {
    fontSize: 18,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    width: "100%",
<<<<<<< Updated upstream
=======
    justifyContent: "space-between",
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "35%",
    paddingRight: 10,
  },
  iconContainer: {
    marginRight: 10, // Space between icon and label
    justifyContent: 'center',
    alignItems: 'center',
    width: 25, // Ensure consistent width
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  iconStyle: {
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  iconPlaceholder: {
    width: 24,
    marginRight: 8,
>>>>>>> Stashed changes
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  labelEstat: {
    fontWeight: "bold",
    fontSize: 18,

    ...Platform.select({
      ios: {
        marginTop: -90,
      },
      android: {
        alignSelf: "flex-start",
      },
    }),
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 10,
    color: "#0A16D6",
<<<<<<< Updated upstream
    fontSize: 20,
=======
    fontSize: 18,
    paddingVertical: 4,
    minWidth: "90%",
    backgroundColor: "#fff",
    paddingLeft: 15,
  },
  academicStatusToggle: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 5,
  },
  academicStatusOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  academicStatusOptionSelected: {
    backgroundColor: '#0A16D6',
    borderColor: '#0A16D6',
  },
  academicStatusOptionText: {
    fontSize: 16,
    color: '#c6c3c3',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minWidth: "90%",
  },
  pickerStyle: {
    color: "#0A16D6",
    height: 40,
    width: "100%",
>>>>>>> Stashed changes
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 20,
  },
  edit: {
    flexDirection: "row",
    marginTop: 35,
  },

  editText: {
    fontSize: 18,
    marginEnd: 10,
    fontWeight: "bold",
  },
  userInfo: {
    overflow: "visible",
    borderRadius: 9,
    borderWidth: 0,
    borderColor: "#000000",
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  pickerStyles: {
    fontSize: 20,
    alignSelf: "flex-start",
  },
});
export default Profile;
