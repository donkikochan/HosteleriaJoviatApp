import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

const SwitchBar = ({ isMapView, onToggleView }) => {
  const [backgroundPosition, setBackgroundPosition] = useState(
    new Animated.Value(0)
  );

  const toggleSwitch = () => {
    Animated.timing(backgroundPosition, {
      toValue: isMapView ? 0 : 100,
      duration: 250,
      useNativeDriver: false,
    }).start();

    onToggleView(!isMapView);
  };

  const getTextStyle = (isActive) => ({
    ...styles.switchText,
    color: isActive ? "black" : "white",
  });

  const backgroundStyle = {
    ...styles.switchBackground,
    left: backgroundPosition,
  };

  return (
    <View style={styles.switchContainer}>
      <TouchableOpacity
        style={styles.switchButton}
        activeOpacity={1}
        onPress={toggleSwitch}
      >
        <Animated.View style={backgroundStyle} />
        <Text style={getTextStyle(!isMapView)}>List</Text>
        <Text style={getTextStyle(isMapView)}>Map</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    marginVertical: 20,
    width: 200,
    height: 30,
    borderRadius: 20,
    backgroundColor: "black",
    overflow: "hidden",
  },
  switchButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  switchText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    width: "50%",
  },
  switchBackground: {
    position: "absolute",
    width: "50%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#D9D9D9",
    borderWidth: 2,
    borderColor: "black",
    zIndex: -1,
  },
});

export default SwitchBar;
