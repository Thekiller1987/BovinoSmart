import React, { useState } from 'react'; // Importa React y el hook useState para manejar estados.
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap'; // Importa componentes de React Bootstrap para la interfaz.
import Header from '../components/Header'; // Importa el componente Header personalizado.
import '../styles/App.css'; // Importa estilos personalizados.

function Enfermedades() {
    // Estados para los datos del formulario.
    const [nombre, setNombre] = useState(''); // Estado para el nombre de la enfermedad.
    const [descripcion, setDescripcion] = useState(''); // Estado para la descripción de la enfermedad.
    const [sintomas, setSintomas] = useState(''); // Estado para los síntomas de la enfermedad.
    const [modotrasmision, setModoTransmision] = useState(''); // Estado para el modo de transmisión de la enfermedad.
    const [imagen, setImagen] = useState(''); // Estado para la imagen de la enfermedad.

    // Maneja el cambio de la imagen de la enfermedad.
    const handleImagenChange = (event) => {
        const file = event.target.files[0]; // Obtiene el archivo de imagen seleccionado.
        const reader = new FileReader(); // Crea un lector de archivos.
        reader.onload = () => {
            setImagen(reader.result); // Al cargar, establece la imagen como base64.
        };
        if (file) {
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos base64.
        }
    };

    // Manejo del envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.

        // Crea un objeto con los datos del formulario.
        const formData = { nombre, descripcion, sintomas, modotrasmision, imagen };

        try {
            // Envía una solicitud POST al servidor para registrar una nueva enfermedad.
            const response = await fetch('http://localhost:5000/crud/enfermedades', {
                method: 'POST', // Método HTTP para la solicitud.
                headers: {
                    'Content-Type': 'application/json', // Especifica que el contenido es JSON.
                },
                body: JSON.stringify(formData), // Convierte el objeto formData a una cadena JSON.
            });

            if (response.ok) {
                alert('Enfermedad registrada'); // Muestra un mensaje de éxito si la respuesta es correcta.
                setNombre(''); // Resetea el campo del nombre.
                setDescripcion(''); // Resetea el campo de la descripción.
                setSintomas(''); // Resetea el campo de los síntomas.
                setModoTransmision(''); // Resetea el campo del modo de transmisión.
                setImagen(''); // Resetea el campo de la imagen.
            } else {
                alert('Error al registrar la enfermedad'); // Muestra un mensaje de error si la respuesta no es correcta.
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Muestra el error en la consola.
            alert('Error en la solicitud al servidor'); // Muestra un mensaje de error en caso de fallo de la solicitud.
        }
    };

    return (
        <div>
            <Header /> {/* Renderiza el componente Header */}
            <Container>
                <Card className="mt-3"> {/* Componente de tarjeta de Bootstrap para el formulario */}
                    <Card.Body>
                        <Card.Title>Registrar Enfermedad</Card.Title> {/* Título de la tarjeta */}
                        <Form className="mt-3" onSubmit={handleSubmit}> {/* Formulario que llama a handleSubmit al enviarse */}
                            <Row className="g-3"> {/* Grupo de filas y columnas para organizar el formulario */}
                                {/* Campo para el nombre de la enfermedad */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="nombre" label="Nombre">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el nombre de la enfermedad"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)} // Actualiza el estado con el valor ingresado.
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>
                                {/* Campo para la descripción de la enfermedad */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="descripcion" label="Descripción">
                                        <Form.Control
                                            as="textarea" // Componente de área de texto para descripciones largas.
                                            placeholder="Ingrese la descripción de la enfermedad"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)} // Actualiza el estado con el valor ingresado.
                                        />
                                    </FloatingLabel>
                                </Col>
                                {/* Campo para los síntomas de la enfermedad */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="sintomas" label="Síntomas">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Ingrese los síntomas"
                                            value={sintomas}
                                            onChange={(e) => setSintomas(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                {/* Campo para el modo de transmisión */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="modotrasmision" label="Modo de Transmisión">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el modo de transmisión"
                                            value={modotrasmision}
                                            onChange={(e) => setModoTransmision(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                {/* Campo para la imagen de la enfermedad */}
                                <Col sm="12" md="6">
                                    <Form.Group controlId="imagen" className="">
                                        <Form.Label>Imagen de la Enfermedad</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept=".jpg, .png, .jpeg"
                                            size="lg"
                                            onChange={handleImagenChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {/* Botón de envío del formulario */}
                            <div className="center-button">
                                <Button variant="primary" type="submit" className="mt-3 custom-button" size="lg">
                                    Registrar Enfermedad
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Enfermedades; // Exporta el componente para que pueda ser utilizado en otros archivos.
