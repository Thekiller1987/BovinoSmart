import React, { useEffect, useState } from 'react'; // Importa React y los hooks useEffect y useState.
import { Modal, Button, Form, Row, Col, FloatingLabel, Container, Card, Table } from 'react-bootstrap'; // Importa componentes de React Bootstrap para la interfaz.
import Header from '../components/Header'; // Importa el componente Header personalizado.


function EnfermedadList() {
    // Estados para manejar la lista de enfermedades, edición, visualización del modal, error y búsqueda.
    const [enfermedades, setEnfermedades] = useState([]); // Estado para almacenar la lista de enfermedades.
    const [editEnfermedad, setEditEnfermedad] = useState(null); // Estado para manejar la enfermedad que se va a editar.
    const [showEditModal, setShowEditModal] = useState(false); // Estado para controlar la visibilidad del modal de edición.
    const [error, setError] = useState(null); // Estado para manejar los errores.
    const [searchQuery, setSearchQuery] = useState(''); // Estado para la consulta de búsqueda.

    // Función para obtener la lista de enfermedades desde el servidor.
    const fetchEnfermedades = async () => {
        try {
            const response = await fetch('http://localhost:5000/crud/enfermedades'); // Realiza una solicitud GET a la API.
            if (response.ok) {
                const data = await response.json(); // Convierte la respuesta a JSON.
                setEnfermedades(data); // Actualiza el estado con la lista de enfermedades.
            } else {
                throw new Error('Error al recuperar las enfermedades'); // Lanza un error si la respuesta no es correcta.
            }
        } catch (error) {
            setError(error.message); // Actualiza el estado de error en caso de fallo.
        }
    };

    // useEffect para cargar las enfermedades cuando el componente se monta.
    useEffect(() => {
        fetchEnfermedades(); // Llama a la función para obtener la lista de enfermedades.
    }, []); // [] asegura que solo se ejecute una vez al montar el componente.

    // Maneja el clic en el botón de editar, mostrando el modal de edición.
    const handleEditClick = (enfermedad) => {
        setEditEnfermedad(enfermedad); // Configura la enfermedad seleccionada para la edición.
        setShowEditModal(true); // Muestra el modal de edición.
    };

    // Cierra el modal de edición.
    const handleCloseEditModal = () => {
        setShowEditModal(false); // Oculta el modal de edición.
    };

    // Maneja la eliminación de una enfermedad.
    const handleDeleteClick = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta enfermedad?')) { // Confirmación antes de eliminar.
            try {
                const response = await fetch(`http://localhost:5000/crud/enfermedades/${id}`, {
                    method: 'DELETE', // Realiza una solicitud DELETE a la API.
                });
                if (response.ok) {
                    setEnfermedades(enfermedades.filter(enf => enf.idEnfermedades !== id)); // Filtra y actualiza la lista de enfermedades.
                } else {
                    throw new Error('Error al eliminar la enfermedad'); // Lanza un error si la respuesta no es correcta.
                }
            } catch (error) {
                setError(error.message); // Actualiza el estado de error en caso de fallo.
            }
        }
    };

    // Maneja la actualización de una enfermedad.
    const handleUpdateEnfermedad = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.
        try {
            const response = await fetch(`http://localhost:5000/crud/enfermedades/${editEnfermedad.idEnfermedades}`, {
                method: 'PUT', // Realiza una solicitud PUT a la API.
                headers: {
                    'Content-Type': 'application/json', // Especifica que el contenido es JSON.
                },
                body: JSON.stringify(editEnfermedad), // Convierte el objeto editEnfermedad a una cadena JSON.
            });
            if (response.ok) {
                const updatedEnfermedad = await response.json(); // Convierte la respuesta a JSON.
                setEnfermedades(enfermedades.map(enf => enf.idEnfermedades === updatedEnfermedad.idEnfermedades ? updatedEnfermedad : enf)); // Actualiza la lista de enfermedades.
                setShowEditModal(false); // Oculta el modal de edición.
                await fetchEnfermedades(); // Recarga la lista de enfermedades.
            } else {
                throw new Error('Error al actualizar la enfermedad'); // Lanza un error si la respuesta no es correcta.
            }
        } catch (error) {
            setError(error.message); // Actualiza el estado de error en caso de fallo.
        }
    };

    // Maneja los cambios en los campos de entrada del formulario de edición.
    const handleInputChange = (e) => {
        const { name, value } = e.target; // Obtiene el nombre y valor del campo que cambió.
        setEditEnfermedad(prev => ({
            ...prev,
            [name]: value, // Actualiza el campo correspondiente de la enfermedad que se está editando.
        }));
    };

    // Maneja los cambios en la imagen del formulario de edición.
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Obtiene el archivo de imagen seleccionado.
        const reader = new FileReader(); // Crea un lector de archivos.
        reader.onload = () => {
            setEditEnfermedad(prev => ({ ...prev, imagen: reader.result })); // Actualiza la imagen como base64.
        };
        if (file) {
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos base64.
        }
    };

    // Maneja los cambios en el campo de búsqueda.
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Actualiza el estado de la consulta de búsqueda.
    };

    // Filtra la lista de enfermedades según la consulta de búsqueda.
    const filteredEnfermedades = enfermedades.filter(enfermedad => 
        enfermedad.nombre.toLowerCase().includes(searchQuery.toLowerCase()) // Compara en minúsculas para evitar problemas de mayúsculas/minúsculas.
    );

    return (
        <div className="body-enfermedad-list">
            <Header className="header-enfermedad-list" /> {/* Renderiza el componente Header */}
            <Container>
                <Card className="mt-3 table-container"> {/* Componente de tarjeta de Bootstrap para contener la tabla */}
                    <Card.Body>
                        <Card.Title>Listado de Enfermedades</Card.Title> {/* Título de la tarjeta */}
                        <div className="search-container">
                            <Form.Control
                                type="text"
                                placeholder="Buscar enfermedades"
                                value={searchQuery}
                                onChange={handleSearchChange} // Actualiza la consulta de búsqueda cuando cambia el texto.
                            />
                            <Button variant="primary" className="btn-primary">Buscar</Button>
                        </div>
                        <Table striped bordered hover className="mt-3"> {/* Tabla de Bootstrap para mostrar enfermedades */}
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Síntomas</th>
                                    <th>Modo de Transmisión</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEnfermedades.map(enfermedad => ( // Itera sobre la lista de enfermedades filtradas.
                                    <tr key={enfermedad.idEnfermedades}>
                                        <td>{enfermedad.idEnfermedades}</td>
                                        <td>{enfermedad.nombre}</td>
                                        <td>{enfermedad.descripcion}</td>
                                        <td>{enfermedad.sintomas}</td>
                                        <td>{enfermedad.modotrasmision}</td>
                                        <td>
                                            {enfermedad.imagen && (
                                                <img src={enfermedad.imagen} alt="Enfermedad" style={{ width: '50px', height: '50px' }} />
                                            )}
                                        </td>
                                        <td className="button-container">
                                            <Button variant="warning" onClick={() => handleEditClick(enfermedad)}>Editar</Button> {/* Botón para editar */}
                                            <Button variant="danger" onClick={() => handleDeleteClick(enfermedad.idEnfermedades)}>Eliminar</Button> {/* Botón para eliminar */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {error && <div className="alert alert-danger mt-3">{error}</div>} {/* Muestra un mensaje de error si hay uno */}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal para editar enfermedad */}
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
                                        value={editEnfermedad?.nombre || ''} // Muestra el nombre de la enfermedad seleccionada para editar.
                                        onChange={handleInputChange} // Maneja los cambios en el campo de entrada.
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
                                        value={editEnfermedad?.descripcion || ''} // Muestra la descripción de la enfermedad seleccionada para editar.
                                        onChange={handleInputChange} // Maneja los cambios en el campo de entrada.
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="sintomas" label="Síntomas">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Ingrese los síntomas"
                                        name="sintomas"
                                        value={editEnfermedad?.sintomas || ''} // Muestra los síntomas de la enfermedad seleccionada para editar.
                                        onChange={handleInputChange} // Maneja los cambios en el campo de entrada.
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <FloatingLabel controlId="modotrasmision" label="Modo de Transmisión">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingrese el modo de transmisión"
                                        name="modotrasmision"
                                        value={editEnfermedad?.modotrasmision || ''} // Muestra el modo de transmisión de la enfermedad seleccionada para editar.
                                        onChange={handleInputChange} // Maneja los cambios en el campo de entrada.
                                    />
                                </FloatingLabel>
                            </Col>
                            <Col sm="12">
                                <Form.Group controlId="imagen" className="mb-3">
                                    <Form.Label>Imagen de la Enfermedad</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".jpg, .png, .jpeg"
                                        onChange={handleImageChange} // Maneja el cambio de la imagen.
                                    />
                                </Form.Group>
                                {editEnfermedad?.imagen && (
                                    <img src={editEnfermedad.imagen} alt="Enfermedad" style={{ width: '100px', height: '100px' }} />
                                )}
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="mt-3"> {/* Botón para enviar el formulario de edición */}
                            Actualizar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EnfermedadList; // Exporta el componente para su uso en otros archivos.
