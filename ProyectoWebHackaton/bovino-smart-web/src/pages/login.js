import React, { useState } from 'react'; // Importa React y el hook useState.
import '../styles/login.css'; // Importa los estilos CSS personalizados.
import hoja1 from '../diseño/fi-rr-leaf.png'; // Importa imágenes decorativas.
import hoja2 from '../diseño/fi-rr-feather.png';
import hoja3 from '../diseño/fi-rr-leaf.png'; // Puede usar la misma imagen o diferentes.
import HeaderLogin from '../components/HeaderLogin'; // Importa el componente HeaderLogin personalizado.

const Login = () => {
  // Estados para manejar los datos del formulario y la interfaz.
  const [nombre_usuario, setNombreUsuario] = useState(''); // Estado para el nombre de usuario.
  const [password, setPassword] = useState(''); // Estado para la contraseña.
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar la contraseña.
  const [isRightPanelActive, setRightPanelActive] = useState(false); // Estado para manejar la visibilidad de los paneles.
  const [error, setError] = useState(''); // Estado para mostrar mensajes de error.
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga de la solicitud.

  // Maneja el proceso de registro de un usuario.
  const handleRegister = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.

    // Verifica si las contraseñas coinciden.
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true); // Establece el estado de carga a verdadero.
    setError(''); // Reinicia el mensaje de error.

    // Datos del formulario para enviar al servidor.
    const formData = {
      nombre_usuario,
      contrasena: password,
    };

    try {
      // Realiza una solicitud POST al servidor para registrar al usuario.
      const response = await fetch('http://localhost:5000/crud/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convierte los datos en formato JSON.
      });

      // Verifica si la solicitud fue exitosa.
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Muestra un mensaje de éxito.
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error en el registro'); // Muestra un mensaje de error.
      }
    } catch (error) {
      console.error('Error en la solicitud de registro:', error); // Maneja el error en la solicitud.
      setError('Error en la solicitud al servidor'); // Muestra un mensaje de error.
    } finally {
      setIsLoading(false); // Restablece el estado de carga a falso.
    }
  };

  // Maneja el proceso de inicio de sesión de un usuario.
  const handleLogin = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario.

    setIsLoading(true); // Establece el estado de carga a verdadero.
    setError(''); // Reinicia el mensaje de error.

    // Datos del formulario para enviar al servidor.
    const formData = {
      nombre_usuario,
      contrasena: password,
    };

    try {
      // Realiza una solicitud POST al servidor para iniciar sesión.
      const response = await fetch('http://localhost:5000/crud/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convierte los datos en formato JSON.
      });

      // Verifica si la solicitud fue exitosa.
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Guarda el token en el almacenamiento local.
        alert('Inicio de sesión exitoso'); // Muestra un mensaje de éxito.
        window.location.href = '/AnimalList'; // Redirige a la lista de animales (ajusta la ruta según tu aplicación).
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error en el inicio de sesión'); // Muestra un mensaje de error.
      }
    } catch (error) {
      console.error('Error en la solicitud de inicio de sesión:', error); // Maneja el error en la solicitud.
      setError('Error en la solicitud al servidor'); // Muestra un mensaje de error.
    } finally {
      setIsLoading(false); // Restablece el estado de carga a falso.
    }
  };

  // Cambia el estado del panel activo.
  const togglePanel = () => {
    setRightPanelActive(!isRightPanelActive); // Alterna entre los paneles de registro e inicio de sesión.
  };

  return (
    <div>
      <HeaderLogin /> {/* Renderiza el componente de encabezado del login. */}
      <div className="login-page">
        {/* Imágenes decorativas en la página de login */}
        <img src={hoja1} alt="Hoja decorativa 1" className="hoja hoja-1" />
        <img src={hoja2} alt="Hoja decorativa 2" className="hoja hoja-2" />
        <img src={hoja3} alt="Hoja decorativa 3" className="hoja hoja-3" />

        {/* Contenedor principal del formulario de login y registro */}
        <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
          {/* Formulario de registro */}
          <div className="form-container register-container">
            <form onSubmit={handleRegister}>
              <h1 className='TexRegis'>Regístrate aquí</h1>
              {error && <p className="error-message">{error}</p>} {/* Muestra mensajes de error */}
              {/* Campo de entrada para el nombre de usuario */}
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

              {/* Campo de entrada para la contraseña */}
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

              {/* Campo de entrada para confirmar la contraseña */}
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
              {/* Botón para enviar el formulario de registro */}
              <button className='regisBoton' type="submit" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
          </div>

          {/* Formulario de inicio de sesión */}
          <div className="form-container login-container">
            <form onSubmit={handleLogin}>
              <h1 className='LetIniciaSe'>Inicia sesión aquí</h1>
              {error && <p className="error-message">{error}</p>} {/* Muestra mensajes de error */}
              {/* Campo de entrada para el nombre de usuario */}
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

              {/* Campo de entrada para la contraseña */}
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

              {/* Opciones adicionales del formulario de inicio de sesión */}
              <div className="content">
                <div className="checkbox">
                  <input type="checkbox" id="checkbox" />
                  <label>Recuérdame</label>
                </div>
              </div>

              {/* Botón para enviar el formulario de inicio de sesión */}
              <button className='botIniSesion' type="submit" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          {/* Contenedor para los paneles superpuestos (overlay) */}
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
    </div>
  );
};

export default Login; // Exporta el componente Login para su uso en otros archivos.
