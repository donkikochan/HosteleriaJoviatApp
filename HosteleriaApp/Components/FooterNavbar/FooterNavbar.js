import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import ListViewComponent from "../MainScreen/ListView";

function FooterNavbar({setActiveContent}) {

    const [activeButton, setActiveButton] = useState(null);

    const handlePress = (buttonName) => {
        setActiveButton(buttonName);
        /*if (activeButton === "Home") {
            setActiveContent("ListView")
        }*/
        setActiveContent(buttonName);
        //console.log("pressed!")
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style=
                                  {[
                                      styles.iconText,
                                      activeButton === "Profile" && styles.activeButton,
                                  ]}
                              onPress={() => handlePress("Profile")}
            >
                <Ionicons name="md-person" size={20} color="white"/>
                <Text style={styles.text}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style=
                                  {[
                                      styles.iconText,
                                      activeButton === "Home" && styles.activeButton,
                                  ]}
                              onPress={() => handlePress("Home")}
            >
                <Ionicons name="md-home-sharp" size={20} color="white"/>
                <Text style={styles.text}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style=
                                  {[
                                      styles.iconText,
                                      activeButton === "Favorite" && styles.activeButton,
                                  ]}
                              onPress={() => handlePress("Favorite")}
            >
                <Ionicons name="md-heart" size={20} color="white"/>
                <Text style={styles.text}>Favorite</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        color: "white",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "black",
        paddingHorizontal: 50,
        paddingVertical: 15,
        position: "relative",
        bottom: 0,
    },
    iconText: {
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
    },
    text: {
        color: "white",
        textAlign: "center",
    },
    activeButton: {
        opacity: 0.5,
    },
});

export default FooterNavbar;
