import React, { useState, useEffect } from 'react';
import LicenciaCard from '../pages/LicenciaCard';
import '../styles/SelectLicencia.css';
import PayPalButton from '../components/PayPalButton';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const SelectLicencia = () => {
  const [licencias, setLicencias] = useState([]);
  const [selectedLicencia, setSelectedLicencia] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    const fetchLicencias = async () => {
      try {
        const response = await fetch('http://localhost:5000/crud/licencias');
        const data = await response.json();
        setLicencias(data);
      } catch (err) {
        console.error('Error al cargar las licencias:', err);
        setError('Error al cargar las licencias');
      }
    };

    fetchLicencias();
  }, []);

  const handleSelectLicencia = (tipo, costo) => {
    setSelectedLicencia(tipo);
    setAmount(costo);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedLicencia) {
      setError('Debe seleccionar una licencia');
      return;
    }
  
    const userRol = localStorage.getItem('userRol');
  
    if (!userRol || !userRol.includes('Ganadero')) {
      setError('No tienes permisos para actualizar la licencia');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/crud/update-licencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tipoLicencia: selectedLicencia }),
      });
  
      if (response.ok) {
        // Muestra el modal de éxito
        setIsModalOpen(true);
        
        // Espera 3 segundos antes de cerrar la sesión y redirigir
        setTimeout(() => {
          localStorage.removeItem('token'); // Elimina el token del almacenamiento local
          navigate('/Login'); // Redirige al usuario a la página de inicio de sesión
        }, 3000); 
        
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al actualizar la licencia');
      }
    } catch (error) {
      console.error('Error al actualizar la licencia:', error);
      setError('Error en la solicitud al servidor');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      <Header />
      <div className="select-licencia-page">
        {error && <p className="error-message">{error}</p>}
        <div className="licencias-container">
          {licencias.map((licencia) => (
            <LicenciaCard
              key={licencia.idLicencia}
              tipo={licencia.tipo}
              descripcion={licencia.descripcion}
              costo={licencia.costo}
              selected={licencia.tipo === selectedLicencia}
              onSelect={() => handleSelectLicencia(licencia.tipo, licencia.costo)}
            />
          ))}
        </div>

        {/* Muestra el botón de PayPal si se ha seleccionado una licencia */}
        {selectedLicencia && (
          <div className="paypal-container">
            <PayPalButton amount={amount} onPaymentSuccess={handlePaymentSuccess} />
          </div>
        )}

        {/* Modal para mostrar el éxito del pago */}
        {isModalOpen && (
          <div className="modalito">
            <div className="modal-content">
              <h2>Pago realizado con éxito</h2>
              <p>Tu licencia ha sido actualizada. La sesión se cerrará en breve.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectLicencia;
