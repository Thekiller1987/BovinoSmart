import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LeafBackground from './LeafBackground'; // Importa el fondo decorativo
import LogoSVG from './assets/logo.svg'; // Asegúrate de que la ruta sea correcta

export default function LoginScreen({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);

  const handleLoginOrRegister = () => {
    if (isRegister) {
      console.log("Creando cuenta...");
    } else {
      console.log("Iniciando sesión...");
      navigation.navigate('HomeScreen');
    }
  };

  return (
    <LeafBackground>
      <View style={styles.container}>
        {/* Logo SVG */}
        <LogoSVG style={styles.logo} />

        {/* Contenedor principal con borde verde */}
        <View style={styles.formContainer}>
          {/* Campos de texto */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter email or username"
              placeholderTextColor="#A9A9A9"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#A9A9A9"
            />

            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                placeholderTextColor="#A9A9A9"
              />
            )}
          </View>

          {/* Botón de Iniciar sesión o Crear cuenta */}
          <TouchableOpacity style={styles.button} onPress={handleLoginOrRegister}>
            <Text style={styles.buttonText}>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</Text>
          </TouchableOpacity>
        </View>

        {/* Enlace para cambiar entre Iniciar Sesión y Crear Cuenta */}
        <Text style={styles.linkText}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <Text style={styles.link} onPress={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Iniciar Sesión' : 'Crear cuenta'}
          </Text>
        </Text>
      </View>
    </LeafBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 120, // Ajusta el tamaño del logo SVG
    height: 120,
    marginBottom: 30,
  },
  formContainer: {
    width: '90%',  // Ajusta el tamaño del recuadro
    borderWidth: 2, // Borde verde que recubre todo
    borderColor: '#3E7B31',
    borderRadius: 10,  // Redondear las esquinas del recuadro
    padding: 15,  // Añadir padding interno
    backgroundColor: '#FFF',  // Fondo blanco dentro del recuadro
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,  // Borde verde en los inputs
    borderColor: '#3E7B31',
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#587A83',
    alignItems: 'center',
    borderRadius: 20,  // Más redondeado para el botón
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    color: '#587A83',
  },
  link: {
    fontWeight: 'bold',
    color: '#587A83',
  },
});
