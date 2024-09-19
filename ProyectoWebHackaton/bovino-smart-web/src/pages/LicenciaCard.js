// src/components/LicenciaCard.js

import React from 'react';

const LicenciaCard = ({ tipo, descripcion, costo, selected, onSelect }) => {
  return (
    <div className={`licencia-card ${selected ? 'selected' : ''}`}>
      <h2>{tipo}</h2>
      <p>{descripcion}</p>
      <p><strong>Costo:</strong> ${costo}</p>
      <button onClick={() => onSelect(tipo)} className="select-button">
        {selected ? 'Seleccionado' : 'Seleccionar'}
      </button>
    </div>
  );
};

export default LicenciaCard;
