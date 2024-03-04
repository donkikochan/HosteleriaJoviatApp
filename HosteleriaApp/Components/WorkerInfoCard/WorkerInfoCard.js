import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Dimensions } from 'react-native';


const WorkerInfoCard = ({ nom, responsabilitat, anydeinici, image, instagram }) => {
  const openInstagram = () => {
    if (instagram && typeof instagram === 'string' && instagram.trim() !== '') {
      const instagramURL = `https://www.instagram.com/${instagram}`;
      Linking.canOpenURL(instagramURL).then((supported) => {
        if (supported) {
          Linking.openURL(instagramURL);
        } else {
          console.error("No se puede abrir Instagram");
        }
      });
    } else {
      console.error("El nombre de usuario de Instagram no está definido o es inválido");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image || 'default_image_uri' }} style={styles.image} />
      <Text style={styles.nom}>{nom || '-'}</Text>
      <Text style={styles.responsabilitat}>{responsabilitat || '-'}</Text>
      <Text style={styles.anydeinici}>{anydeinici ? `Año de inicio: ${anydeinici}` : '-'}</Text>
      {instagram ? (
        <TouchableOpacity style={styles.boton} onPress={openInstagram}>
          <Text style={styles.botonText}>Instagram</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6E6E6',
    borderRadius: 9,
    padding: 20,
    marginTop: 25,
    marginBottom: 50,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.5, // 30% del ancho de la pantalla
    height: Dimensions.get('window').width * 0.5, // 30% del ancho de la pantalla para mantener la relación de aspecto
    borderRadius: Dimensions.get('window').width * 0.15, // La mitad del ancho para mantenerlo circular
    marginBottom: 10,
},
  nom: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  responsabilitat: {
    color: '#000',
    fontSize: 15,
    marginVertical: 5,
  },
  anydeinici: {
    color: '#000',
    fontSize: 15,
  },
  boton: {
    backgroundColor: '#444',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  botonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WorkerInfoCard;