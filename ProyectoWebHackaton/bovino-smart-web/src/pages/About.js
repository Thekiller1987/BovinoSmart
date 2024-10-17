import React, { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Importa el componente para lazy loading.
import 'react-lazy-load-image-component/src/effects/blur.css'; // Importa el estilo para el efecto blur.
import HeaderLogin from '../components/HeaderLogin'; // Importa el componente HeaderLogin.
import '../styles/About.css'; // Importa los estilos específicos de la página About.
import Typed from 'typed.js'; // Importa la biblioteca Typed.js para la animación de texto.

const About = () => {
  useEffect(() => {
    // Configura el efecto de escritura animada.
    const typed = new Typed('.ityped', {
      strings: ['Bienvenidos', 'Les Saluda', 'BoVinoSmart'], // Textos a escribir.
      typeSpeed: 100, // Velocidad de escritura.
      backSpeed: 90, // Velocidad de borrado.
      startDelay: 500, // Retraso antes de iniciar la escritura.
      backDelay: 1000, // Retraso antes de iniciar el borrado.
      loop: true, // Permite la repetición infinita.
      showCursor: true, // Muestra el cursor.
    });






 // Configura la transición de imágenes
 const images = document.querySelectorAll('.image-slider img'); // Selecciona todas las imágenes en el contenedor del slider.
 let currentIndex = 0; // Inicializa el índice de la imagen actual.

 // Función para mostrar la imagen actual del slider.
 const showImage = (index) => {
   images.forEach((img, i) => {
     img.classList.toggle('active', i === index); // Activa la clase 'active' solo para la imagen actual.
   });
 };

 // Función para avanzar a la siguiente imagen del slider.
 const nextImage = () => {
   currentIndex = (currentIndex + 1) % images.length; // Calcula el índice de la siguiente imagen.
   showImage(currentIndex); // Muestra la siguiente imagen.
 };

 // Configura un intervalo para cambiar de imagen cada 3 segundos.
 const intervalId = setInterval(nextImage, 3000);

 // Limpia los recursos cuando el componente se desmonta.
 return () => {
   typed.destroy(); // Destruye la instancia de Typed.js.
   clearInterval(intervalId); // Limpia el intervalo de cambio de imagen.
 };



  
  
  }, []);

  return (
    <div className="About">
      <HeaderLogin /> {/* Renderiza el componente HeaderLogin. */}
      <div className="Primera_Imagen"></div> {/* Imagen de fondo decorativa. */}
      <h1 className="ityped">Bienvenidos</h1> {/* Texto animado por Typed.js. */}
      <h2>
        <span className="Bovino-texto">BoVinoSmart</span>
        <p className="Descripcion">
          {"BoVinoSmart es una herramienta avanzada de trazabilidad ganadera diseñada para mejorar la gestión y el control de los rebaños..."}
        </p>
      </h2>

      <div className="Franja_Enmedio"></div> {/* Barra separadora visual. */}

      <div className="franja-verde">
        <div className="info-content">
          {/* Contenedor de la primera imagen con lazy loading */}
          <div className="image-container">
            <LazyLoadImage
              src={require('../imagenes/vacafo2.png')} // Ruta de la imagen.
              alt="Descripción de la imagen"
              effect="blur" // Efecto de desenfoque al cargar.
            />
          </div>

          {/* Sección de información con iconos */}
          <div className="info-section">
            <div className="info-box">
              <LazyLoadImage
                src={require('../Iconos/vaca.png')}
                alt="Monitoreo de Salud"
                effect="blur" // Efecto de desenfoque al cargar.
                className="icono-info"
              />
              <h3>Monitoreo de Salud</h3>
              <p>Controla la salud de tus animales en tiempo real.</p>
            </div>
            <div className="info-box">
              <LazyLoadImage
                src={require('../Iconos/historial-medico.png')}
                alt="Gestión de Tratamientos"
                effect="blur"
                className="icono-info"
              />
              <h3>Gestión de Tratamientos</h3>
              <p>Administra y organiza los tratamientos de tus rebaños.</p>
            </div>
            <div className="info-box">
              <LazyLoadImage
                src={require('../Iconos/ubre.png')}
                alt="Control de Producción"
                effect="blur"
                className="icono-info"
              />
              <h3>Control de Producción</h3>
              <p>Monitorea la producción de leche y otros productos.</p>
            </div>
          </div>

          {/* Contenedor de la segunda imagen con lazy loading */}
          <div className="image-container flipped">
            <LazyLoadImage
              src={require('../imagenes/vacafo2.png')}
              alt="Descripción de la imagen"
              effect="blur"
            />
          </div>
        </div>
      </div>

        {/* Contenedor del slider de imágenes. */}
        <div className="image-slider">
        <img src={require('../imagenes/chamba.jpg')} alt="Imagen 1" className="active" />
        <img src={require('../imagenes/Ganado2xd.jpg')} alt="Imagen 2" />
        <img src={require('../imagenes/vaquitas.jpg')} alt="Imagen 3" />
      </div>

      {/* Iconos de redes sociales */}
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
