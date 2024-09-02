import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeaderLogin.css'; // Importa el archivo CSS
import  logo from '../logo/Logo.png'; // Asegúrate de que la ruta sea correcta

const HeaderLogin = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirige a la página de login cuando se hace clic
  };

  return (
    <header className="HeaderLogin">
      <div className="header-container">
      <img src={logo} alt="BoVinoSmart Logo" className="header-logo-image" />
        <h1 className="header-logo">BoVinoSmart</h1>
        <button onClick={handleLoginClick} className="header-button">
          <i className="fas fa-user header-icon"></i> Login
        </button>
      </div>
    </header>
  );
};

export default HeaderLogin;
