import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import GestionAnimales from './GestionAnimales';
import GestionEnfermedades from './GestionEnfermedades';
import GestionProductos from './GestionProductos';
import EscanerQR from './EscanerQR';

const Stack = createStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // Cargar las fuentes personalizadas
  const [fontsLoaded] = useFonts({
    'KaiseiDecol-Bold': require('./assets/fonts/KaiseiDecol-Bold.ttf'),
    'Arapey-Regular': require('./assets/fonts/Arapey-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      setAppReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) {
    return null; // Espera hasta que todo esté listo
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Pantallas dentro del Stack.Navigator */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GestionAnimales" component={GestionAnimales} />
        <Stack.Screen name="GestionEnfermedades" component={GestionEnfermedades} />
        <Stack.Screen name="GestionProductos" component={GestionProductos} />
        <Stack.Screen name="EscanerQR" component={EscanerQR} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
