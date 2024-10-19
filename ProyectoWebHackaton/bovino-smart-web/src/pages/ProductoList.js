import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/ProductoList.css';
import SearchIcon from '../Iconos/fi-rr-search.png';
import CustomModal from '../components/CustomModal';

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableProducto, setEditableProducto] = useState(null);

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleShowModal = (producto) => {
        setSelectedProducto(producto);
        setEditableProducto(producto);
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
        setEditableProducto((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setEditableProducto((prev) => ({ ...prev, imagen: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateClick = async () => {
        try {
            const response = await fetch(`http://localhost:5000/crud/productos/${editableProducto.idProductos}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editableProducto),
            });

            if (response.ok) {
                setProductos((prev) =>
                    prev.map((producto) =>
                        producto.idProductos === editableProducto.idProductos ? editableProducto : producto
                    )
                );
                setIsEditing(false);
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteClick = async () => {
        if (!editableProducto) return;

        try {
            const response = await fetch(`http://localhost:5000/crud/productos/${editableProducto.idProductos}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setProductos((prev) =>
                    prev.filter((producto) => producto.idProductos !== editableProducto.idProductos)
                );
                setShowModal(false);
            } else {
                throw new Error('Error al eliminar el producto');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredProductos = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="body-producto-list">
            <div className="decorative-image-2"></div>
            <div className="decorative-image-3"></div>
            <Header className="header-producto-list" />

            <Container>
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

                <div className="productos-cards-container">
                    {filteredProductos.length > 0 ? (
                        filteredProductos.map((producto) => (
                            <Card key={producto.idProductos} className="producto-card" onClick={() => handleShowModal(producto)}>
                                <Card.Body>
                                    <Card.Title>{producto.nombre}</Card.Title>
                                    <Card.Img variant="bottom" src={producto.imagen} alt={producto.nombre} />
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className="no-productos">No se encontraron productos.</p>
                    )}
                </div>

                {/* Modal para mostrar detalles del producto */}
                <CustomModal show={showModal} onClose={handleCloseModal}>
                    <div className="titulo-producto">
                        {isEditing ? (
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={editableProducto?.nombre}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <h4>{editableProducto?.nombre}</h4>
                        )}
                    </div>

                    <div className="producto-modal-section-container">
                        <div className="producto-modal-section">
                            <h5 className="producto-title">Tipo:</h5>
                            <div className="producto-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        type="text"
                                        name="tipo"
                                        value={editableProducto?.tipo}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableProducto?.tipo}</p>
                                )}
                            </div>
                        </div>
                        <div className="producto-modal-section">
                            <h5 className="producto-title">Dosis Recomendada:</h5>
                            <div className="producto-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        type="text"
                                        name="dosis_recomendada"
                                        value={editableProducto?.dosis_recomendada}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableProducto?.dosis_recomendada}</p>
                                )}
                            </div>
                        </div>
                        <div className="producto-modal-section">
                            <h5 className="producto-title">Frecuencia de Aplicación:</h5>
                            <div className="producto-info-box">
                                {isEditing ? (
                                    <Form.Control
                                        type="text"
                                        name="frecuencia_aplicacion"
                                        value={editableProducto?.frecuencia_aplicacion}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{editableProducto?.frecuencia_aplicacion}</p>
                                )}
                            </div>
                        </div>
                        {isEditing && (
                            <div className="producto-modal-section">
                                <h5 className="producto-title">Imagen:</h5>
                                <div className="producto-info-box">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        onChange={handleImageChange}
                                    />
                                    {editableProducto?.imagen && (
                                        <img
                                            src={editableProducto.imagen}
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
        <>
            <Button className="btn-edit" onClick={handleEditClick}>Editar</Button>
            <Button variant="danger" className="btn-delete" onClick={handleDeleteClick}>Eliminar</Button>
        </>
    )}
</div>

                </CustomModal>

                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </Container>
        </div>
    );
}

export default ProductoList;
