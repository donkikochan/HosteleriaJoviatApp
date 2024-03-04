import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";
import Items from "../ChefList/ItemsChef";
import RestaurantInfoCard from "../RestaurantInfoCard/RestaurantInfoCard";
import { db } from "../FirebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

function RestaurantScreen({ route }) {
  const [restaurantData, setRestaurantData] = useState(null);
  const [workersData, setWorkersData] = useState([]);
  const id = route?.params?.id;
  const navigation = useNavigation();

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
      }
    }

    const fetchWorkersData = async (restaurantId) => {
      try {
        const workersQuery = collection(db, "Restaurant", restaurantId, "alumnes");
        const querySnapshot = await getDocs(workersQuery);
        const workers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkersData(workers);
      } catch (error) {
        console.error("Error al obtener los datos de los trabajadores: ", error);
      }
    };

    if (id) {
      fetchRestaurantData();
    }
  }, [id]);

  if (!restaurantData) {
    return <Text>Cargando...</Text>;
  }
  const longitud = restaurantData.longitud;
  const latitud = restaurantData.latitud;

  const navigateToWorkerScreen = (workerId) => {
    console.log("Navigating to WorkerScreen with workerId:", workerId);
    navigation.navigate('WorkerScreen', { workerId, restaurantId: id });
  };


  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        text="Login"
      />
      <CarouselDef fotos={restaurantData.foto} />
      <ScrollView>
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
        onPress={() => navigateToWorkerScreen(worker.id)}
        navigation={navigation}
        />
      ))}
      </ScrollView>
      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});

export default RestaurantScreen;
