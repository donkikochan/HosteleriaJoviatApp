import React from "react";
import {Dimensions} from "react-native";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Image} from "react-native";
import SearchBar from "./SearchBar";
import GoBackArrow from "./GoBackArrow";
import {useNavigation} from "@react-navigation/native";
import JoviatScreen from "../JoviatScreen/JoviatScreen";

const Navbar = (props) => {
    const navigation = useNavigation();
    return (
        <View style={styles.navbar}>
            {props.showGoBack && <GoBackArrow navigation={navigation}/>}
            {props.showLogIn && (
                <TouchableOpacity onPress={() => navigation.navigate(props.screen)}>
                    <Text style={styles.text}>{props.text}</Text>
                </TouchableOpacity>
            )}
            {props.showSearch && <SearchBar/>}
            <TouchableOpacity onPress={() => navigation.navigate('Joviat')}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={{width: 50, height: 50}}
                />
            </TouchableOpacity>
        </View>
    );
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    navbar: {
        color: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111820",
        paddingHorizontal: 10,
        paddingVertical: 15,
        position: "absolute",
        paddingTop: 47,
        top: 0,
        width: screenWidth,
    },
    text: {
        color: "white",
        fontSize: 16,
        marginLeft: 10,
    },
});

export default Navbar;
