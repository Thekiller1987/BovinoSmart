import React, { useState } from 'react';
import '../styles/ActivarLicencia.css'; // Asegúrate de crear este archivo CSS
import Header from '../components/Header';
const ActivarLicencia = () => {
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeError, setMensajeError] = useState(''); // Para manejar mensajes de error
  const idUsuario = localStorage.getItem('userId'); // Obtener el ID del usuario de localStorage

  const handleActivacion = async () => {
    console.log('Activando licencia para el usuario ID:', idUsuario); // Agregado
    setMensaje(''); // Limpiar mensaje previo
    setMensajeError(''); // Limpiar mensaje de error previo

    try {
      const response = await fetch('http://localhost:5000/crud/validar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Incluye el token de autenticación
        },
        body: JSON.stringify({ codigo, idUsuario }), // Enviar el código y el idUsuario
      });

      const data = await response.json();
      console.log(data); // Agregado para verificar la respuesta del servidor

      // Verificar si hay un error en la respuesta
      if (response.ok) {
        setMensaje(data.message); // Mostrar mensaje de éxito
        // Cerrar sesión después de un breve retraso
        setTimeout(() => {
          localStorage.removeItem('token'); // Eliminar el token
          localStorage.removeItem('userRol'); // Eliminar el rol del usuario
          localStorage.removeItem('userId'); // Eliminar el ID del usuario
          alert("Se ha cerrado sesión debido a la activación de la licencia. Por favor, inicia sesión nuevamente."); // Alerta para el usuario
          window.location.href = '/login'; // Redirigir a la página de inicio de sesión
        }, 3000); // Esperar 3 segundos antes de redirigir
      } else {
        setMensajeError(data.error || 'Error al activar la licencia'); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al activar la licencia:', error);
      setMensajeError('Error al activar la licencia'); // Mostrar mensaje de error
    }
  };

  return (
    <div>

      <Header />
      <div className="decorative-image-2"></div> {/* Segunda imagen decorativa */}
      <div className="decorative-image-3"></div> {/* Segunda imagen decorativa */}
      <div className="activar-licencia-container">
        <h1>Activar Licencia</h1>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Introduce el código de activación"
        />
        <button onClick={handleActivacion}>Activar</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        {mensajeError && <p className="mensaje-error">{mensajeError}</p>} {/* Mostrar mensaje de error */}
      </div>

    </div>
  );
};

export default ActivarLicencia;
