import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeaderLogin.css'; // Archivo CSS personalizado
import logo from '../logo/Logo.png'; // Ruta correcta de tu logo
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap

const HeaderLogin = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <header className="HeaderLogin">
      <div className="container-fluid d-flex justify-content-between align-items-center p-3">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="BoVinoSmart Logo" className="header-logo-image me-2" />
          <h1 className="header-logo m-0">BoVinoSmart</h1>
        </div>
        {/* Botón de login */}
        <button onClick={handleLoginClick} className="header-button btn btn-success">
          <i className="fas fa-user header-icon me-2"></i> Login
        </button>
      </div>
    </header>
  );
};

export default HeaderLogin;
