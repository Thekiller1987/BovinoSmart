import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Container, Row, Col } from 'react-bootstrap';
import Header from '../components/Header';

function GestionEstadoReproductivo() {
    const [estadosReproductivos, setEstadosReproductivos] = useState([]);
    const [editEstadoReproductivo, setEditEstadoReproductivo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    // Fetch estados reproductivos
    const fetchEstadosReproductivos = async () => {
        try {
            const response = await fetch('http://localhost:5000/crud/estado-reproductivo', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEstadosReproductivos(data);
            } else {
                throw new Error('Error al obtener estados reproductivos');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchEstadosReproductivos();
    }, []);

    const handleEditClick = (estado) => {
        setEditEstadoReproductivo(estado);
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este estado reproductivo?')) {
            try {
                const response = await fetch(`http://localhost:5000/crud/estado-reproductivo/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    setEstadosReproductivos(estadosReproductivos.filter(e => e.idEstadoReproductivo !== id));
                } else {
                    throw new Error('Error al eliminar el estado reproductivo');
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editEstadoReproductivo.idEstadoReproductivo ? 'PUT' : 'POST';
            const url = `http://localhost:5000/crud/estado-reproductivo${editEstadoReproductivo.idEstadoReproductivo ? `/${editEstadoReproductivo.idEstadoReproductivo}` : ''}`;
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editEstadoReproductivo),
            });
            if (response.ok) {
                fetchEstadosReproductivos();
                setShowModal(false);
            } else {
                throw new Error('Error al guardar el estado reproductivo');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditEstadoReproductivo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            <Header />
            <Container>
                <h2>Gestión de Estado Reproductivo</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Animal</th>
                            <th>Ciclo Celo</th>
                            <th>Fecha Último Celo</th>
                            {/* Añade más columnas según lo necesario */}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estadosReproductivos.map(estado => (
                            <tr key={estado.idEstadoReproductivo}>
                                <td>{estado.idEstadoReproductivo}</td>
                                <td>{estado.idAnimal}</td>
                                <td>{estado.ciclo_celo}</td>
                                <td>{estado.fecha_ultimo_celo}</td>
                                {/* Renderiza más campos según lo necesario */}
                                <td>
                                    <Button variant="warning" onClick={() => handleEditClick(estado)}>Editar</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(estado.idEstadoReproductivo)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Estado Reproductivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} controlId="idAnimal">
                            <Form.Label column sm="3">ID Animal</Form.Label>
                            <Col sm="9">
                                <Form.Control
                                    type="number"
                                    name="idAnimal"
                                    value={editEstadoReproductivo?.idAnimal || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        {/* Añade más campos del formulario según sea necesario */}
                        <Button variant="primary" type="submit" className="mt-3">
                            Guardar Cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default GestionEstadoReproductivo;
