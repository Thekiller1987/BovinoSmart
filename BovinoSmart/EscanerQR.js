import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import MenuSVG from './assets/Menu.svg'; // Importa el archivo SVG de fondo
import QRSVG from './assets/qr.svg'; // Importa el archivo SVG del código QR

export default function EscanerQR({ navigation }) {
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
        <Text style={styles.title}>Escáner QR</Text>
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

      {/* Área de Escáner con ícono QR grande */}
      <View style={styles.scannerArea}>
        {/* Asegúrate de que el SVG se esté usando correctamente */}
        <QRSVG style={styles.qrImage} width={200} height={200} /> 
        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Escanear Código</Text>
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
  scannerArea: {
    alignItems: 'center',
    marginTop: 30,
  },
  qrImage: {
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#537982',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
