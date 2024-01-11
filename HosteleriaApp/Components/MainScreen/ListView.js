// ListView.js
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const ListViewComponent = ({ data }) => {
  return (
    <ScrollView>
      {data.map((item) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {/* Renderizar trabajadores aquí si es necesario */}
            <View style={styles.workersContainer}>
              {item.workers.map((worker) => (
                <View key={worker.id} style={styles.workerItem}>
                  <Image style={styles.workerImage} source={{ uri: worker.workerImageUrl }} />
                  <Text style={styles.workerName}>{worker.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <Image style={styles.image} source={{ uri: item.imageUrl }} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%', // Ocupa toda la anchura
  },
  image: {
    width: 100,
    height: 100, // Ajusta la altura según tus necesidades
    resizeMode: 'cover',
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  workersContainer: {
    marginTop: 10,
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  workerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  workerName: {
    fontSize: 14,
  },
});

export default ListViewComponent;
