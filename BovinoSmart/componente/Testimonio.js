import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Testimonio({ nombre, país, cargo, empresa, foto, testimonio }) {
  return (
    <View style={styles.testimonioContainer}>
      <View style={styles.imageContainer}>
        <Image source={foto} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{nombre} en {país}</Text>
        <Text style={styles.cargo}>{cargo} en {empresa}</Text>
        <Text style={styles.testimonio}>{testimonio}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  testimonioContainer: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 250,
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  image: {
    height: 250,
    width: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 2,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cargo: {
    fontSize: 16,
    marginVertical: 5,
  },
  testimonio: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
