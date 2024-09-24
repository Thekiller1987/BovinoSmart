import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import LeafBackground from './LeafBackground';
import QRSVG from './assets/qr.svg';

export default function EscanerQR({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setSearchText(data);
    setShowScanner(false);
  };

  const handleScanButtonPress = () => {
    setSearchText(''); // Limpiar la barra de búsqueda
    setShowScanner(true); // Mostrar el escáner
    setScanned(false); // Reiniciar el estado de escaneado
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se concedió permiso a la cámara</Text>;
  }

  return (
    <LeafBackground>
      <View style={styles.container}>
        <View style={styles.customHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Escáner QR</Text>
        </View>

        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar"
              style={styles.searchInput}
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            <Image source={require('./assets/buscar.png')} style={styles.searchIcon} />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {!showScanner ? (
          <View style={styles.scannerArea}>
            <QRSVG style={styles.qrImage} width={200} height={200} />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanButtonPress} // Limpiar barra y mostrar escáner
            >
              <Text style={styles.scanButtonText}>Escanear Código</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.qrScanner}
              barCodeTypes={[
                BarCodeScanner.Constants.BarCodeType.qr, 
                BarCodeScanner.Constants.BarCodeType.code128, 
                BarCodeScanner.Constants.BarCodeType.code39
              ]}
            />
            <View style={styles.overlayTop} />
            <View style={styles.overlayBottom} />
            <View style={styles.overlayLeft} />
            <View style={styles.overlayRight} />
          </View>
        )}
      </View>
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
    width: '80%',
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginLeft: 5,
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
    marginLeft: 5,
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
  cameraWrapper: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  qrScanner: {
    width: 600,
    height: 600, // Ajustamos la cámara para que sea cuadrada
  },
  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
  },
  overlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
  },
  overlayLeft: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    left: 0,
    width: 0,
  },
  overlayRight: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    right: 0,
    width: 0,
  },
});
