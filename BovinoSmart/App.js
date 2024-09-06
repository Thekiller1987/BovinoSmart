import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Prevenir que la pantalla de splash se oculte automáticamente

export default function App() {
  const [fontsLoaded] = useFonts({
    'Arapey-Regular': require('./assets/fonts/Arapey-Regular.ttf'),
    'Arapey-Italic': require('./assets/fonts/Arapey-Italic.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Mostrar nada mientras las fuentes se cargan
  } else {
    SplashScreen.hideAsync(); // Ocultar la pantalla de splash cuando las fuentes estén cargadas
  }

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image source={require('./assets/fondo.png')} style={styles.backgroundImage} />

      {/* Título del menú */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={[styles.iconUserContainer, styles.greenButton]}>
          <Image source={require('./assets/icono1.png')} style={styles.iconUser} />
        </View>
      </View>

      {/* Botones de opciones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.greenButton]} activeOpacity={0.7}>
          <Image source={require('./assets/iconoVaca.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Gestión del animal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
          <Image source={require('./assets/iconoEnfermedades.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Gestión de enfermedades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
          <Image source={require('./assets/iconoProductos.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Gestión de productos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
          <Image source={require('./assets/iconoQR.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Escaner QR</Text>
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Arapey-Regular',
    marginBottom: 10,
  },
  iconUserContainer: {
    position: 'absolute',
    top: 10,
    right: 20,
    borderRadius: 20,
    padding: 5,
  },
  iconUser: {
    width: 30,
    height: 30,
  },
  buttonsContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 110, // Aumenta el margen vertical para bajar los botones
  },
  button: {
    width: '45%',
    backgroundColor: '#71AF61',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  greenButton: {
    backgroundColor: '#71AF61', // Fondo verde para el botón con el icono de usuario
  },
  icon: {
    width: 90,
    height: 80,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});
