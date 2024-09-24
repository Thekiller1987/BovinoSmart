import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import LeafBackground from './LeafBackground'; // Fondo decorativo

export default function QRScanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código QR escaneado: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido permiso a la cámara</Text>;
  }

  return (
    <LeafBackground>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button title={'Escanear de nuevo'} onPress={() => setScanned(false)} />
        )}
      </View>
    </LeafBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
