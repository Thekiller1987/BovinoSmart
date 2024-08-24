import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel, Container, Card, Table } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/ProductoList.css';

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [editProducto, setEditProducto] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchProductos = async () => {
        try {
            const response = await fetch('http://localhost:5000/crud/productos');
            if (response.ok) {
                const data = await response.json();
                setProductos(data);
            } else {
                throw new Error('Error al recuperar los productos');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleEditClick = (producto) => {
        setEditProducto({
            ...producto,
            es_tratamiento: producto.es_tratamiento === 1 || producto.es_tratamiento === true // Convertir a booleano
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const response = await fetch(`http://localhost:5000/crud/productos/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setProductos(productos.filter(prod => prod.idProductos !== id));
                } else {
                    throw new Error('Error al eliminar el producto');
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleUpdateProducto = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/crud/productos/${editProducto.idProductos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editProducto),
            });
            if (response.ok) {
                const updatedProducto = await response.json();
                setProductos(productos.map(prod => prod.idProductos === updatedProducto.idProductos ? updatedProducto : prod));
                setShowEditModal(false);
                await fetchProductos();
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditProducto(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProductos = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="body-producto-list">
            <Header className="header-producto-list" />
            <Container>
                <Card className="mt-3 table-container">
                    <Card.Body>
                        <Card.Title>Listado de Productos</Card.Title>
                        <div className="search-container">
                            <Form.Control
                                type="text"
                                placeholder="Buscar productos"
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
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Dosis Recomendada</th>
                                        <th>Frecuencia de Aplicación</th>
                                        <th>Es Tratamiento</th>
                                        <th>Motivo</th>
                                        <th>Notas</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProductos.map(producto => (
                                        <tr key={producto.idProductos}>
                                            <td>{producto.idProductos}</td>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.tipo}</td>
                                            <td>{producto.dosis_recomendada}</td>
                                            <td>{producto.frecuencia_aplicacion}</td>
                                            <td>{producto.es_tratamiento ? 'Sí' : 'No'}</td> {/* Mostrar "Sí" en lugar de 1 */}
                                            <td>{producto.motivo}</td>
                                            <td>{producto.notas}</td>
                                            <td className="button-container">
                                                <Button variant="warning" onClick={() => handleEditClick(producto)}>Editar</Button>
                                                <Button variant="danger" onClick={() => handleDeleteClick(producto.idProductos)}>Eliminar</Button>
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
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateProducto}>
                        <Row className="g-3">
                            <Col sm="12">
                                <FloatingLabel controlId="nombre" label="Nombre">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre del producto"
                                        name="nombre"
                                        value={editProducto?.nombre || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="tipo" label="Tipo">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el tipo del producto"
                                        name="tipo"
                                        value={editProducto?.tipo || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="dosis_recomendada" label="Dosis Recomendada">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la dosis recomendada"
                                        name="dosis_recomendada"
                                        value={editProducto?.dosis_recomendada || ''}
                                        onChange={handleInputChange}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="frecuencia_aplicacion" label="Frecuencia de Aplicación">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la frecuencia de aplicación"
                                        name="frecuencia_aplicacion"
                                        value={editProducto?.frecuencia_aplicacion || ''}
                                        onChange={handleInputChange}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <Form.Check
                                    type="checkbox"
                                    id="es_tratamiento"
                                    label="¿Es un tratamiento?"
                                    name="es_tratamiento"
                                    checked={editProducto?.es_tratamiento || false}
                                    onChange={handleInputChange}
                                />
                            </Col>
                            {editProducto?.es_tratamiento && (
                                <Col sm="12">
                                    <FloatingLabel controlId="motivo" label="Motivo del Tratamiento">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el motivo del tratamiento"
                                            name="motivo"
                                            value={editProducto?.motivo || ''}
                                            onChange={handleInputChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                            )}
                            <Col sm="12">
                                <FloatingLabel controlId="notas" label="Notas">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ingrese notas adicionales"
                                        name="notas"
                                        value={editProducto?.notas || ''}
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

export default ProductoList;
