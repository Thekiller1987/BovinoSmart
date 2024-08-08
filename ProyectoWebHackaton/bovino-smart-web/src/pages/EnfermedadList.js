import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel, Container, Card, Table } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/EnfermedadList.css';

function EnfermedadList() {
    const [enfermedades, setEnfermedades] = useState([]);
    const [editEnfermedad, setEditEnfermedad] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleEditClick = (enfermedad) => {
        setEditEnfermedad(enfermedad);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta enfermedad?')) {
            try {
                const response = await fetch(`http://localhost:5000/crud/enfermedades/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setEnfermedades(enfermedades.filter(enf => enf.idEnfermedades !== id));
                } else {
                    throw new Error('Error al eliminar la enfermedad');
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleUpdateEnfermedad = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/crud/enfermedades/${editEnfermedad.idEnfermedades}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editEnfermedad),
            });
            if (response.ok) {
                const updatedEnfermedad = await response.json();
                setEnfermedades(enfermedades.map(enf => enf.idEnfermedades === updatedEnfermedad.idEnfermedades ? updatedEnfermedad : enf));
                setShowEditModal(false);
                await fetchEnfermedades();
            } else {
                throw new Error('Error al actualizar la enfermedad');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditEnfermedad(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredEnfermedades = enfermedades.filter(enfermedad => 
        enfermedad.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="body-enfermedad-list">
            <Header className="header-enfermedad-list" />
            <Container>
                <Card className="mt-3 table-container">
                    <Card.Body>
                        <Card.Title>Listado de Enfermedades</Card.Title>
                        <div className="search-container">
                            <Form.Control
                                type="text"
                                placeholder="Buscar enfermedades"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Button variant="primary" className="btn-primary">Buscar</Button>
                        </div>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnfermedades.map(enfermedad => (
                                    <tr key={enfermedad.idEnfermedades}>
                                        <td>{enfermedad.idEnfermedades}</td>
                                        <td>{enfermedad.nombre}</td>
                                        <td>{enfermedad.descripcion}</td>
                                        <td className="button-container">
                                            <Button variant="warning" onClick={() => handleEditClick(enfermedad)}>Editar</Button>
                                            <Button variant="danger" onClick={() => handleDeleteClick(enfermedad.idEnfermedades)}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title>Editar Enfermedad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateEnfermedad}>
                        <Row className="g-3">
                            <Col sm="12">
                                <FloatingLabel controlId="nombre" label="Nombre">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre de la enfermedad"
                                        name="nombre"
                                        value={editEnfermedad?.nombre || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="descripcion" label="Descripción">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ingrese la descripción de la enfermedad"
                                        name="descripcion"
                                        value={editEnfermedad?.descripcion || ''}
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

export default EnfermedadList;
