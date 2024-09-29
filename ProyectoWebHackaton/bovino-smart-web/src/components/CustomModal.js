import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/CustomModal.css'; // Añade aquí los estilos personalizados

function CustomModal({ show, onClose, children }) {
    useEffect(() => {
        // Función para manejar la tecla "Escape"
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        // Añadir evento keydown al montar
        document.addEventListener('keydown', handleEscape);

        // Limpiar evento al desmontar
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="custom-modal-overlay">
            <div className="custom-modal">
               
                <div className="custom-modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CustomModal;
