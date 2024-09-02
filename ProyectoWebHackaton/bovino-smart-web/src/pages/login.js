import React, { useState } from 'react';
import '../styles/login.css';

const Login = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true); // Activa el estado de carga
    setError(''); // Resetea el mensaje de error

    const formData = {
      nombre_usuario,
      contrasena: password,
    };

    try {
      const response = await fetch('http://localhost:5000/crud/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error);
      setError('Error en la solicitud al servidor');
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Activa el estado de carga
    setError(''); // Resetea el mensaje de error

    const formData = {
      nombre_usuario,
      contrasena: password,
    };

    try {
      const response = await fetch('http://localhost:5000/crud/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Inicio de sesión exitoso');
        // Redirige al usuario a la página principal o dashboard
        window.location.href = '/AnimalList'; // Ajusta la ruta de redirección según tu aplicación
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error);
      setError('Error en la solicitud al servidor');
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  const togglePanel = () => {
    setRightPanelActive(!isRightPanelActive);
  };

  return (
    <div className="login-page">
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container register-container">
          <form onSubmit={handleRegister}>
            <h1 className='TexRegis'>Regístrate aquí</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="form-control">
              <input
                type="text"
                placeholder="Enter username"
                value={nombre_usuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
              <small></small>
              <span></span>
            </div>

            <div className="form-control">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small></small>
              <span></span>
            </div>
            <div className="form-control">
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <small></small>
              <span></span>
            </div>
            <button className='regisBoton' type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>

        <div className="form-container login-container">
          <form onSubmit={handleLogin}>
            <h1 className='LetIniciaSe'>Inicia sesión aquí</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="form-control2">
              <input
                type="text"
                placeholder="Enter username"
                value={nombre_usuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
              <small></small>
              <span></span>
            </div>
            <div className="form-control2">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <small></small>
              <span></span>
            </div>
            <div className="content">
              <div className="checkbox">
                <input type="checkbox" id="checkbox" />
                <label>Recuérdame</label>
              </div>
            </div>
            <button className='botIniSesion' type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="title">Hola <br /> Granjero</h1>
              <p className='Textopequeño'>Si tienes una cuenta, inicia sesión aquí </p>
              <button className="ghost" onClick={togglePanel}>
                Iniciar sesión
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="title">Comienza tu <br /> viaje ahora</h1>
              <button className="ghost" onClick={togglePanel}>
                Registrarse
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
