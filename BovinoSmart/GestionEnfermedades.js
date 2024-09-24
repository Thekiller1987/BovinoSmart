import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import LeafBackground from './LeafBackground'; // Importa el componente LeafBackground para el fondo de hojas

export default function GestionEnfermedades({ navigation }) {
  return (
    <LeafBackground>
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
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar"
            style={styles.searchInput}
            placeholderTextColor="#666"
          />
          <Image source={require('./assets/buscar.png')} style={styles.searchIcon} />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para añadir enfermedad justo debajo del botón de buscar */}
      <TouchableOpacity style={styles.addButton}>
        <Image source={require('./assets/mas.png')} style={styles.addIcon} />
      </TouchableOpacity>
    </LeafBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '76%', // Reduce el ancho de la barra de búsqueda
    height: 40, // Altura ajustada para la barra de búsqueda
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 5, // Añade un margen de 5 a la izquierda de la barra de búsqueda
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 5, // Ajusta el margen izquierdo del botón de búsqueda
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
    marginTop: -10,
    backgroundColor: '#537982',
    padding: 20,
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
