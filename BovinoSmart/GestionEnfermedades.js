import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function GestionEnfermedades() {
  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image source={require('./assets/fondo.png')} style={styles.backgroundImage} />

      {/* Encabezado con botón de regreso */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton}>
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
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    customHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#537982',
      width: '100%',
      paddingVertical: 20,
      marginTop: 40,
    },
    backButton: {
      position: 'absolute',
      left: 10,
    },
    backButtonText: {
      fontSize: 18,
      color: '#fff',
    },
    title: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
    // Estilo para la barra de búsqueda
    searchContainer: {
      flexDirection: 'row',
      backgroundColor: '#E0E0E0', // Color gris más claro para un mejor contraste
      marginVertical: 20,
      borderRadius: 15, // Reducir el radio del borde de la barra de búsqueda
      alignItems: 'center',
      paddingHorizontal: 0,
      width: '90%',
      shadowColor: '#000', // Sombra para dar profundidad
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
    // Estilo para el botón de "Buscar"
    searchButton: {
      marginLeft: -80, // Ajusta la posición del botón "Buscar" hacia la derecha
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#537982', // Cambié el color del botón de buscar a uno más oscuro
      borderRadius: 20,
    },
    searchButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    // Estilo para el botón de "Añadir" (botón de "más")
    addButton: {
      alignSelf: 'flex-end', // Ubicar el botón a la derecha
      marginRight: 40, // Margen derecho para alinearlo con el botón de buscar
      marginTop: 10, // Espaciado debajo del botón de buscar
      backgroundColor: '#537982', // Mismo color que el botón de buscar
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
  