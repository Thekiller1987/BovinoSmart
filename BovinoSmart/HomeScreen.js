import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import UserSVG from './assets/user.svg'; // Importa el nuevo archivo SVG para el usuario
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import LeafBackground from './LeafBackground'; // Importa el fondo decorativo

SplashScreen.preventAutoHideAsync();

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'KaiseiDecol-Bold': require('./assets/fonts/KaiseiDecol-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LeafBackground>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity
            style={[styles.userButton, styles.lightGreenBackground]}
            activeOpacity={0.7}
          >
            <UserSVG width={30} height={30} style={styles.userIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, styles.greenBackground]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GestionAnimales')}
          >
            <Image source={require('./assets/iconoVaca.png')} style={styles.iconLarge} />
            <Text style={styles.buttonText}>Gestión del animal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.lightGreenBackground]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GestionEnfermedades')}
          >
            <Image source={require('./assets/iconoEnfermedades.png')} style={styles.iconLarge} />
            <Text style={styles.buttonText}>Gestión de enfermedades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.lightGreenBackground]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GestionProductos')}
          >
            <Image source={require('./assets/iconoProductos.png')} style={styles.iconLarge} />
            <Text style={styles.buttonText}>Gestión de productos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.greenBackground]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EscanerQR')}
          >
            <Image source={require('./assets/iconoQR.png')} style={styles.iconLarge} />
            <Text style={styles.buttonText}>Escáner QR</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    fontFamily: 'Arapey-Regular',
    marginBottom: 1,
  },
  userButton: {
    position: 'absolute',
    top: 0,
    right: 40,
    borderRadius: 45,
    padding: 13,
    borderWidth: 2,
    borderColor: '#3E7B31',
    backgroundColor: '#8AC879',
  },
  userIcon: {
    width: 40,
    height: 60,
  },
  buttonsContainer: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 60,
  },
  optionButton: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    marginVertical: 30,
    borderRadius: 22,
  },
  greenBackground: {
    backgroundColor: '#71AF61',
  },
  lightGreenBackground: {
    backgroundColor: '#8AC879',
  },
  iconLarge: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 17,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'KaiseiDecol-Bold',
    lineHeight: 20,
  },
});
