import React, { useState } from 'react';
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/App.css';

function Animal() {
    // Crear un estado para cada campo del formulario
    const [nombre, setNombre] = useState('');
    const [sexo, setSexo] = useState('');
    const [imagen, setImagen] = useState('');
    const [codigo_idVaca, setCodigo_idVaca] = useState('');
    const [fecha_nacimiento, setFecha_nacimiento] = useState('');
    const [raza, setRaza] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [peso_nacimiento, setPeso_nacimiento] = useState('');
    const [peso_destete, setPeso_destete] = useState('');
    const [peso_actual, setPeso_actual] = useState('');






    const handleImagenChange = (event) => {
        const file = event.target.files[0]; // Obtener el primer archivo seleccionado

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result; // Obtener la imagen en formato base64
            setImagen(base64String); // Guardado imagen en variable de estado
        };
        if (file) {
            reader.readAsDataURL(file); // Lee el contenido del archivo como base64
        }
    };



    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto con los datos del formulario
        const formData = {
            nombre,
            sexo,
            imagen,
            codigo_idVaca,
            fecha_nacimiento,
            raza,
            observaciones,
            peso_nacimiento,
            peso_destete,
            peso_actual,
        };

        try {
            // Realizar una solicitud HTTP al backend para enviar los datos
            const response = await fetch('http://localhost:5000/crud/createAnimal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // El registro se creó exitosamente
                alert('Animal registrado exitosamente');
                // Reiniciar los campos del formulario
                setNombre('');
                setSexo('');
                setImagen('');
                setCodigo_idVaca('');
                setFecha_nacimiento('');
                setRaza('');
                setObservaciones('');
                setPeso_nacimiento('');
                setPeso_destete('');
                setPeso_actual('');
            } else {
                alert('Error al registrar el animal');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud al servidor');
        }
    };

    return (
        <div>
            <Header />

            <Container>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Registro de Animal</Card.Title>
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="nombre" label="Nombre">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el nombre del animal"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="sexo" label="Sexo">
                                        <Form.Select
                                            value={sexo}
                                            onChange={(e) => setSexo(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione el sexo</option>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>



                                <Col sm="12" md="6" lg="6">
                                    <Form.Group controlId="imagen" className="" >
                                        <Form.Control
                                            type="file"
                                            accept=".jpg, .png, .jpeg"
                                            size="lg"
                                            onChange={handleImagenChange}
                                        />
                                    </Form.Group>
                                </Col>


                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="codigo_idVaca" label="Código ID Vaca">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el código ID de la vaca"
                                            value={codigo_idVaca}
                                            onChange={(e) => setCodigo_idVaca(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="fecha_nacimiento" label="Fecha de Nacimiento">
                                        <Form.Control
                                            type="date"
                                            placeholder="Ingrese la fecha de nacimiento"
                                            value={fecha_nacimiento}
                                            onChange={(e) => setFecha_nacimiento(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="raza" label="Raza">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese la raza del animal"
                                            value={raza}
                                            onChange={(e) => setRaza(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="observaciones" label="Observaciones">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Ingrese observaciones"
                                            value={observaciones}
                                            onChange={(e) => setObservaciones(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="peso_nacimiento" label="Peso al Nacer (kg)">
                                        <Form.Control
                                            type="number"
                                            placeholder="Ingrese el peso al nacer"
                                            value={peso_nacimiento}
                                            onChange={(e) => setPeso_nacimiento(e.target.value)}
                                            step="0.01"
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="peso_destete" label="Peso al Destete (kg)">
                                        <Form.Control
                                            type="number"
                                            placeholder="Ingrese el peso al destete"
                                            value={peso_destete}
                                            onChange={(e) => setPeso_destete(e.target.value)}
                                            step="0.01"
                                        />
                                    </FloatingLabel>
                                </Col>

                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="peso_actual" label="Peso Actual (kg)">
                                        <Form.Control
                                            type="number"
                                            placeholder="Ingrese el peso actual"
                                            value={peso_actual}
                                            onChange={(e) => setPeso_actual(e.target.value)}
                                            step="0.01"
                                        />
                                    </FloatingLabel>
                                </Col>

                            </Row>
                            <div className="center-button">
                                <Button variant="primary" type="submit" className="mt-3 custom-button" size="lg">
                                    Registrar Animal
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Animal;
