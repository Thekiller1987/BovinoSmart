import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function GestionAnimales() {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Animales</Text>
        <View style={styles.iconUserContainer}>
          <Image source={require('./assets/icono1.png')} style={styles.iconUser} />
        </View>
      </View>

      {/* Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Buscar" style={styles.searchInput} />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de categorías */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Vacas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={styles.categoryText}>Toros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#537982',
    fontWeight: 'bold',
  },
  iconUserContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  iconUser: {
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#71AF61',
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categoryButton: {
    backgroundColor: '#537982',
    padding: 10,
    borderRadius: 8,
  },
  categoryText: {
    color: '#fff',
  },
});
