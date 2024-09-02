import React, { useState } from 'react';
import Header from '../components/Header';
import '../styles/PreguntaForm.css';
import '../styles/style.css';  // Importa los estilos adicionales
import machineRings from '../machinesvg/machinering.png';
import machineligth from '../machinesvg/machine-lights.png';


function PreguntaForm() {
    const [pregunta, setPregunta] = useState('');
    const [respuesta, setRespuesta] = useState('');
    const [efectosActivos, setEfectosActivos] = useState(false);

    const toggleEfectos = () => {
        setEfectosActivos(!efectosActivos);
    };

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
            <div className='banner'>
                
                <div className="circuit-art">
                    <img src="https://www.yudiz.com/codepen/artificial-intelligence/images/GoodArtwork.svg" alt="GoodArtwork" />
                </div>
                <div className="machine-art">
                    <div className={`machine-art-container ${efectosActivos ? 'active' : ''}`}>
                    <img src={machineRings} alt="Machine Art" />
                        <div className={`machine-lights-container ${efectosActivos ? 'active' : ''}`}>
                            <img src={machineligth} alt="Machine Lights" />
                        </div>
                    </div>
                </div>
                <div className="circuit-art red">
                    <img src="https://www.yudiz.com/codepen/artificial-intelligence/images/GoodArtwork-red.svg" alt="GoodArtwork Red" />
                </div>
                <div className="banner-content">
                    <div className="container">
                        <div className="banner-title">
                            <h1>MANOLA</h1>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="blue-content">
                                    <p className="p-lg text-pipe blue-text">IA</p>
                                    <p>Web ganadera</p>
                                    <a href="#" id="play" onClick={toggleEfectos}>
                                        <p className="on">{efectosActivos ? 'EFECTOS ACTIVOS' : 'EFECTOS APAGADOS'}</p>
                                        <p className="off">{efectosActivos ? 'EFECTOS APAGADOS' : 'EFECTOS ACTIVOS'}</p>
                                        <span>
                                            <span className="arrow"></span>
                                            <img src="https://www.yudiz.com/codepen/artificial-intelligence/images/button-circle.svg" alt="button-circle" />
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-9">
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
                        </div>
                    </div>
                </div>
                <div className="boon-bane-container">
                    <div className="boon">
                        <div className="letter-container">
                            <h1 className={efectosActivos ? 'active' : ''}>
                                <span className="letter-b">B</span>
                                <span className='letter-O'>O</span>
                                <span className='letter-VINO'>VINO</span>
                            </h1>
                        </div>
                    </div>
                    <div className="bane">
                        <div className="smart-container">
                            <h1 className={efectosActivos ? 'active' : ''}>
                                <span className='Smartxd'>Smart</span>
                                
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreguntaForm;
