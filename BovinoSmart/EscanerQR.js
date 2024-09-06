import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function EscanerQR() {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Escáner QR</Text>
      </View>

      {/* Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Buscar" style={styles.searchInput} />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Área de Escáner */}
      <View style={styles.scannerArea}>
        <Image source={require('./assets/qr-placeholder.png')} style={styles.qrImage} />
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
  scannerArea: {
    alignItems: 'center',
    marginTop: 30,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#71AF61',
    padding: 15,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
  },
});
