import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Animal from './pages/Animal';
import AnimalList from './pages/AnimalList';




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
      </Routes>
    </Router>
  );
}

export default App;
