import { useEffect, useState } from "react";
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
} from "react-native";
import { useAuth } from "../../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import { signOut } from "firebase/auth";
import { auth, db } from "../FirebaseConfig";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Calendar } from "react-native-calendars";

const Profile = () => {
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [activeContent, setContent] = useState("Profile");
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [showRestaurantPicker, setShowRestaurantPicker] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  // Modifica la función fetchRestaurants
const fetchRestaurants = async () => {
  setIsLoadingRestaurants(true);
  try {
    // Cambiado a "Restaurant" con R mayúscula
    const restaurantsCollection = collection(db, "Restaurant");
    const restaurantsSnapshot = await getDocs(restaurantsCollection);
    const restaurantsList = restaurantsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().nom // Cambiado para usar el campo "nom"
    }));
    console.log("Restaurantes cargados:", restaurantsList);
    setRestaurants(restaurantsList);
  } catch (error) {
    console.error("Error al cargar los restaurantes:", error);
  } finally {
    setIsLoadingRestaurants(false);
  }
};

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = (restaurant) => {
    if (!selectedRestaurants.some(r => r.id === restaurant.id)) {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
  };

  const handleRemoveRestaurant = (restaurantToRemove) => {
    setSelectedRestaurants(selectedRestaurants.filter(
      restaurant => restaurant.id !== restaurantToRemove.id
    ));
  };

  const handleSave = async () => {
    if (currentUser && userData) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        let updatedUserData = {
          ...userData,
          imageUrl: image,
          restaurants: selectedRestaurants
        };

        if (image) {
          updatedUserData.imageUrl = image;
        }

        await updateDoc(userRef, updatedUserData);
        setUserData(updatedUserData);
        console.log("Perfil actualizado con éxito");
        setEditMode(false);
      } catch (error) {
        console.error("Error al actualizar el perfil: ", error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
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
        console.error("Error al actualizar el perfil con la nueva imagen: ", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            if (data.restaurants) {
              setSelectedRestaurants(data.restaurants);
            }
            if (data.birth) {
              const [day, month, year] = data.birth.split('/');
              setDate(new Date(year, month - 1, day));
            }
          } else {
            console.log("No se encontró el documento del usuario.");
          }
        } catch (error) {
          console.error("Error al obtener el documento del usuario:", error);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const RestaurantPicker = () => (
    <Modal
      visible={showRestaurantPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRestaurantPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Restaurant</Text>
            <TouchableOpacity
              onPress={() => setShowRestaurantPicker(false)}
              style={styles.closeButton}
            >
              <FontAwesome5 name="times" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          
          {isLoadingRestaurants ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0A16D6" />
              <Text style={styles.loadingText}>Cargando restaurantes...</Text>
            </View>
          ) : (
            <ScrollView style={styles.restaurantList}>
              {restaurants.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.restaurantItem}
                  onPress={() => {
                    handleAddRestaurant(restaurant);
                    setShowRestaurantPicker(false);
                  }}
                >
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

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
            style={[styles.boton, { backgroundColor: "#444", marginHorizontal: 130 }]}
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
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={userData?.birth || ''}
                  editable={false}
                  placeholder=""
                />
                <TouchableOpacity
                  onPress={() => setShowCalendar(!showCalendar)}
                  style={styles.calendarIcon}
                >
                  <FontAwesome5 name="calendar-alt" size={24} color="#0A16D6" />
                </TouchableOpacity>
                {showCalendar && (
                  <View style={styles.calendarContainer}>
                    <Calendar
                      onDayPress={(day) => {
                        const formattedDate = formatDate(day.dateString);
                        setUserData({ ...userData, birth: formattedDate });
                        setSelectedDate(day.dateString);
                        setShowCalendar(false);
                      }}
                      markedDates={{
                        [selectedDate]: { selected: true, selectedColor: '#0A16D6' }
                      }}
                      style={styles.calendar}
                      theme={{
                        selectedDayBackgroundColor: '#0A16D6',
                        todayTextColor: '#0A16D6',
                        arrowColor: '#0A16D6',
                      }}
                    />
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.value}>{userData ? userData.birth : ""}</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={editMode ? styles.labelEstat : styles.label}>
              Estat acadèmic:
            </Text>
            {editMode ? (
              <Picker
                selectedValue={userData ? userData.academicStatus : ""}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setUserData({ ...userData, academicStatus: itemValue })
                }
                mode="dropdown"
                dropdownIconColor={"#444"}
              >
                <Picker.Item
                  label="Alumne"
                  value="Alumne"
                  color={"#0A16D6"}
                />
                <Picker.Item
                  label="Ex-alumne"
                  value="Ex-alumne"
                  color={"#0A16D6"}
                />
              </Picker>
            ) : (
              <Text style={styles.value}>
                {userData ? userData.academicStatus : ""}
              </Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            {editMode ? (
              <View style={styles.restaurantSection}>
                <Text style={styles.label}>Llistat restaurant:</Text>
                <TouchableOpacity
                  style={styles.restaurantPickerButton}
                  onPress={() => setShowRestaurantPicker(true)}
                >
                  <Text style={styles.restaurantPickerButtonText}>
                    Seleccionar Restaurant
                  </Text>
                  <FontAwesome5 name="chevron-down" size={16} color="#0A16D6" />
                </TouchableOpacity>

                <RestaurantPicker />

                {selectedRestaurants.length > 0 && (
                  <View style={styles.selectedRestaurants}>
                    {selectedRestaurants.map((restaurant) => (
                      <View key={restaurant.id} style={styles.selectedRestaurantItem}>
                        <Text style={styles.selectedRestaurantText}>
                          {restaurant.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveRestaurant(restaurant)}
                          style={styles.removeRestaurantButton}
                        >
                          <FontAwesome5 name="times" size={16} color="#FF0000" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              selectedRestaurants.length > 0 && (
                <View style={styles.restaurantList}>
                  <Text style={styles.label}>Llistat restaurant:</Text>
                  {selectedRestaurants.map((restaurant) => (
                    <Text key={restaurant.id} style={styles.restaurantListItem}>
                      • {restaurant.name}
                    </Text>
                  ))}
                </View>
              )
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
        {editMode && (
          <TouchableOpacity
            style={[styles.boton, { backgroundColor: "#444", marginLeft: 5 }]}
            onPress={handleSave}
          >
            <Text style={styles.botonText}>Desar canvis</Text>
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
    paddingBottom: 100, // Añadido para dar espacio al final
  },
  userInfo: {
    width: '100%',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    width: "100%",
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
    marginLeft: 10,
    color: "#0A16D6",
    fontSize: 20,
    paddingRight: 40,
    minWidth: 150,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginVertical: 20,
  },
  edit: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  editText: {
    fontSize: 20,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A16D6',
  },
  closeButton: {
    padding: 5,
  },
  restaurantItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  restaurantName: {
    fontSize: 16,
    color: '#333',
  },
  restaurantPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    marginHorizontal: 20,
  },
  restaurantPickerButtonText: {
    color: '#0A16D6',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedRestaurants: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  selectedRestaurantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedRestaurantText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  removeRestaurantButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  restaurantSection: {
    width: '100%',
  },
  restaurantList: {
    width: '100%',
    paddingHorizontal: 20,
  },
  restaurantListItem: {
    fontSize: 16,
    color: '#333',
    marginLeft: 20,
    marginTop: 5,
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  calendarIcon: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  calendarContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
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
});

export default Profile;