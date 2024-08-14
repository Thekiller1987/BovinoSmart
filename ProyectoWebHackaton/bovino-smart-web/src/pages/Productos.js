import React, { useState } from 'react';
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/App.css';

function Productos() {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [dosisRecomendada, setDosisRecomendada] = useState('');
    const [frecuenciaAplicacion, setFrecuenciaAplicacion] = useState('');
    const [notas, setNotas] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            nombre,
            tipo,
            dosis_recomendada: dosisRecomendada,
            frecuencia_aplicacion: frecuenciaAplicacion,
            notas
        };

        try {
            const response = await fetch('http://localhost:5000/crud/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Producto registrado');
                setNombre('');
                setTipo('');
                setDosisRecomendada('');
                setFrecuenciaAplicacion('');
                setNotas('');
            } else {
                alert('Error al registrar el producto');
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
                        <Card.Title>Registrar Producto</Card.Title>
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Row className="g-3">
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
