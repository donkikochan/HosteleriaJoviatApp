import { Link } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';


const WorkerInfoCard = ({ nom, responsabilitat, anydeinici, image, instagram, mobil, correu }) => {
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

  const sendEmail = () => {
    if (correu && typeof correu === 'string' && correu.trim() !== ''){
      const emailURL = `mailto:${correu}`;
      Linking.canOpenURL(emailURL).then((supported) => {
        if (supported){
          Linking.openURL(emailURL);
        }else {
          console.error("No se puede abrir la app de correo")
        }
        
      });
    }else {
      console.error("La direccion de correo no esta definida o es invalida");
    }
  };

  const makeCall = () => {
    if (mobil && typeof mobil === 'number' && mobil.trim !== ''){
      const phoneURL = `tel:${mobil}`;
      Linking.canOpenURL (phoneURL).then((supported) => {
        if (supported){
          Linking.openURL(phoneURL);
        }else {
          console.error("No se puede realizar la llamada");
        }
      });
    } else {
      console.error("El numero no esta definido o es invalido");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image || 'default_image_uri' }} style={styles.image} />
      <Text style={styles.nom}>{nom || '-'}</Text>
     
      <View style={styles.infoContainer}>
  <Text style={styles.responsabilitat}>{responsabilitat || '-'}</Text>
  <Text style={styles.separator}> | </Text>
  <Text style={styles.anydeinici}>{anydeinici ? ` Inici: ${anydeinici}` : '-'}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
      
      {correu ? (
        <TouchableOpacity style={styles.boton} onPress={sendEmail}>
         <Ionicons name="mail-unread-outline" size={30} color="#fff" />
        <Text style={styles.botonText}>Correu</Text>
      </TouchableOpacity>
      ) : null}
      {instagram ? (
        <TouchableOpacity style={styles.boton} onPress={openInstagram}>
           <Ionicons name="logo-instagram" size={30} color="#fff" />
          <Text style={styles.botonText}>Instagram</Text>
        </TouchableOpacity>
      ) : null}
      
      {mobil ? (
        <TouchableOpacity style={styles.boton} onPress={makeCall}>
        <FontAwesome name="phone-square" size={30} color="#fff" />
        <Text style={styles.botonText}> Mobil</Text>
      </TouchableOpacity>
      ): null}
      </View>
     
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
    width: Dimensions.get('window').width * 0.5, 
    height: Dimensions.get('window').width * 0.5, 
    borderRadius: Dimensions.get('window').width * 0.15, 
    marginBottom: 10,
},
nom: {
  color: '#000',
  fontSize: 20,
  fontWeight: 'bold',
  textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra del texto
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 1,
  letterSpacing: 0.5, // Espaciado entre letras
  lineHeight: 24, // Altura de la línea
  textAlign: 'center', // Alineación del texto
},



infoContainer: {
  flexDirection: 'row', // Alinea los elementos en fila
  alignItems: 'center', // Centra los elementos verticalmente
  justifyContent: 'center', // Centra los elementos horizontalmente
},

separator: {
  marginHorizontal: 5, // Espacio horizontal entre los textos
  color: '#000',
  fontSize: 20,
},

responsabilitat: {
  color: '#000',
  fontSize: 20,
  marginVertical: 15,
  fontStyle: 'italic', // Estilo cursiva
  letterSpacing: 0.3,
  lineHeight: 25,
},

anydeinici: {
  color: '#000',
  fontSize: 18,
  letterSpacing: 0.1,
  lineHeight: 25,
},


  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  boton: {
    backgroundColor: '#444',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    width: 120,               // Ancho fijo para todos los botones.
    justifyContent: 'center', // Centrado de los elementos dentro del botón.
  },
  botonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
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