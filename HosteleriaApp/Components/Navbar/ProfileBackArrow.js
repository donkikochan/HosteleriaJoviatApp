import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileBackArrow = ({ navigation }) => {
  const handlePress = () => {
    if (navigation) {
      navigation.navigate("Profile");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default ProfileBackArrow;