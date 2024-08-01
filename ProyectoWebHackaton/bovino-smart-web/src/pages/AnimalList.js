import React, { useEffect, useState } from 'react';
import '../styles/AnimalList.css'; // Importa tu archivo CSS
import Header from '../components/Header';

function AnimalList() {
    const [animales, setAnimales] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/crud/listarAnimales');
                if (response.ok) {
                    const data = await response.json();
                    setAnimales(data);
                } else {
                    throw new Error('Error al recuperar los datos');
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    };

    const handleCardClick = (animal) => {
        setSelectedAnimal(animal);
    };

    const handleClosePanel = () => {
        setSelectedAnimal(null);
    };

    return (
        <div className="body-animal-list">
            <Header />
            <div className="cards-container-animal-list">
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    animales.map((animal) => (
                        <div key={animal.idAnimal} className="card-animal-list" onClick={() => handleCardClick(animal)}>
                            <img src={animal.imagen} alt={animal.nombre} />
                            <div className="card-content-animal-list">
                                <h3>{animal.nombre}</h3>
                                <p><span className="attribute">Sexo:</span> <span className="value">{animal.sexo}</span></p>
                                <p><span className="attribute">Código ID:</span> <span className="value">{animal.codigo_idVaca}</span></p>
                                <p><span className="attribute">Fecha de Nacimiento:</span> <span className="value">{formatDate(animal.fecha_nacimiento)}</span></p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {selectedAnimal && (
                <div className="detail-panel-animal-list">
                    <div className="detail-header-animal-list">
                        <h2>Detalle del Animal</h2>
                        <button onClick={handleClosePanel} className="close-button-animal-list">X</button>
                    </div>
                    <div className="detail-content-animal-list">
                        <img src={selectedAnimal.imagen} alt={selectedAnimal.nombre} />

                        <div className="detail-column">
                            <h3>{selectedAnimal.nombre}</h3>
                            <div className="detail-section">
                                <p><span className="attribute">Sexo:</span> <span className="value">{selectedAnimal.sexo}</span></p>
                                <p><span className="attribute">Código ID:</span> <span className="value">{selectedAnimal.codigo_idVaca}</span></p>
                                <p><span className="attribute">Fecha de Nacimiento:</span> <span className="value">{formatDate(selectedAnimal.fecha_nacimiento)}</span></p>
                                <p><span className="attribute">Raza:</span> <span className="value">{selectedAnimal.raza}</span></p>
                                <p><span className="attribute">Observaciones:</span> <span className="value">{selectedAnimal.observaciones}</span></p>
                                <p><span className="attribute">Peso Nacimiento:</span> <span className="value">{selectedAnimal.peso_nacimiento} kg</span></p>
                                <p><span className="attribute">Peso Destete:</span> <span className="value">{selectedAnimal.peso_destete} kg</span></p>
                                <p><span className="attribute">Peso Actual:</span> <span className="value">{selectedAnimal.peso_actual} kg</span></p>
                            </div>
                        </div>

                        <div className="detail-column">
                            {selectedAnimal.enfermedades && (
                                <div className="detail-section">
                                    <h4>Historial de Enfermedades</h4>
                                    {selectedAnimal.enfermedades.split(', ').map((enfermedad, index) => (
                                        <p key={index}><span className="attribute">Enfermedad:</span> <span className="value">{enfermedad}</span></p>
                                    ))}
                                    {selectedAnimal.fechas_enfermedad.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha Diagnóstico:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                </div>
                            )}

                            {selectedAnimal.tratamientos && (
                                <div className="detail-section">
                                    <h4>Tratamientos Aplicados</h4>
                                    {selectedAnimal.tratamientos.split(', ').map((tratamiento, index) => (
                                        <p key={index}><span className="attribute">Tratamiento:</span> <span className="value">{tratamiento}</span></p>
                                    ))}
                                    {selectedAnimal.dosis_tratamiento.split(', ').map((dosis, index) => (
                                        <p key={index}><span className="attribute">Dosis:</span> <span className="value">{dosis}</span></p>
                                    ))}
                                    {selectedAnimal.motivos_tratamiento.split(', ').map((motivo, index) => (
                                        <p key={index}><span className="attribute">Motivo:</span> <span className="value">{motivo}</span></p>
                                    ))}
                                    {selectedAnimal.fechas_tratamiento.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha Tratamiento:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                </div>
                            )}

                            {selectedAnimal.productos && (
                                <div className="detail-section">
                                    <h4>Productos Aplicados</h4>
                                    {selectedAnimal.productos.split(', ').map((producto, index) => (
                                        <p key={index}><span className="attribute">Producto:</span> <span className="value">{producto}</span></p>
                                    ))}
                                    {selectedAnimal.dosis_producto.split(', ').map((dosis, index) => (
                                        <p key={index}><span className="attribute">Dosis:</span> <span className="value">{dosis}</span></p>
                                    ))}
                                    {selectedAnimal.fechas_producto.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha Aplicación:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="detail-column-control-bano">
                            {selectedAnimal.fechas_bano && (
                                <div className="detail-section">
                                    <h4>Control de Baños</h4>
                                    {selectedAnimal.fechas_bano.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha de Baño:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                    {selectedAnimal.productos_utilizados_bano.split(', ').map((producto, index) => (
                                        <p key={index}><span className="attribute">Productos Utilizados:</span> <span className="value">{producto}</span></p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnimalList;
