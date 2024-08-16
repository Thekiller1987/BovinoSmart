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

    // Código para la transición de imágenes
    const images = document.querySelectorAll('.image-slider img');
    let currentIndex = 0;

    const showImage = (index) => {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
    };

    const nextImage = () => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    };

    const intervalId = setInterval(nextImage, 3000); // Cambiar de imagen cada 3 segundos

    return () => {
      typed.destroy();
      clearInterval(intervalId); // Limpiar el intervalo cuando se desmonte el componente
    };
  }, []);

  return (
    <div className="About">
      <Header />
      <div className="Primera_Imagen"></div>
      <h1><span className="ityped"></span></h1>
      <h2>
        <span className="Bovino-texto">BoVinoSmarth</span>
        <p className="Descripcion">
          Bienvenido a BoVinoSmarth, tu herramienta avanzada para la trazabilidad ganadera...
          {"BoVinoSmarth es una herramienta avanzada de trazabilidad ganadera diseñada para mejorar la gestión y el control de los rebaños. Esta aplicación permite a los productores rastrear la salud, los tratamientos, la producción y otros aspectos críticos de sus animales en tiempo real. Con BoVinoSmarth, se optimiza la toma de decisiones basada en datos, asegurando un manejo más eficiente y sostenible del ganado, lo que contribuye a una producción más saludable y rentable. Ideal para productores ganaderos que buscan modernizar y profesionalizar la gestión de sus operaciones diarias."}
        </p>
      </h2>

      <div className="Franja_Enmedio"></div>

      <div className="info-section">
        <div className="info-box">
          <h3>Monitoreo de Salud</h3>
          <p>Controla la salud de tus animales en tiempo real.</p>
        </div>
        <div className="info-box">
          <h3>Gestión de Tratamientos</h3>
          <p>Administra y organiza los tratamientos de tus rebaños.</p>
        </div>
        <div className="info-box">
          <h3>Control de Producción</h3>
          <p>Monitorea la producción de leche y otros productos.</p>
        </div>
      </div>

      <div className="image-slider">
        <img src={require('../imagenes/chamba.jpg')} alt="Imagen 1" className="active" />
        <img src={require('../imagenes/Ganado2xd.jpg')} alt="Imagen 2" />
        <img src={require('../imagenes/vaquitas.jpg')} alt="Imagen 3" />
      </div>

      <div className="cuadro-fijo">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="ico1">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="ico2">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="ico3">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="ico4">
          <i className="fab fa-tiktok"></i>
        </a>
      </div>

    </div>
  );
};

export default About;
