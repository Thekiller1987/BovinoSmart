import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import MenuSVG from './assets/Menu.svg'; // Importa el archivo SVG de fondo

export default function GestionAnimales({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(''); // Estado para gestionar qué botón está activo

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
        <Text style={styles.title}>Gestión de Animales</Text>
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

      {/* Botones de categorías y botón de añadir */}
      <View style={styles.categoryContainer}>
        {/* Botón de "Vacas" */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'Vacas' ? styles.activeButton : null, // Aplica el estilo activo si se selecciona "Vacas"
          ]}
          onPress={() => setActiveCategory('Vacas')}
        >
          <Text style={styles.categoryText}>Vacas</Text>
        </TouchableOpacity>

        {/* Botón de "Toros" */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'Toros' ? styles.activeButton : null, // Aplica el estilo activo si se selecciona "Toros"
          ]}
          onPress={() => setActiveCategory('Toros')}
        >
          <Text style={styles.categoryText}>Toros</Text>
        </TouchableOpacity>

        {/* Botón de "Añadir" (botón de "más") */}
        <TouchableOpacity style={styles.addButton}>
          <Image source={require('./assets/mas.png')} style={styles.addIcon} />
        </TouchableOpacity>
      </View>
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
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    marginTop: 25,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: -10,
    padding: 15,
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  title: {
    fontSize: 20,
    color: '#fff',
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
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#537982',
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Centra los botones de categorías y el botón "más"
    alignItems: 'center',
    width: '100%',
    marginTop: -10,
  },
  categoryButton: {
    backgroundColor: '#537982',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15, // Ajusta para mantener el tamaño original
    marginHorizontal: 10, // Espacio entre los botones de categoría
    height: 35, // Mantiene el tamaño original del botón
    minWidth: 100, // Ajuste para mantener el tamaño
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#71AF61', // Color verde cuando el botón está activo
  },
  categoryText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#537982',
    padding: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10, // Espacio a la izquierda del botón "más"
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
