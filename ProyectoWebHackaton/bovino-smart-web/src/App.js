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
import Tratamiento from './pages/Tratamiento';
import TratamientoList from './pages/TratamientoList';




function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio de sesión como ruta predeterminada */}
        <Route path="/" element={<Home />} />

        {/* Otras rutas de la aplicación */}
        <Route path="/Home" element={<Home />} />
        
        <Route path="/about" element={<About />} />
        <Route path="/Animales" element={<Animal />} />
        <Route path="/AnimalList" element={<AnimalList />} />
        <Route path="/Enfermedades" element={<Enfermedades />} />
        <Route path="/EnfermedadList" element={<EnfermedadList />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/ProductoList" element={<ProductoList />} />
        <Route path="/Tratamiento" element={<Tratamiento />} />
        <Route path="/TratamientoList" element={<TratamientoList />} />
      </Routes>
    </Router>
  );
}

export default App;
