import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../Components/Navbar/Navbar';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Navbar
        showGoBack={true}
        showLogIn={false}
        showSearch={false}
        text="Inici"
        screen="Home"
      />
      <View style={styles.content}>
        <Text style={styles.text}>Hola aqui te registras</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default RegisterScreen;