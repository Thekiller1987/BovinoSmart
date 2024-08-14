import React, { useEffect } from 'react';
import Header from '../components/Header'; // Asegúrate de que este componente existe y está bien definido
import './About.css';
import Typed from 'typed.js';

const About = () => {
  useEffect(() => {
    const typed = new Typed('.ityped', {
      strings: ['Bienvenidos', 'Les Saluda', 'BoVinoSmarth'], // Puedes cambiar los textos
      typeSpeed: 100,
      backSpeed: 90,
      startDelay: 500,
      backDelay: 1000,
      loop: true,
      showCursor: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="About">
      <Header />
      <div className="Primera_Imagen"></div>
      <h1><span className="ityped"></span></h1>
      <h2>
        <span className="hotel-texto">BoVinoSmarth</span>
        <p className="Descripcion">
          Bienvenido a BoVinoSmarth, tu herramienta avanzada para la trazabilidad ganadera...
          {/* Añade una descripción detallada de tu proyecto aquí */}
        </p>
      </h2>

      <div className="Franja_Enmedio"></div>

      <div className="image-slider">
        <img src="path/to/image1.jpg" alt="Imagen 1" className="active" />
        <img src="path/to/image2.jpg" alt="Imagen 2" />
        <img src="path/to/image3.jpg" alt="Imagen 3" />
      </div>

      <div className="cuadro-fijo">
        <a href="https://www.facebook.com" target="_blank" className="ico1"><i className="fab fa-facebook"></i></a>
        <a href="https://www.twitter.com" target="_blank" className="ico2"><i className="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com" target="_blank" className="ico3"><i className="fab fa-instagram"></i></a>
      </div>
    </div>
  );
};

export default About;
