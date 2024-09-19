import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Importa las pantallas que creaste
import HomeScreen from './HomeScreen';
import GestionAnimales from './GestionAnimales';
import GestionEnfermedades from './GestionEnfermedades';
import GestionProductos from './GestionProductos';
import EscanerQR from './EscanerQR';
import LeafBackground from './LeafBackground'; // Importa el nuevo fondo

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Arapey-Regular': require('./assets/fonts/Arapey-Regular.ttf'),
    'Arapey-Italic': require('./assets/fonts/Arapey-Italic.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Muestra una pantalla vacía mientras las fuentes se cargan
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <LeafBackground>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false, // Oculta la barra de navegación predeterminada
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="GestionAnimales"
            component={GestionAnimales}
            options={{ title: 'Gestión de Animales' }}
          />
          <Stack.Screen
            name="GestionEnfermedades"
            component={GestionEnfermedades}
            options={{ title: 'Gestión de Enfermedades' }}
          />
          <Stack.Screen
            name="GestionProductos"
            component={GestionProductos}
            options={{ title: 'Gestión de Productos' }}
          />
          <Stack.Screen
            name="EscanerQR"
            component={EscanerQR}
            options={{ title: 'Escáner QR' }}
          />
        </Stack.Navigator>
      </LeafBackground>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // Estilos adicionales si necesitas
});
