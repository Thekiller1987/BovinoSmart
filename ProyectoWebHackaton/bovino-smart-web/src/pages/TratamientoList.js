import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel, Container, Card, Table } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/TratamientoList.css';

function TratamientoList() {
    const [tratamientos, setTratamientos] = useState([]);
    const [editTratamiento, setEditTratamiento] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTratamientos = async () => {
        try {
            const response = await fetch('http://localhost:5000/crud/tratamientos');
            if (response.ok) {
                const data = await response.json();
                setTratamientos(data);
            } else {
                throw new Error('Error al recuperar los tratamientos');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchTratamientos();
    }, []);

    const handleEditClick = (tratamiento) => {
        setEditTratamiento(tratamiento);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este tratamiento?')) {
            try {
                const response = await fetch(`http://localhost:5000/crud/tratamientos/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setTratamientos(tratamientos.filter(trat => trat.idTratamientos !== id));
                } else {
                    throw new Error('Error al eliminar el tratamiento');
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleUpdateTratamiento = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/crud/tratamientos/${editTratamiento.idTratamientos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTratamiento),
            });
            if (response.ok) {
                const updatedTratamiento = await response.json();
                setTratamientos(tratamientos.map(trat => trat.idTratamientos === updatedTratamiento.idTratamientos ? updatedTratamiento : trat));
                setShowEditModal(false);
                await fetchTratamientos();
            } else {
                throw new Error('Error al actualizar el tratamiento');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditTratamiento(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTratamientos = tratamientos.filter(tratamiento => 
        tratamiento.tipo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="body-tratamiento-list">
            <Header className="header-tratamiento-list" />
            <Container>
                <Card className="mt-3 table-container">
                    <Card.Body>
                        <Card.Title>Listado de Tratamientos</Card.Title>
                        <div className="search-container">
                            <Form.Control
                                type="text"
                                placeholder="Buscar tratamientos"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Button variant="primary" className="btn-primary">Buscar</Button>
                        </div>
                        <div className="table-responsive">
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Dosis</th>
                                        <th>Motivo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTratamientos.map(tratamiento => (
                                        <tr key={tratamiento.idTratamientos}>
                                            <td>{tratamiento.idTratamientos}</td>
                                            <td>{tratamiento.tipo}</td>
                                            <td>{tratamiento.dosis}</td>
                                            <td>{tratamiento.motivo}</td>
                                            <td className="button-container">
                                                <Button variant="warning" onClick={() => handleEditClick(tratamiento)}>Editar</Button>
                                                <Button variant="danger" onClick={() => handleDeleteClick(tratamiento.idTratamientos)}>Eliminar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title>Editar Tratamiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateTratamiento}>
                        <Row className="g-3">
                            <Col sm="12">
                                <FloatingLabel controlId="tipo" label="Tipo">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el tipo de tratamiento"
                                        name="tipo"
                                        value={editTratamiento?.tipo || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="dosis" label="Dosis">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la dosis"
                                        name="dosis"
                                        value={editTratamiento?.dosis || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="motivo" label="Motivo">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ingrese el motivo del tratamiento"
                                        name="motivo"
                                        value={editTratamiento?.motivo || ''}
                                        onChange={handleInputChange}
                                    />
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3">
                            Actualizar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default TratamientoList;
