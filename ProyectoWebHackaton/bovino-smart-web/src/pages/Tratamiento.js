import React, { useState } from 'react';
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap';
import Header from '../components/Header';

function Tratamiento() {
    const [tipo, setTipo] = useState('');
    const [dosis, setDosis] = useState('');
    const [motivo, setMotivo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { tipo, dosis, motivo };

        try {
            const response = await fetch('http://localhost:5000/crud/tratamientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Tratamiento registrado con éxito');
                setTipo('');
                setDosis('');
                setMotivo('');
            } else {
                alert('Error al registrar el tratamiento');
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
                        <Card.Title>Registrar Tratamiento</Card.Title>
                        <Form className="mt-3" onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="tipo" label="Tipo">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese el tipo de tratamiento"
                                            value={tipo}
                                            onChange={(e) => setTipo(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col sm="12" md="6">
                                    <FloatingLabel controlId="dosis" label="Dosis">
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingrese la dosis"
                                            value={dosis}
                                            onChange={(e) => setDosis(e.target.value)}
                                            required
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col sm="12">
                                    <FloatingLabel controlId="motivo" label="Motivo">
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Ingrese el motivo del tratamiento"
                                            value={motivo}
                                            onChange={(e) => setMotivo(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <div className="center-button">
                                <Button variant="primary" type="submit" className="mt-3 custom-button" size="lg">
                                    Registrar Tratamiento
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Tratamiento;
