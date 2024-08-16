import React, { useState } from 'react';
import Header from '../components/Header';
function PreguntaForm() {
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/crudDb2/preguntar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pregunta }),
            });
            const data = await res.json();
            setRespuesta(data.respuesta);
        } catch (error) {
            console.error('Error al enviar la pregunta:', error);
            setRespuesta('Hubo un error al procesar la pregunta.');
        }
    };
    
    return (
        
        <div>
              <Header />
            <h2>Preguntar a la IA</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    placeholder="Escribe tu pregunta"
                    style={{ width: '80%', padding: '10px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Preguntar</button>
            </form>
            {respuesta && (
                <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <strong>Respuesta:</strong> {respuesta}
                </div>
            )}
        </div>
    );
}

export default PreguntaForm;
