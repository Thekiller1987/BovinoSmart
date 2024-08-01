import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap';
import Header from '../components/Header';
import '../styles/App.css';

function Animal() {
    // Estados para los datos del formulario
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
    const [enfermedades, setEnfermedades] = useState([{ id: '', fecha: '' }]);
    const [tratamientos, setTratamientos] = useState([{ id: '', fecha: '' }]);
    const [productos, setProductos] = useState([{ id: '', dosis: '', fecha: '' }]);
    const [control_banos, setControl_banos] = useState([{ fecha: '', productos_utilizados: '' }]);
    const [listaEnfermedades, setListaEnfermedades] = useState([]);
    const [listaTratamientos, setListaTratamientos] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);

    // Efectos para cargar datos desde el backend
    useEffect(() => {
        // Cargar lista de enfermedades
        fetch('http://localhost:5000/crud/enfermedades')
            .then(res => res.json())
            .then(data => setListaEnfermedades(data))
            .catch(err => console.error('Error al cargar enfermedades:', err));

        // Cargar lista de tratamientos
        fetch('http://localhost:5000/crud/tratamientos')
            .then(res => res.json())
            .then(data => setListaTratamientos(data))
            .catch(err => console.error('Error al cargar tratamientos:', err));

        // Cargar lista de productos
        fetch('http://localhost:5000/crud/productos')
            .then(res => res.json())
            .then(data => setListaProductos(data))
            .catch(err => console.error('Error al cargar productos:', err));
    }, []);

    // Manejo de cambios en los inputs
    const handleEnfermedadChange = (index, field, value) => {
        const updatedEnfermedades = [...enfermedades];
        updatedEnfermedades[index][field] = value;
        setEnfermedades(updatedEnfermedades);
    };

    const addEnfermedad = () => {
        setEnfermedades([...enfermedades, { id: '', fecha: '' }]);
    };

    const handleTratamientoChange = (index, field, value) => {
        const updatedTratamientos = [...tratamientos];
        updatedTratamientos[index][field] = value;
        setTratamientos(updatedTratamientos);
    };

    const addTratamiento = () => {
        setTratamientos([...tratamientos, { id: '', fecha: '' }]);
    };

    const handleProductoChange = (index, field, value) => {
        const updatedProductos = [...productos];
        updatedProductos[index][field] = value;
        setProductos(updatedProductos);
    };

    const addProducto = () => {
        setProductos([...productos, { id: '', dosis: '', fecha: '' }]);
    };

    const handleBanoChange = (index, field, value) => {
        const updatedBanos = [...control_banos];
        updatedBanos[index][field] = value;
        setControl_banos(updatedBanos);
    };

    const addBano = () => {
        setControl_banos([...control_banos, { fecha: '', productos_utilizados: '' }]);
    };

    const handleImagenChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImagen(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            enfermedades,
            tratamientos,
            productos,
            control_banos
        };

        try {
            const response = await fetch('http://localhost:5000/crud/createAnimal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Animal registrado exitosamente');
                // Reset fields
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
                setEnfermedades([{ id: '', fecha: '' }]);
                setTratamientos([{ id: '', fecha: '' }]);
                setProductos([{ id: '', dosis: '', fecha: '' }]);
                setControl_banos([{ fecha: '', productos_utilizados: '' }]);
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
                                {/* Información básica del animal */}
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
                                    <Form.Group controlId="imagen" className="">
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

                                {/* Sección de Enfermedades */}
                                <Col sm="12">
                                    <h5>Historial de Enfermedades</h5>
                                    {enfermedades.map((enfermedad, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="6">
                                                <FloatingLabel controlId={`enfermedad-id-${index}`} label="ID Enfermedad">
                                                    <Form.Select
                                                        value={enfermedad.id}
                                                        onChange={(e) => handleEnfermedadChange(index, 'id', e.target.value)}
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
                                                        value={enfermedad.fecha}
                                                        onChange={(e) => handleEnfermedadChange(index, 'fecha', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addEnfermedad}>Añadir Enfermedad</Button>
                                </Col>

                                {/* Sección de Tratamientos */}
                                <Col sm="12">
                                    <h5>Tratamientos Aplicados</h5>
                                    {tratamientos.map((tratamiento, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="6">
                                                <FloatingLabel controlId={`tratamiento-id-${index}`} label="ID Tratamiento">
                                                    <Form.Select
                                                        value={tratamiento.id}
                                                        onChange={(e) => handleTratamientoChange(index, 'id', e.target.value)}
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
                                            <Col sm="6">
                                                <FloatingLabel controlId={`tratamiento-fecha-${index}`} label="Fecha Tratamiento">
                                                    <Form.Control
                                                        type="date"
                                                        value={tratamiento.fecha}
                                                        onChange={(e) => handleTratamientoChange(index, 'fecha', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addTratamiento}>Añadir Tratamiento</Button>
                                </Col>

                                {/* Sección de Productos */}
                                <Col sm="12">
                                    <h5>Productos Aplicados</h5>
                                    {productos.map((producto, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="4">
                                                <FloatingLabel controlId={`producto-id-${index}`} label="ID Producto">
                                                    <Form.Select
                                                        value={producto.id}
                                                        onChange={(e) => handleProductoChange(index, 'id', e.target.value)}
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
                                                        value={producto.dosis}
                                                        onChange={(e) => handleProductoChange(index, 'dosis', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col sm="4">
                                                <FloatingLabel controlId={`producto-fecha-${index}`} label="Fecha Aplicación">
                                                    <Form.Control
                                                        type="date"
                                                        value={producto.fecha}
                                                        onChange={(e) => handleProductoChange(index, 'fecha', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addProducto}>Añadir Producto</Button>
                                </Col>

                                {/* Sección de Control de Baños */}
                                <Col sm="12">
                                    <h5>Control de Baños</h5>
                                    {control_banos.map((bano, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="6">
                                                <FloatingLabel controlId={`bano-fecha-${index}`} label="Fecha de Baño">
                                                    <Form.Control
                                                        type="date"
                                                        value={bano.fecha}
                                                        onChange={(e) => handleBanoChange(index, 'fecha', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col sm="6">
                                                <FloatingLabel controlId={`bano-productos-${index}`} label="Productos Utilizados">
                                                    <Form.Control
                                                        type="text"
                                                        value={bano.productos_utilizados}
                                                        onChange={(e) => handleBanoChange(index, 'productos_utilizados', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addBano}>Añadir Control de Baño</Button>
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
