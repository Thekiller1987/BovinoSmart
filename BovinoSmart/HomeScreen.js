import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MenuSVG from './assets/Menu.svg'; // Importa el archivo SVG de fondo
import UserSVG from './assets/user.svg'; // Importa el nuevo archivo SVG para el usuario
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevenir que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  // Carga de la fuente personalizada
  const [fontsLoaded] = useFonts({
    'KaiseiDecol-Bold': require('./assets/fonts/KaiseiDecol-Bold.ttf'), // Ajusta la ruta de la fuente
  });

  // Función para ocultar la pantalla de splash cuando las fuentes se hayan cargado
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Muestra una pantalla vacía mientras las fuentes se cargan
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* SVG de fondo */}
      <MenuSVG style={styles.backgroundSVG} />

      {/* Título del menú */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity
          style={[styles.userButton, styles.lightGreenBackground]} // Botón de usuario con nuevo fondo y borde
          activeOpacity={0.7} // Hace el botón opaco cuando se toca
        >
          {/* Ícono de usuario con tamaño reducido */}
          <UserSVG width={30} height={30} style={styles.userIcon} />
        </TouchableOpacity>
      </View>

      {/* Botones de opciones */}
      <View style={styles.buttonsContainer}>
        {/* Botón de Gestión del Animal */}
        <TouchableOpacity
          style={[styles.optionButton, styles.greenBackground]} // Configuración del botón de color verde
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GestionAnimales')}
        >
          <Image source={require('./assets/iconoVaca.png')} style={styles.iconLarge} />
          <Text style={styles.buttonText}>Gestión del animal</Text>
        </TouchableOpacity>

        {/* Botón de Gestión de Enfermedades */}
        <TouchableOpacity
          style={[styles.optionButton, styles.lightGreenBackground]} // Configuración del botón de color verde claro
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GestionEnfermedades')}
        >
          <Image source={require('./assets/iconoEnfermedades.png')} style={styles.iconLarge} />
          <Text style={styles.buttonText}>Gestión de enfermedades</Text>
        </TouchableOpacity>

        {/* Botón de Gestión de Productos */}
        <TouchableOpacity
          style={[styles.optionButton, styles.lightGreenBackground]} // Configuración del botón de color verde claro
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GestionProductos')}
        >
          <Image source={require('./assets/iconoProductos.png')} style={styles.iconLarge} />
          <Text style={styles.buttonText}>Gestión de productos</Text>
        </TouchableOpacity>

        {/* Botón de Escáner QR */}
        <TouchableOpacity
          style={[styles.optionButton, styles.greenBackground]} // Configuración del botón de color verde
          activeOpacity={0.7}
          onPress={() => navigation.navigate('EscanerQR')}
        >
          <Image source={require('./assets/iconoQR.png')} style={styles.iconLarge} />
          <Text style={styles.buttonText}>Escaner QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // Estilo para el SVG de fondo
  backgroundSVG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // Estilo del encabezado donde se muestra el título del menú
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  // Estilo del texto del título del menú
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'Arapey-Regular',
    marginBottom: 1,
  },
  // Estilo para el botón de usuario
  userButton: {
    position: 'absolute',
    top: 30,
    right: 40,
    borderRadius: 45, // Radio del borde del botón
    padding: 13,
    borderWidth: 2, // Ancho del borde del botón
    borderColor: '#3E7B31', // Color del borde del botón
    backgroundColor: '#8AC879', // Fondo verde claro para el botón de usuario
  },
  // Estilo del ícono de usuario
  userIcon: {
    width: 40, // Ancho del ícono de usuario
    height: 60, // Alto del ícono de usuario
  },
  // Contenedor de los botones de opciones
  buttonsContainer: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 60,
  },
  // Estilo base para todos los botones de opciones
  optionButton: {
    width: '45%', // Ancho de los botones de opciones
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26, // Espacio interno vertical del botón
    marginVertical: 30, // Margen vertical entre los botones
    borderRadius: 22, // Radio del borde de los botones
  },
  // Estilo para el fondo verde de los botones
  greenBackground: {
    backgroundColor: '#71AF61',
  },
  // Estilo para el fondo verde claro de los botones
  lightGreenBackground: {
    backgroundColor: '#8AC879',
  },
  // Estilo para los íconos grandes en los botones de opciones
  iconLarge: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  // Estilo para el texto dentro de los botones de opciones
  buttonText: {
    fontSize: 17, // Tamaño de la fuente del texto de los botones
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'KaiseiDecol-Bold', // Fuente personalizada aplicada
    lineHeight: 20, // Espacio entre líneas para evitar cortar letras
  },
});
