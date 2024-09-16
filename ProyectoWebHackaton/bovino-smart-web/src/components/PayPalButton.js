// src/components/PayPalButton.js
import React, { useEffect } from 'react';

const PayPalButton = ({ amount, onPaymentSuccess }) => {
  useEffect(() => {
    // Elimina cualquier instancia anterior del botón PayPal antes de renderizar uno nuevo
    if (window.paypal && window.paypal.Buttons) {
      // Destruye el botón anterior para poder renderizar uno nuevo
      window.paypal.Buttons().close();
    }

    // Renderizar el botón de PayPal
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'USD', // Especifica la moneda
                value: parseFloat(amount).toFixed(2), // Convierte a cadena con dos decimales
              },
            },
          ],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
         
          onPaymentSuccess(); // Llama a la función proporcionada cuando el pago es exitoso
        });
      },
      onError: (err) => {
        console.error('PayPal error:', err);
        alert('Hubo un error con el pago, por favor inténtelo de nuevo.');
      }
    }).render('#paypal-button-container'); // Asegúrate de que el contenedor tenga el mismo ID
  }, [amount, onPaymentSuccess]); // Asegúrate de que este efecto se ejecute si cambia el monto o la función de éxito

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
