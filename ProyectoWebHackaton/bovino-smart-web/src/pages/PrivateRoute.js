// src/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Componente de Ruta Privada
const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Comprueba si hay un token

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/Login" />; // Redirige a Login si no está autenticado
};

export default PrivateRoute;
