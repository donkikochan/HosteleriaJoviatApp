import React, {useState, useEffect} from "react";
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from "react-native";
import Navbar from "../Navbar/Navbar";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import CarouselDef from "../Carousel/CaroselDef";
import Items from "../ChefList/ItemsChef";
import RestaurantInfoCard from "../RestaurantInfoCard/RestaurantInfoCard";
import {db} from "../FirebaseConfig";
import {doc, getDoc, collection, getDocs} from "firebase/firestore";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RestaurantScreen({route}) {
    const [restaurantData, setRestaurantData] = useState(null);
    const [workersData, setWorkersData] = useState([]);
    const id = route?.params?.id;
    const [activeContent, setActiveContent] = useState(null);
    const navigation = useNavigation();
    const [heartColor, setHeartColor] = useState("white");
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const docRef = doc(db, "Restaurant", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRestaurantData({id: docSnap.id, ...docSnap.data()});
                    fetchWorkersData(id);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error al obtener los datos del restaurante", error);
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
    }, [id]);

    if (!restaurantData) {
        return <Text>Cargando...</Text>; // O algún indicador de carga
    }
    const longitud = restaurantData.longitud;
    const latitud = restaurantData.latitud;

    const saveToFavorites = async () => {
        try {
            let workersToSave = [...workersData]; // Hacemos una copia de los datos de los trabajadores
            if (workersToSave.length > 3) {
                // Si hay más de 3 trabajadores, conservamos solo los primeros 3
                workersToSave = workersToSave.slice(0, 3);
            }
            const restaurantWithWorkers = { ...restaurantData, workers: workersToSave };
            // Guardar el restaurante en AsyncStorage
            await AsyncStorage.setItem(`restaurant_${restaurantData.id}`, JSON.stringify(restaurantWithWorkers));
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
            setHeartColor('white');
            setIsFavorite(false);
            removeFromFavorites();
        } else {
            setHeartColor('red');
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
                text="Login"
            />
            <View style={styles.group}>
                <CarouselDef fotos={restaurantData.foto}/>
                <TouchableOpacity onPress={toggleFavorite} style={styles.touchStyle}>
                    <Ionicons name="md-heart" size={45} color={heartColor} style={styles.heartIcon}/>
                </TouchableOpacity>
            </View>
            <ScrollView style={{zIndex: -2}}>
                <RestaurantInfoCard
                    titol={restaurantData.nom}
                    descripcio={restaurantData.descripcio}
                    web={restaurantData.web}
                    tel={restaurantData.tel}
                    ubicacion={`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`}
                />
                {workersData.map((worker, index) => (
                    <Items
                        key={index}
                        name={worker.nom}
                        foto={worker.image}
                        position={worker.responsabilitat}
                        isLast={index === workersData.length - 1}
                    />
                ))}
            </ScrollView>
            <FooterNavbar setActiveContent={setActiveContent} navigation={navigation}/>
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
        alignSelf: 'center',
        justifyContent: 'center',
    },
    touchStyle: {
        top: 140,
        width: '15%',
        alignSelf: 'flex-end',
        right: 25,
    },
});

export default RestaurantScreen;