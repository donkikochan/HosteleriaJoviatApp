// App.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Screen from './Components/MainScreen/HomeScreen';

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Screen />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
