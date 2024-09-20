import React, { useState } from 'react';
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap';
import Header from '../components/Header'; // Importa el componente de cabecera
import '../styles/App.css'; // Importa estilos personalizados

function Productos() {
    // Estados para manejar los campos del formulario
    const [nombre, setNombre] = useState(''); // Estado para el nombre del producto
    const [tipo, setTipo] = useState(''); // Estado para el tipo del producto
    const [dosisRecomendada, setDosisRecomendada] = useState(''); // Estado para la dosis recomendada
    const [frecuenciaAplicacion, setFrecuenciaAplicacion] = useState(''); // Estado para la frecuencia de aplicación
    const [notas, setNotas] = useState(''); // Estado para notas adicionales
    const [esTratamiento, setEsTratamiento] = useState(false); // Estado para indicar si es un tratamiento
    const [motivo, setMotivo] = useState(''); // Estado para el motivo del tratamiento
    const [imagen, setImagen] = useState(''); // Estado para manejar la imagen del producto

    // Función para manejar la selección de la imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagen(reader.result); // Guarda la imagen en base64 en el estado
        };

        if (file) {
            reader.readAsDataURL(file); // Lee el archivo de imagen como una URL de datos
        } else {
            setImagen('');
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario

        // Crea un objeto con los datos del formulario
        const formData = {
            nombre,
            tipo,
            dosis_recomendada: dosisRecomendada,
            frecuencia_aplicacion: frecuenciaAplicacion,
            notas,
            es_tratamiento: esTratamiento,
            motivo,
            imagen // Incluye la imagen en el objeto de datos del formulario
        };

        try {
            // Envía una solicitud POST al servidor para registrar el producto
            const response = await fetch('http://localhost:5000/crud/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Producto registrado'); // Muestra un mensaje de éxito
                // Resetea los campos del formulario
                setNombre('');
                setTipo('');
                setDosisRecomendada('');
                setFrecuenciaAplicacion('');
                setNotas('');
                setEsTratamiento(false);
                setMotivo('');
                setImagen(''); // Reinicia el estado de la imagen
            } else {
                alert('Error al registrar el producto'); // Muestra un mensaje de error
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Maneja errores en la solicitud
            alert('Error en la solicitud al servidor'); // Muestra un mensaje de error
        }
    };

    return (
        <div>
            <Header /> {/* Componente de cabecera */}
            <Container>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Registrar Producto</Card.Title>
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Row className="g-3">
                                {/* Campo de nombre del producto */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="nombre" label="Nombre">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el nombre del producto"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                {/* Campo de tipo del producto */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="tipo" label="Tipo">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el tipo del producto"
                                            value={tipo}
                                            onChange={(e) => setTipo(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                {/* Campo de dosis recomendada */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="dosisRecomendada" label="Dosis Recomendada">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese la dosis recomendada"
                                            value={dosisRecomendada}
                                            onChange={(e) => setDosisRecomendada(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>

                                {/* Campo de frecuencia de aplicación */}
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="frecuenciaAplicacion" label="Frecuencia de Aplicación">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese la frecuencia de aplicación"
                                            value={frecuenciaAplicacion}
                                            onChange={(e) => setFrecuenciaAplicacion(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>

                                {/* Campo de notas adicionales */}
                                <Col sm="12">
                                    <FloatingLabel controlId="notas" label="Notas">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Ingrese notas adicionales"
                                            value={notas}
                                            onChange={(e) => setNotas(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>

                                {/* Checkbox para indicar si es un tratamiento */}
                                <Col sm="12" md="6">
                                    <Form.Check
                                        type="checkbox"
                                        id="esTratamiento"
                                        label="¿Es un tratamiento?"
                                        checked={esTratamiento}
                                        onChange={(e) => setEsTratamiento(e.target.checked)}
                                    />
                                </Col>

                                {/* Campo de motivo del tratamiento, visible solo si esTratamiento es true */}
                                {esTratamiento && (
                                    <Col sm="12" md="6">
                                        <FloatingLabel controlId="motivo" label="Para que es el tratamiento">
                                            <Form.Control
                                                type="text"
                                                placeholder="Ingrese el motivo del tratamiento"
                                                value={motivo}
                                                onChange={(e) => setMotivo(e.target.value)}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                )}

                                {/* Campo de carga de imagen */}
                                <Col sm="12">
                                    <Form.Group controlId="imagen">
                                        <Form.Label>Imagen del Producto</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="center-button">
                                <Button variant="primary" type="submit" className="mt-3 custom-button" size="lg">
                                    Registrar Producto
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Productos;
