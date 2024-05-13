import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";
import Items from "../ChefList/ItemsChef";
import RestaurantInfoCard from "../RestaurantInfoCard/RestaurantInfoCard";
import { db } from "../FirebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RestaurantScreen({ route }) {
  const [restaurantData, setRestaurantData] = useState(null);
  const [workersData, setWorkersData] = useState([]);
  const id = route?.params?.id;
  const lastVisitedFavorites = route.params?.lastVisitedFavorites;
  const [activeContent, setActiveContent] = useState(null);
  const navigation = useNavigation();
  const [heartColor, setHeartColor] = useState("white");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [favValue, setFavValue] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const docRef = doc(db, "Restaurant", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRestaurantData({ id: docSnap.id, ...docSnap.data() });
          fetchWorkersData(id);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error al obtener los datos del restaurante", error);
      } finally {
        setLoading(false); // Marcar la carga como completada
        setDataLoaded(true);
      }
    };

    const fetchWorkersData = async (restaurantId) => {
      try {
        const workersQuery = collection(
          db,
          "Restaurant",
          restaurantId,
          "alumnes"
        );
        const querySnapshot = await getDocs(workersQuery);
        const workers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkersData(workers);
      } catch (error) {
        console.error(
          "Error al obtener los datos de los trabajadores: ",
          error
        );
      }
    };

    if (id) {
      fetchRestaurantData();
    }

    // Recuperar el estado del favorito al montar el componente
    const retrieveFavoriteStatus = async () => {
      try {
        const favoriteStatus = await AsyncStorage.getItem(`restaurant_${id}`);
        if (favoriteStatus !== null) {
          const isFav = JSON.parse(favoriteStatus);
          setIsFavorite(isFav);
          setHeartColor(isFav ? "red" : "white");
        }
      } catch (error) {
        console.error("Error al recuperar el estado del favorito", error);
      }
    };

    retrieveFavoriteStatus();
    return () => {
      // Limpiar datos del restaurante al desmontar el componente
      setRestaurantData(null);
      setWorkersData([]);
      setDataLoaded(false);
    };
  }, [id]);

  useEffect(() => {
    if (isFavorite && route.params?.lastVisitedFavorites) {
      setFavValue(true);
    }
  }, [navigation, route.params, isFavorite]);

  const renderContent = () => {
    if (!dataLoaded) {
      // return <Text>Cargando...</Text>; // O algún indicador de carga
      return (
        <View style={styles.group}>
          <ActivityIndicator animating={true} size="large" color="#111820" />
        </View>
      );
    } else if (!restaurantData) {
      return (
        <View style={styles.group}>
          <ActivityIndicator animating={true} size="large" color="#111820" />
        </View>
      );
      // return <Text>No se encontraron datos para mostrar.</Text>;
    } else {
      const longitud = restaurantData.longitud;
      const latitud = restaurantData.latitud;

      return (
        <View>
          <RestaurantInfoCard
            titol={restaurantData.nom}
            descripcio={restaurantData.descripcio}
            web={restaurantData.web}
            tel={restaurantData.tel}
            ubicacion={`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`}
          />
          {workersData.map((worker, index) => (
            <Items
              key={worker.id}
              worker={worker}
              onPress={() => navigateToWorkerScreen(worker)}
              navigation={navigation}
            />
          ))}
        </View>
      );
    }
  };

  const renderCarousel = () => {
    if (!dataLoaded || !restaurantData) {
      return (
        <View style={styles.group}>
          <ActivityIndicator animating={false} size="large" color="#111820" />
        </View>
      );
    } else {
      return (
        <View style={styles.group}>
          <CarouselDef fotos={restaurantData.foto} />
          <TouchableOpacity onPress={toggleFavorite} style={styles.touchStyle}>
            <Ionicons
              name="heart"
              size={45}
              color={heartColor}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const navigateToWorkerScreen = (worker) => {
    navigation.navigate("WorkerScreen", {
      workerId: worker.id,
      restaurantId: id,
      restaurantName: restaurantData.nom,
      responsabilitat: worker.responsabilitat,
    });
  };

  const saveToFavorites = async () => {
    try {
      const restaurantWithWorkers = { ...restaurantData, workers: workersData };
      // Guardar el restaurante en AsyncStorage
      await AsyncStorage.setItem(
        `restaurant_${restaurantData.id}`,
        JSON.stringify(restaurantWithWorkers)
      );
    } catch (error) {
      console.error("Error al guardar el restaurante en favoritos", error);
    }
  };
  const removeFromFavorites = async () => {
    try {
      // Eliminar el restaurante del AsyncStorage
      await AsyncStorage.removeItem(`restaurant_${restaurantData.id}`);
    } catch (error) {
      console.error("Error al eliminar el restaurante de favoritos", error);
    }
  };
  const toggleFavorite = () => {
    if (!restaurantData) {
      return; // Evitar la ejecución si los datos del restaurante aún no están disponibles
    }
    if (isFavorite) {
      setHeartColor("white");
      setIsFavorite(false);
      removeFromFavorites();
    } else {
      setHeartColor("red");
      setIsFavorite(true);
      saveToFavorites();
    }
  };

  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        specialBackButton={true}
        lastVisitedFavorites={lastVisitedFavorites}
        isFavorite={favValue}
        text="Login"
      />
      {renderCarousel()}
      <ScrollView style={{ zIndex: -2 }}>{renderContent()}</ScrollView>
      <FooterNavbar setActiveContent={activeContent} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  group: {
    position: "relative",
    overflow: "visible",
    marginBottom: 175,
    marginTop: 100,
  },
  heartIcon: {
    zIndex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  touchStyle: {
    top: 140,
    width: "15%",
    alignSelf: "flex-end",
    right: 25,
  },
});

export default RestaurantScreen;
