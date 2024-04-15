import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const GoBackArrow = ({navigation, specialBackButton, lastVisitedFavorites, isFavorite}) => {
    const handleGoBack = () => {

        if (specialBackButton && lastVisitedFavorites) {
            navigation.goBack();

        } else if (specialBackButton && !lastVisitedFavorites) {
            navigation.navigate("Home");

        } else {
            navigation.goBack();
        }

        if (isFavorite) {
            navigation.navigate("Favorite");
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={handleGoBack}>
                <Ionicons name="chevron-back" size={24} color="white"/>
            </TouchableOpacity>
        </View>
    );
};

export default GoBackArrow;
