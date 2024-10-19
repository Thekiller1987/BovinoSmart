import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Card } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/EnfermedadList.css';
import SearchIcon from '../Iconos/fi-rr-search.png';
import CustomModal from '../components/CustomModal';

function EnfermedadList() {
    const [enfermedades, setEnfermedades] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedEnfermedad, setSelectedEnfermedad] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableEnfermedad, setEditableEnfermedad] = useState(null);

    const fetchEnfermedades = async () => {
        try {
            const response = await fetch('http://localhost:5000/crud/enfermedades');
            if (response.ok) {
                const data = await response.json();
                setEnfermedades(data);
            } else {
                throw new Error('Error al recuperar las enfermedades');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchEnfermedades();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleShowModal = (enfermedad) => {
        setSelectedEnfermedad(enfermedad);
        setEditableEnfermedad(enfermedad);
        setShowModal(true);
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableEnfermedad((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setEditableEnfermedad((prev) => ({ ...prev, imagen: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateClick = async () => {
        try {
            const response = await fetch(`http://localhost:5000/crud/enfermedades/${editableEnfermedad.idEnfermedades}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editableEnfermedad),
            });

            if (response.ok) {
                setEnfermedades((prev) =>
                    prev.map((enfermedad) =>
                        enfermedad.idEnfermedades === editableEnfermedad.idEnfermedades ? editableEnfermedad : enfermedad
                    )
                );
                setIsEditing(false);
            } else {
                throw new Error('Error al actualizar la enfermedad');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteClick = async () => {
        if (!editableEnfermedad) return;

        try {
            const response = await fetch(`http://localhost:5000/crud/enfermedades/${editableEnfermedad.idEnfermedades}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setEnfermedades((prev) =>
                    prev.filter((enfermedad) => enfermedad.idEnfermedades !== editableEnfermedad.idEnfermedades)
                );
                setShowModal(false);
            } else {
                throw new Error('Error al eliminar la enfermedad');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredEnfermedades = enfermedades.filter((enfermedad) =>
        enfermedad.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="body-enfermedad-list">
            <Header className="header-enfermedad-list" />
            <Container>
                {/* Barra de búsqueda */}
                <div className="search-containers">
                    <div className="search-input-wrapper">
                        <img src={SearchIcon} alt="Buscar" className="search-icon" />
                        <Form.Control
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <Button variant="primary" className="btn-primary">Buscar</Button>
                </div>

                {/* Mostrar enfermedades como tarjetas */}
                <div className="enfermedades-cards-container">
                    {filteredEnfermedades.length > 0 ? (
                        filteredEnfermedades.map((enfermedad) => (
                            <Card key={enfermedad.idEnfermedades} className="enfermedad-card" onClick={() => handleShowModal(enfermedad)}>
                                <Card.Body>
                                    <Card.Title>{enfermedad.nombre}:</Card.Title>
                                    <Card.Img variant="bottom" src={enfermedad.imagen} alt={enfermedad.nombre} />
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="no-enfermedades">No se encontraron enfermedades.</p>
                    )}
                </div>

                {/* Modal para mostrar detalles de la enfermedad */}
                <CustomModal show={showModal} onClose={handleCloseModal}>
                    <div className="tituloenfermedad">
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={editableEnfermedad?.nombre}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <h4>{editableEnfermedad?.nombre}</h4>
                        )}
                    </div>

                    <div className="enfermedad-modal-section-container">
                        <div className="enfermedad-modal-section">
                            <h5 className="enfermedad-title">Descripción:</h5>
                            <div className="enfermedad-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        as="textarea"
                                        name="descripcion"
                                        value={editableEnfermedad?.descripcion}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableEnfermedad?.descripcion}</p>
                                )}
                            </div>
                        </div>
                        <div className="enfermedad-modal-section">
                            <h5 className="enfermedad-title">Síntomas:</h5>
                            <div className="enfermedad-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        as="textarea"
                                        name="sintomas"
                                        value={editableEnfermedad?.sintomas}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableEnfermedad?.sintomas}</p>
                                )}
                            </div>
                        </div>
                        <div className="enfermedad-modal-section">
                            <h5 className="enfermedad-title">Modo de Transmisión:</h5>
                            <div className="enfermedad-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        as="textarea"
                                        name="modotrasmision"
                                        value={editableEnfermedad?.modotrasmision}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableEnfermedad?.modotrasmision}</p>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="enfermedad-modal-section">
                                <h5 className="enfermedad-title">Imagen:</h5>
                                <div className="enfermedad-info-box">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleImageChange}
                                    />
                                    {editableEnfermedad?.imagen && (
                                        <img
                                            src={editableEnfermedad.imagen}
                                            alt="Vista previa"
                                            style={{ width: '100px', height: '100px', marginTop: '10px' }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-buttons-container">
                        {isEditing ? (
                            <>
                                <Button className="btn-update" onClick={handleUpdateClick}>Actualizar</Button>
                                <Button variant="danger" className="btn-delete" onClick={handleDeleteClick}>Eliminar</Button>
                            </>
                        ) : (
                            <Button className="btn-edit" onClick={handleEditClick}>Editar</Button>
                        )}
                         <Button variant="danger" className="btn-delete" onClick={handleDeleteClick}>Eliminar</Button>
                    </div>
                </CustomModal>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </Container>
        </div>
    );
}

export default EnfermedadList;
