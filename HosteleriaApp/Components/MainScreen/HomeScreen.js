// HomeScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MapViewComponent from './MapView';
import ListViewComponent from './ListView';
import SwitchBar from './SwitchBar';
import Navbar from '../Navbar/Navbar';
import FooterNavbar from '../FooterNavbar/FooterNavbar';
import { useNavigation } from '@react-navigation/native';

// Define or import your DATA property
const DATA = Array.from({ length: 20 }, (_, index) => ({
  id: index.toString(),
  title: `Restaurante ${index + 1}`,
  description: `Description del restaurante ${index + 1}`,
  imageUrl: `https://upload.wikimedia.org/wikipedia/commons/1/1d/Restaurant_in_The_Mus%C3%A9e_d%27Orsay.jpg`,
  workers: Array.from({ length: 3 }, (_, workerIndex) => ({
    id: `worker${index + 1}-${workerIndex + 1}`,
    name: `Trabajador ${workerIndex + 1}`,
    workerImageUrl: `https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png`,
  })),
}));

function HomeScreen() {
  const [filteredData, setFilteredData] = useState(DATA);
  const [isMapView, setIsMapView] = useState(false);
  const navigation = useNavigation();

  const toggleView = () => {
    setIsMapView(!isMapView);
  };

  const renderContent = () => {
    if (isMapView) {
      return <MapViewComponent />;
    } else {
      return <ListViewComponent data={filteredData} navigation={navigation}/>;
    }
  };

  return (
    <View style={styles.container}>
      <Navbar showGoBack={false} showLogIn={true} showSearch={true} text="Login" screen="Login"/>

      <View style={styles.contentContainer}>
        <SwitchBar isMapView={isMapView} onToggleView={toggleView} />
        <ScrollView style={styles.scrollView}>
          {renderContent()}
        </ScrollView>
      </View>

      <FooterNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 120,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
});

export default HomeScreen;