import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/PreguntaForm.css';


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
        
        <div >
            <Header />
            <h2 className="title">Preguntar a la IA</h2>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    placeholder="Escribe tu pregunta"
                    className="input"
                />
                <button type="submit" className="button">Preguntar</button>
            </form>
            {respuesta && (
                <div className="response-container">
                    <strong className="response-title">Respuesta:</strong> 
                    <p className="response">{respuesta}</p>
                </div>
            )}
        </div>
    );
}

export default PreguntaForm;
