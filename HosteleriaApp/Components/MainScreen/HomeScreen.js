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
  title: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
  imageUrl: `https://concepto.de/wp-content/uploads/2018/10/URL1-e1538664726127.jpg`,
  workers: Array.from({ length: 3 }, (_, workerIndex) => ({
    id: `worker${index + 1}-${workerIndex + 1}`,
    name: `Worker ${workerIndex + 1}`,
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