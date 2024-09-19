import React from 'react'; // Importa la librería React.
import { Link } from 'react-router-dom'; // Importa el componente Link de react-router-dom para la navegación.
import Header from '../components/Header'; // Importa el componente Header personalizado.
import '../styles/App.css'; // Importa los estilos personalizados.

function Home() {
  return (
    <div>
      <Header /> {/* Renderiza el componente Header en la parte superior de la página. */}
      {/* Enlace para navegar a la página "about" utilizando react-router-dom */}
      <Link to="/about">Ir a Información</Link>
    </div>
  );
}

export default Home; // Exporta el componente Home para que pueda ser utilizado en otros archivos.
