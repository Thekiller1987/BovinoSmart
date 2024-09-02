import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Animal from './pages/Animal';
import AnimalList from './pages/AnimalList';
import Enfermedades from './pages/Enfermedades';
import EnfermedadList from './pages/EnfermedadList';
import Productos from './pages/Productos';
import ProductoList from './pages/ProductoList';
import Login from './pages/login';
import PreguntaForm from './pages/PreguntasIA';
import PrivateRoute from './pages/PrivateRoute'; // Importa el componente de rutas privadas

import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio de sesión como ruta predeterminada */}
        <Route path="/Login" element={<Login />} />
        {/* Rutas públicas */}
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />

        {/* Rutas protegidas */}
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
