import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import Navbar from '../Navbar/Navbar';
import FooterNavbar from '../FooterNavbar/FooterNavbar';
import WorkerInfoCard from "../WorkerInfoCard/WorkerInfoCard";
import ItemPlaceWorker from '../ItemsPlaceWorker/ItemsPlaceWorker';
import { db } from "../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const WorkerScreen = ({ route }) => {
  const [activeContent, setActiveContent] = useState(null);
    const navigation = useNavigation();
  const [workerData, setWorkerData] = useState(null);
  const { workerId, restaurantId, restaurantName } = route.params;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!workerId || !restaurantId) {
        console.error("No se proporcionó workerId o restaurantId");
        return;
      }
      try {
        const docRef = doc(db, "Restaurant", restaurantId, "alumnes", workerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWorkerData(docSnap.data());
        } else {
          console.log("No such worker!");
        }
      } catch (error) {
        console.error("Error al obtener los datos del trabajador", error);
      }
    };

    fetchWorkerData();
  }, [workerId, restaurantId]);

  if (!workerData) {
    return <Text>Cargando datos del trabajador...</Text>;
  }
  

  
  return (
    <View style={styles.container}>
      <Navbar showGoBack={true} showLogIn={false} showSearch={false} text="Login" />
      
      <View style={styles.scrollViewContainer}>
        <WorkerInfoCard {...workerData} />

        <Text style={styles.title}>Llocs de treball:</Text>
        <ScrollView style={styles.scrollView}>
        <ItemPlaceWorker restaurantName={restaurantName} responsabilitat={route.params.responsabilitat}/>
      </ScrollView>
      </View>

      <FooterNavbar setActiveContent={activeContent} navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    marginTop: 100, // Altura del Navbar
    marginBottom: 50, // Altura del FooterNavbar
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24, // Ajusta el tamaño de la fuente según tus preferencias
    fontWeight: 'bold', // Negrita
    textAlign: 'center', // Centrado
    marginTop: -35, // Ajusta el margen superior según tus necesidades
    marginBottom: 10,
    backgroundColor: '#fff', // Ejemplo de color de fondo
    padding: 10,
  },
  
});

export default WorkerScreen;
