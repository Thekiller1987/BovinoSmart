import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import LeafBackground from './LeafBackground'; // Importa el componente LeafBackground para el fondo de hojas

export default function GestionProductos({ navigation }) {
  const [activeCategory, setActiveCategory] = useState(''); // Estado para gestionar qué botón está activo

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
        <Text style={styles.title}>Gestión de Productos</Text>
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

      {/* Botones de categorías */}
      <View style={styles.categoryContainer}>
        {/* Botón de "Suplementos" */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'Suplementos' ? styles.activeButton : null, // Aplica el estilo activo si se selecciona "Suplementos"
          ]}
          onPress={() => setActiveCategory('Suplementos')}
        >
          <Text style={styles.categoryText}>Suplementos</Text>
        </TouchableOpacity>

        {/* Botón de "Vacunas" */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'Vacunas' ? styles.activeButton : null, // Aplica el estilo activo si se selecciona "Vacunas"
          ]}
          onPress={() => setActiveCategory('Vacunas')}
        >
          <Text style={styles.categoryText}>Vacunas</Text>
        </TouchableOpacity>

        {/* Botón de "Medicamentos" */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'Medicamentos' ? styles.activeButton : null, // Aplica el estilo activo si se selecciona "Medicamentos"
          ]}
          onPress={() => setActiveCategory('Medicamentos')}
        >
          <Text style={styles.categoryText}>Medicamentos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de "Añadir" (botón de "más") */}
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: -10,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#537982',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginHorizontal: 1,
    height: 35,
    minWidth: 60,
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
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: -10,
    marginRight: 20, // Mueve el botón de "Añadir" un poco hacia la izquierda
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});
