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
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Función para actualizar los datos del usuario en Firestore
  const handleSave = async () => {
    if (currentUser && userData) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        await updateDoc(userRef, userData);
        console.log("Perfil actualizado con éxito");
        setEditMode(false); // Salir del modo de edición
      } catch (error) {
        console.error("Error al actualizar el perfil: ", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Benvingut al vostre perfil d'usuari</Text>
        <View style={styles.userInfo}>
          {userData && userData.imageUrl && (
            <Image
              source={{ uri: userData.imageUrl }}
              style={styles.profileImage}
            />
          )}
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
            <Text style={styles.label}>Estat acadèmic:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={userData ? userData.academicStatus : ""}
                onChangeText={(text) =>
                  setUserData({ ...userData, academicStatus: text })
                }
              />
            ) : (
              <Text style={styles.value}>
                {" "}
                {userData ? userData.academicStatus : ""}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.edit}>
          <Text style={styles.editText}>Editar datos</Text>
          <FontAwesome
            name="pencil-square"
            size={25}
            color={"#173999"}
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
    fontSize: 22,
    fontWeight: "bold",
    margin: 40,
    textAlign: "center",
    marginTop: -55,
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
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    marginLeft: 10,
    color: "#173999",
    fontSize: 20,
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
});
export default Profile;
