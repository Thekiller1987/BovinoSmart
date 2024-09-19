// src/PrivateRoute.js
import React from 'react'; // Importa React
import { Route, Navigate } from 'react-router-dom'; // Importa Route y Navigate de react-router-dom

// Componente de Ruta Privada
const PrivateRoute = ({ element: Element, ...rest }) => {
  // Verifica si el usuario está autenticado comprobando si existe un token en el almacenamiento local
  const isAuthenticated = !!localStorage.getItem('token'); 

  // Si está autenticado, renderiza el componente especificado (Element)
  // Si no, redirige al usuario a la página de Login
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/Login" />;
};

// Exporta el componente para ser utilizado en otras partes de la aplicación
export default PrivateRoute;
