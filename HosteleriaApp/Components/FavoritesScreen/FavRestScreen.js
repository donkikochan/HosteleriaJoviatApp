import React, {useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View,} from "react-native";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import FooterNavbar from "../FooterNavbar/FooterNavbar";
import Navbar from "../Navbar/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListViewComponent from "../MainScreen/ListView";

function FavRestScreen() {
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeContent, setActiveContent] = useState("Favorite");
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); // Obtener el objeto de navegación utilizando useNavigation
    const [lastVisitedFavorites, setLastVisitedFavorites] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        setFilteredRestaurants([]);
        const getFavoriteRestaurants = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const favoriteRestaurantKeys = keys.filter((key) =>
                    key.startsWith("restaurant_")
                );
                if (favoriteRestaurantKeys.length > 0) {
                    const favoriteRestaurantData = await AsyncStorage.multiGet(
                        favoriteRestaurantKeys
                    );
                    const favoriteRestaurants = favoriteRestaurantData.map(
                        ([key, value]) => JSON.parse(value)
                    );
                    setFavoriteRestaurants(favoriteRestaurants);
                    setFilteredRestaurants(favoriteRestaurants);
                } else {
                    console.log("No hay restaurantes favoritos almacenados.");
                    setFavoriteRestaurants([]);
                    setFilteredRestaurants([]);
                }
            } catch (error) {
                console.error("Error al obtener los restaurantes favoritos", error);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        getFavoriteRestaurants();
    }, [isFocused]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = favoriteRestaurants.filter((restaurant) =>
            restaurant.nom.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredRestaurants(filtered);
    };
    useEffect(() => {
        // Actualizar lastVisitedFavorites cuando la pantalla se enfoca
        if (isFocused) {
            return navigation.addListener('beforeRemove', () => {
                setLastVisitedFavorites(true);
            });
        }
    }, [isFocused, navigation]);
    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator animating={false}/>;
        } else if (favoriteRestaurants.length < 1) {
            return (
                <Text style={styles.noRestaurantsText}>
                    No n'hi ha restaurants favorits guardats
                </Text>
            );
        } else {
            if (isFocused)
                return (
                    <ListViewComponent data={filteredRestaurants}
                                       navigation={navigation}
                                       lastVisitedFavorites={lastVisitedFavorites}
                                       updateLastVisitedFavorites={updateLastVisitedFavorites}/>
                );
        }
    };

    const updateLastVisitedFavorites = (value) => {
        setLastVisitedFavorites(value);
    };

    return (
        <View style={styles.container}>
            <Navbar
                showGoBack={true}
                showLogIn={false}
                showSearch={true}
                specialBackButton={true}
                lastVisitedFavorites={lastVisitedFavorites}
                text="Login"
                screen="Login"
                handleSearch={handleSearch}
            />
            <ScrollView style={styles.contentContainer}>
                {renderContent()}
            </ScrollView>
            <FooterNavbar setActiveContent={activeContent} navigation={navigation}/>
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
    },
    noRestaurantsText: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        position: 'relative',
        alignItems: 'center',
        display: 'flex',
        marginTop: '50%',
        verticalAlign: 'middle',
        paddingVertical: '20%',
        fontSize: 20
    },
});

export default FavRestScreen;
