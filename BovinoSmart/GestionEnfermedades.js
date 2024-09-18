import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import MenuSVG from './assets/Menu.svg'; // Importa el archivo SVG de fondo

export default function GestionEnfermedades({ navigation }) {
  return (
    <View style={styles.container}>
      {/* SVG de fondo */}
      <MenuSVG style={styles.backgroundSVG} />

      {/* Encabezado con botón de regreso */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Función para regresar al menú
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de enfermedades</Text>
      </View>

      {/* Barra de búsqueda con icono de lupa */}
      <View style={styles.searchContainer}>
        <Image source={require('./assets/buscar.png')} style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar"
          style={styles.searchInput}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para añadir enfermedad justo debajo del botón de buscar */}
      <TouchableOpacity style={styles.addButton}>
        <Image source={require('./assets/mas.png')} style={styles.addIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backgroundSVG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ajusta el modo de redimensionamiento para que la imagen se contenga dentro de la vista
    alignSelf: 'center', // Centra la imagen horizontalmente
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    marginTop: 25,
    backgroundColor: 'transparent', // Hace el fondo del encabezado transparente
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: -10, // Ajusta esta propiedad para mover el botón más arriba
    padding: 15, // Aumenta el tamaño del área de toque del botón
  },
  backButtonText: {
    fontSize: 28, // Aumenta el tamaño de la flecha
    color: '#fff', // Deja el color de la flecha en blanco
  },
  title: {
    fontSize: 20,
    color: '#fff', // Deja el color del título en blanco
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 0,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: -80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#537982',
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginRight: 40,
    marginTop: 10,
    backgroundColor: '#537982',
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
