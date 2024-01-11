// SwitchBar.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SwitchBar = ({ isMapView, onToggleView }) => {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>List</Text>
      <Switch value={isMapView} onValueChange={onToggleView} />
      <Text style={styles.switchText}>Map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default SwitchBar;
