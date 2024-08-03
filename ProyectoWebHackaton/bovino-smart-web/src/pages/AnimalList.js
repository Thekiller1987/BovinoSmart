import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
import '../styles/AnimalList.css'; // Importa tu archivo CSS
import Header from '../components/Header';
import deleteIcon from '../Iconos/trash3.svg'; // Importa el icono con la extensión correcta
import EditIcon from '../Iconos/pencil.svg'; // Importa el icono con la extensión correcta

function AnimalList() {
    const [animales, setAnimales] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [editAnimal, setEditAnimal] = useState(null);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [listaEnfermedades, setListaEnfermedades] = useState([]);
    const [listaTratamientos, setListaTratamientos] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const fetchLists = async () => {
        try {
            const enfermedadesResponse = await fetch('http://localhost:5000/crud/enfermedades');
            const tratamientosResponse = await fetch('http://localhost:5000/crud/tratamientos');
            const productosResponse = await fetch('http://localhost:5000/crud/productos');

            if (enfermedadesResponse.ok && tratamientosResponse.ok && productosResponse.ok) {
                const enfermedadesData = await enfermedadesResponse.json();
                const tratamientosData = await tratamientosResponse.json();
                const productosData = await productosResponse.json();

                setListaEnfermedades(enfermedadesData);
                setListaTratamientos(tratamientosData);
                setListaProductos(productosData);
            } else {
                throw new Error('Error al recuperar las listas');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchData();
        fetchLists();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClosePanel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
            return ''; // Manejar fecha inválida
        }
        return date.toISOString().split('T')[0];
    };

    const handleCardClick = (animal) => {
        setSelectedAnimal(animal);
    };

    const handleEditClick = (animal) => {
        setEditAnimal({
            ...animal,
            fecha_nacimiento: formatDate(animal.fecha_nacimiento),
            enfermedades: animal.enfermedades ? animal.enfermedades.split(', ').map((nombre, index) => ({
                id: listaEnfermedades.find(enf => enf.nombre === nombre)?.idEnfermedades || '',
                fecha: formatDate(animal.fechas_enfermedad.split(', ')[index])
            })) : [],
            tratamientos: animal.tratamientos ? animal.tratamientos.split(', ').map((tipo, index) => ({
                id: listaTratamientos.find(trat => trat.tipo === tipo)?.idTratamientos || '',
                dosis: animal.dosis_tratamiento.split(', ')[index],
                motivo: animal.motivos_tratamiento.split(', ')[index],
                fecha: formatDate(animal.fechas_tratamiento.split(', ')[index])
            })) : [],
            productos: animal.productos ? animal.productos.split(', ').map((nombre, index) => ({
                id: listaProductos.find(prod => prod.nombre === nombre)?.idProductos || '',
                dosis: animal.dosis_producto.split(', ')[index],
                fecha: formatDate(animal.fechas_producto.split(', ')[index])
            })) : [],
            control_banos: animal.fechas_bano ? animal.fechas_bano.split(', ').map((fecha, index) => ({
                fecha: formatDate(fecha),
                productos_utilizados: animal.productos_utilizados_bano.split(', ')[index]
            })) : []
        });
        setShowEditModal(true);
    };

    const handleClosePanel = () => {
        setSelectedAnimal(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [field, index, subfield] = name.split('.');

        if (index !== undefined) {
            setEditAnimal((prevAnimal) => {
                const newArray = [...prevAnimal[field]];
                newArray[index] = {
                    ...newArray[index],
                    [subfield]: value
                };
                return {
                    ...prevAnimal,
                    [field]: newArray
                };
            });
        } else {
            setEditAnimal((prevAnimal) => ({
                ...prevAnimal,
                [name]: value
            }));
        }
    };

    const handleImagenChange = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            setEditAnimal((prevAnimal) => ({
                ...prevAnimal,
                imagen: base64String
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAddField = (field) => {
        setEditAnimal((prevAnimal) => ({
            ...prevAnimal,
            [field]: [...prevAnimal[field], { id: '', fecha: '' }]
        }));
    };

    const handleDeleteAnimal = async (idAnimal) => {
        try {
            setDeleting(true);
            const response = await fetch(`http://localhost:5000/crud/deleteAnimal/${idAnimal}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTimeout(() => {
                    setAnimales(animales.filter(animal => animal.idAnimal !== idAnimal));
                    setSelectedAnimal(null);
                    setDeleting(false);
                }, 1000); // Tiempo para la animación
            } else {
                throw new Error('Error al eliminar el animal');
            }
        } catch (error) {
            setError(error.message);
            setDeleting(false);
        }
    };

    const handleUpdateAnimal = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/crud/updateAnimal/${editAnimal.idAnimal}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editAnimal)
            });
            if (response.ok) {
                const updatedAnimal = await response.json();
                setAnimales(animales.map(animal => animal.idAnimal === updatedAnimal.idAnimal ? updatedAnimal : animal));
                setSelectedAnimal(updatedAnimal);
                setEditAnimal(null); // Limpiar el estado de editAnimal después de actualizar
                // Llama a fetchData y fetchLists después de la actualización exitosa
                await fetchLists();
                await fetchData();

                // Cerrar el modal después de actualizar
                handleCloseEditModal(); // <- Añadir esta línea para cerrar el modal
                handleClosePanel();
            } else {
                throw new Error('Error al actualizar el animal');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredAnimales = animales.filter((animal) => {
        const search = searchQuery.toLowerCase();
        return (
            animal.nombre.toLowerCase().includes(search) ||
            animal.sexo.toLowerCase().includes(search) ||
            animal.codigo_idVaca.toLowerCase().includes(search) ||
            animal.fecha_nacimiento.toLowerCase().includes(search) ||
            animal.raza.toLowerCase().includes(search) ||
            (animal.enfermedades && animal.enfermedades.toLowerCase().includes(search))
        );
    });

    return (
        <div className="body-animal-list">
            <Header />
            <div className="search-container">
                <FloatingLabel controlId="search" label="Buscar">
                    <Form.Control
                        type="text"
                        placeholder="Buscar"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </FloatingLabel>
                <Button variant="primary" className="btn-primary" onClick={fetchData}>Buscar</Button>
            </div>
            <div className="cards-container-animal-list">
                {error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    filteredAnimales.map((animal) => (
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
                <div className={`detail-panel-animal-list ${deleting ? 'moving-out' : ''}`}>
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
                            {selectedAnimal.enfermedades && selectedAnimal.enfermedades.split(', ').length > 0 ? (
                                <div className="detail-section">
                                    <h4>Historial de Enfermedades</h4>
                                    {selectedAnimal.enfermedades.split(', ').map((enfermedad, index) => (
                                        <p key={index}><span className="attribute">Enfermedad:</span> <span className="value">{enfermedad}</span></p>
                                    ))}
                                    {selectedAnimal.fechas_enfermedad.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha Diagnóstico:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                </div>
                            ) : (
                                <div className="detail-section">
                                    <h4>Historial de Enfermedades</h4>
                                    <p>No hay enfermedades registradas.</p>
                                </div>
                            )}
    
                            {selectedAnimal.tratamientos && selectedAnimal.tratamientos.split(', ').length > 0 ? (
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
                            ) : (
                                <div className="detail-section">
                                    <h4>Tratamientos Aplicados</h4>
                                    <p>No hay tratamientos aplicados.</p>
                                </div>
                            )}
    
                            {selectedAnimal.productos && selectedAnimal.productos.split(', ').length > 0 ? (
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
                            ) : (
                                <div className="detail-section">
                                    <h4>Productos Aplicados</h4>
                                    <p>No hay productos aplicados.</p>
                                </div>
                            )}
                        </div>
                        <div className="detail-column-control-bano">
                            {selectedAnimal.fechas_bano && selectedAnimal.fechas_bano.split(', ').length > 0 ? (
                                <div className="detail-section">
                                    <h4>Control de Baños</h4>
                                    {selectedAnimal.fechas_bano.split(', ').map((fecha, index) => (
                                        <p key={index}><span className="attribute">Fecha de Baño:</span> <span className="value">{formatDate(fecha)}</span></p>
                                    ))}
                                    {selectedAnimal.productos_utilizados_bano.split(', ').map((producto, index) => (
                                        <p key={index}><span className="attribute">Productos Utilizados:</span> <span className="value">{producto}</span></p>
                                    ))}
                                </div>
                            ) : (
                                <div className="detail-section">
                                    <h4>Control de Baños</h4>
                                    <p>No hay registros de baños.</p>
                                </div>
                            )}
                        </div>
    
                        <div className="buttons-container">
                            <button onClick={() => handleEditClick(selectedAnimal)} className="edit-button-animal-list">
                                <img src={EditIcon} alt="Editar" style={{ width: '30px', marginRight: '5px' }} />
                            </button>
                            <button onClick={() => handleDeleteAnimal(selectedAnimal.idAnimal)} className="delete-button-animal-list">
                                <img src={deleteIcon} alt="Eliminar" style={{ width: '30px', marginRight: '5px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Animal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateAnimal}>
                        <Row className="g-3">
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="nombre" label="Nombre">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nombre del animal"
                                        name="nombre"
                                        value={editAnimal?.nombre || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="sexo" label="Sexo">
                                    <Form.Select
                                        name="sexo"
                                        value={editAnimal?.sexo || ''}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Seleccione el sexo</option>
                                        <option value="Macho">Macho</option>
                                        <option value="Hembra">Hembra</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <Form.Group controlId="imagen" className="">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg, .png, .jpeg"
                                        size="lg"
                                        name="imagen"
                                        onChange={handleImagenChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="codigo_idVaca" label="Código ID Vaca">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el código ID de la vaca"
                                        name="codigo_idVaca"
                                        value={editAnimal?.codigo_idVaca || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="fecha_nacimiento" label="Fecha de Nacimiento">
                                    <Form.Control
                                        type="date"
                                        placeholder="Ingrese la fecha de nacimiento"
                                        name="fecha_nacimiento"
                                        value={editAnimal?.fecha_nacimiento || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="raza" label="Raza">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese la raza del animal"
                                        name="raza"
                                        value={editAnimal?.raza || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="observaciones" label="Observaciones">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ingrese observaciones"
                                        name="observaciones"
                                        value={editAnimal?.observaciones || ''}
                                        onChange={handleInputChange}
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="peso_nacimiento" label="Peso al Nacer (kg)">
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el peso al nacer"
                                        name="peso_nacimiento"
                                        value={editAnimal?.peso_nacimiento || ''}
                                        onChange={handleInputChange}
                                        step="0.01"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="peso_destete" label="Peso al Destete (kg)">
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el peso al destete"
                                        name="peso_destete"
                                        value={editAnimal?.peso_destete || ''}
                                        onChange={handleInputChange}
                                        step="0.01"
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                                <FloatingLabel controlId="peso_actual" label="Peso Actual (kg)">
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingrese el peso actual"
                                        name="peso_actual"
                                        value={editAnimal?.peso_actual || ''}
                                        onChange={handleInputChange}
                                        step="0.01"
                                    />
                                </FloatingLabel>
                            </Col>
    
                            {/* Sección de Enfermedades */}
                            <Col sm="12">
                                <h5>Historial de Enfermedades</h5>
                                {editAnimal?.enfermedades?.map((enfermedad, index) => (
                                    <Row key={index} className="g-3">
                                        <Col sm="6">
                                            <FloatingLabel controlId={`enfermedad-id-${index}`} label="ID Enfermedad">
                                                <Form.Select
                                                    name={`enfermedades.${index}.id`}
                                                    value={enfermedad.id}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Seleccione una enfermedad</option>
                                                    {listaEnfermedades.map((enf) => (
                                                        <option key={enf.idEnfermedades} value={enf.idEnfermedades}>
                                                            {enf.nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="6">
                                            <FloatingLabel controlId={`enfermedad-fecha-${index}`} label="Fecha Diagnóstico">
                                                <Form.Control
                                                    type="date"
                                                    name={`enfermedades.${index}.fecha`}
                                                    value={enfermedad.fecha}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                ))}
    
                                <Button variant="link" onClick={() => handleAddField('enfermedades')}>Añadir Enfermedad</Button>
                            </Col>
    
                            {/* Sección de Tratamientos */}
                            <Col sm="12">
                                <h5>Tratamientos Aplicados</h5>
                                {editAnimal?.tratamientos?.map((tratamiento, index) => (
                                    <Row key={index} className="g-3">
                                        <Col sm="4">
                                            <FloatingLabel controlId={`tratamiento-id-${index}`} label="ID Tratamiento">
                                                <Form.Select
                                                    name={`tratamientos.${index}.id`}
                                                    value={tratamiento.id}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Seleccione un tratamiento</option>
                                                    {listaTratamientos.map((trat) => (
                                                        <option key={trat.idTratamientos} value={trat.idTratamientos}>
                                                            {trat.tipo}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="4">
                                            <FloatingLabel controlId={`tratamiento-dosis-${index}`} label="Dosis">
                                                <Form.Control
                                                    type="text"
                                                    name={`tratamientos.${index}.dosis`}
                                                    value={tratamiento.dosis}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="4">
                                            <FloatingLabel controlId={`tratamiento-fecha-${index}`} label="Fecha Tratamiento">
                                                <Form.Control
                                                    type="date"
                                                    name={`tratamientos.${index}.fecha`}
                                                    value={tratamiento.fecha}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="link" onClick={() => handleAddField('tratamientos')}>Añadir Tratamiento</Button>
                            </Col>
    
                            {/* Sección de Productos */}
                            <Col sm="12">
                                <h5>Productos Aplicados</h5>
                                {editAnimal?.productos?.map((producto, index) => (
                                    <Row key={index} className="g-3">
                                        <Col sm="4">
                                            <FloatingLabel controlId={`producto-id-${index}`} label="ID Producto">
                                                <Form.Select
                                                    name={`productos.${index}.id`}
                                                    value={producto.id}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Seleccione un producto</option>
                                                    {listaProductos.map((prod) => (
                                                        <option key={prod.idProductos} value={prod.idProductos}>
                                                            {prod.nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="4">
                                            <FloatingLabel controlId={`producto-dosis-${index}`} label="Dosis">
                                                <Form.Control
                                                    type="text"
                                                    name={`productos.${index}.dosis`}
                                                    value={producto.dosis}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="4">
                                            <FloatingLabel controlId={`producto-fecha-${index}`} label="Fecha Aplicación">
                                                <Form.Control
                                                    type="date"
                                                    name={`productos.${index}.fecha`}
                                                    value={producto.fecha}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="link" onClick={() => handleAddField('productos')}>Añadir Producto</Button>
                            </Col>
    
                            {/* Sección de Control de Baños */}
                            <Col sm="12">
                                <h5>Control de Baños</h5>
                                {editAnimal?.control_banos?.map((bano, index) => (
                                    <Row key={index} className="g-3">
                                        <Col sm="6">
                                            <FloatingLabel controlId={`bano-fecha-${index}`} label="Fecha de Baño">
                                                <Form.Control
                                                    type="date"
                                                    name={`control_banos.${index}.fecha`}
                                                    value={bano.fecha}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                        <Col sm="6">
                                            <FloatingLabel controlId={`bano-productos-${index}`} label="Productos Utilizados">
                                                <Form.Control
                                                    type="text"
                                                    name={`control_banos.${index}.productos_utilizados`}
                                                    value={bano.productos_utilizados}
                                                    onChange={handleInputChange}
                                                />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                ))}
                                <Button variant="link" onClick={() => handleAddField('control_banos')}>Añadir Control de Baño</Button>
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

export default AnimalList;
