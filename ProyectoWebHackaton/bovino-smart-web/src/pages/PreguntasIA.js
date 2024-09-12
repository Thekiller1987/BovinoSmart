import React, { useState } from 'react'; // Importa React y el hook useState.
import Header from '../components/Header'; // Importa el componente Header.
import '../styles/PreguntaForm.css'; // Importa los estilos CSS personalizados.
import '../styles/style.css'; // Importa estilos adicionales.
import machineRings from '../machinesvg/machinering.png'; // Importa las imágenes de la interfaz.
import machineligth from '../machinesvg/machine-lights.png'; // Importa las imágenes de la interfaz.

function PreguntaForm() {
    // Estados para manejar la pregunta, respuesta y efectos visuales.
    const [pregunta, setPregunta] = useState(''); // Estado para la pregunta ingresada por el usuario.
    const [respuesta, setRespuesta] = useState(''); // Estado para la respuesta proporcionada por la API.
    const [efectosActivos, setEfectosActivos] = useState(false); // Estado para manejar la activación/desactivación de los efectos visuales.

    // Función para alternar los efectos visuales.
    const toggleEfectos = () => {
        setEfectosActivos(!efectosActivos); // Cambia el estado de efectos entre activo y desactivo.
    };

    // Función para manejar el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.

        try {
            // Realiza una solicitud POST al servidor para obtener la respuesta a la pregunta.
            const res = await fetch('http://localhost:5000/crudDb2/preguntar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pregunta }), // Envía la pregunta en formato JSON.
            });

            const data = await res.json(); // Convierte la respuesta en formato JSON.
            setRespuesta(data.respuesta); // Actualiza el estado con la respuesta recibida.
        } catch (error) {
            console.error('Error al enviar la pregunta:', error); // Maneja errores en la solicitud.
            setRespuesta('Hubo un error al procesar la pregunta.'); // Muestra un mensaje de error al usuario.
        }
    };

    return (
        <div>
            <Header /> {/* Renderiza el componente de encabezado. */}
            <div className='banner'>
                
                <div className="circuit-art">
                    <img src="https://www.yudiz.com/codepen/artificial-intelligence/images/GoodArtwork.svg" alt="GoodArtwork" />
                </div>

                {/* Contenedor para los efectos visuales de la máquina */}
                <div className="machine-art">
                    <div className={`machine-art-container ${efectosActivos ? 'active' : ''}`}>
                        <img src={machineRings} alt="Machine Art" />
                        <div className={`machine-lights-container ${efectosActivos ? 'active' : ''}`}>
                            <img src={machineligth} alt="Machine Lights" />
                        </div>
                    </div>
                </div>

                {/* Más elementos visuales en el banner */}
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
                                    {/* Botón para activar/desactivar efectos visuales */}
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
                                {/* Formulario para ingresar la pregunta */}
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

                                {/* Contenedor para mostrar la respuesta de la IA */}
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

                {/* Contenedores adicionales para efectos visuales de texto */}
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

export default PreguntaForm; // Exporta el componente para su uso en otros archivos.
