// HomeScreen.js
import React, {useState, useEffect} from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import MapViewComponent from "./MapView";
import ListViewComponent from "./ListView";
import SwitchBar from "./SwitchBar";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import {useNavigation} from "@react-navigation/native";
import {db} from "../FirebaseConfig";
import {collection, getDocs, query, limit} from "firebase/firestore";

// Define or import your DATA property
/*const DATA = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  title: `Restaurante ${index + 1}`,
  description: `Description del restaurante ${index + 1}`,
  imageUrl: `https://upload.wikimedia.org/wikipedia/commons/1/1d/Restaurant_in_The_Mus%C3%A9e_d%27Orsay.jpg`,
  workers: Array.from({ length: 3 }, (_, workerIndex) => ({
    id: `worker${index + 1}-${workerIndex + 1}`,
    name: `Trabajador ${workerIndex + 1}`,
    workerImageUrl: `https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png`,
  })),
}));*/

function HomeScreen() {
    const [filteredData, setFilteredData] = useState([]);
    const [restaurantsData, setRestaurantsData] = useState([]);
    const [isMapView, setIsMapView] = useState(false);
    const navigation = useNavigation();

    const [activeContent, setActiveContent] = useState("ListView");

    //funcion para obtener los datos de los restaurantes
    const fetchRestaurantsData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Restaurant"));
            const restaurants = [];
            querySnapshot.forEach((doc) => {
                const restaurantData = {
                    id: doc.id,
                    ...doc.data(),
                    workers: [], //preparamos para llenar con datos de los alumnos
                };
                restaurants.push(restaurantData);
            });
            setRestaurantsData(restaurants);
        } catch (error) {
            console.error("error al obtener los datos de los restaurantes", error);
        }
    };

    //funcion para obtener los alumnos del restaurante
    const fetchWorkersData = async (restaurantId) => {
        try {
            const workersQuery = query(
                collection(db, "Restaurant", restaurantId, "alumnes"),
                limit(3)
            );
            const querySnapshot = await getDocs(workersQuery);
            const workers = [];
            querySnapshot.forEach((doc) => {
                workers.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            return workers;
        } catch (error) {
            console.error("Error al obtener los datos de los alumnos: ", error);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            await fetchRestaurantsData();
        };
        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchAndSetWorkers = async () => {
            // Solo procede si hay datos de restaurantes para procesar.
            if (restaurantsData.length > 0) {
                const promises = restaurantsData.map(async (restaurant) => {
                    const workers = await fetchWorkersData(restaurant.id);
                    return {...restaurant, workers}; // Retorna el restaurante con los trabajadores.
                });
                const updatedRestaurantsData = await Promise.all(promises);
                setFilteredData(updatedRestaurantsData); // Actualiza el estado con la nueva información.
            }
        };

        fetchAndSetWorkers();
    }, [restaurantsData]);

    const toggleView = () => {
        setIsMapView(!isMapView);
    };

    const renderContent = () => {
        if (isMapView) {
            return <MapViewComponent/>;
        } else if (activeContent === "Home") {
            return <ListViewComponent data={filteredData} navigation={navigation}/>;
        }
        //console.log(activeContent)
    };

    return (
        <View style={styles.container}>
            <Navbar
                showGoBack={false}
                showLogIn={true}
                showSearch={true}
                text="Login"
                screen="Login"
            />

            <View style={styles.contentContainer}>
                <SwitchBar isMapView={isMapView} onToggleView={toggleView}/>
                <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
            </View>

            <FooterNavbar setActiveContent={setActiveContent}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 120,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollView: {
        flex: 1,
        width: "100%",
        maxWidth: 600,
    },
});

export default HomeScreen;
