import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa componentes de React Router para la navegación
import Home from './pages/Home'; // Importa la página Home
import About from './pages/About'; // Importa la página About
import Animal from './pages/Animal'; // Importa la página Animal
import AnimalList from './pages/AnimalList'; // Importa la página AnimalList
import Enfermedades from './pages/Enfermedades'; // Importa la página Enfermedades
import EnfermedadList from './pages/EnfermedadList'; // Importa la página EnfermedadList
import Productos from './pages/Productos'; // Importa la página Productos
import ProductoList from './pages/ProductoList'; // Importa la página ProductoList
import Login from './pages/login'; // Importa la página Login
import PreguntaForm from './pages/PreguntasIA'; // Importa la página PreguntasIA
import PrivateRoute from './pages/PrivateRoute'; // Importa el componente de rutas privadas

import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa los estilos de Font Awesome

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio de sesión como ruta predeterminada */}
        <Route path="/Login" element={<Login />} /> {/* Ruta pública para la página de inicio de sesión */}

        {/* Rutas públicas */}
        <Route path="/" element={<About />} /> {/* Ruta pública para la página About, accesible sin autenticación */}
        <Route path="/about" element={<About />} /> {/* Otra ruta pública para la misma página About */}

        {/* Rutas protegidas */}
        {/* Usamos el componente PrivateRoute para proteger rutas que requieren autenticación */}
        <Route path="/Home" element={<PrivateRoute element={Home} />} />
        <Route path="/Animales" element={<PrivateRoute element={Animal} />} />
        <Route path="/AnimalList" element={<PrivateRoute element={AnimalList} />} />
        <Route path="/Enfermedades" element={<PrivateRoute element={Enfermedades} />} />
        <Route path="/EnfermedadList" element={<PrivateRoute element={EnfermedadList} />} />
        <Route path="/Productos" element={<PrivateRoute element={Productos} />} />
        <Route path="/ProductoList" element={<PrivateRoute element={ProductoList} />} />
        <Route path="/PreguntaIA" element={<PrivateRoute element={PreguntaForm} />} />
      </Routes>
    </Router>
  );
}

export default App;
