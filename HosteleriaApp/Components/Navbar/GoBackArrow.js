import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GoBackArrow = ({ navigation }) => {
  const handlePress = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default GoBackArrow;
