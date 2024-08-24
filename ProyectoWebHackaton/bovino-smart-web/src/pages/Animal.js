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
    const [estado, setEstado] = useState(''); // Nuevo estado para el campo estado
    const [inseminacion, setInseminacion] = useState(false); // Nuevo estado para inseminacion
    const [enfermedades, setEnfermedades] = useState([{ id: '', fecha: '' }]);
    const [productos, setProductos] = useState([{ id: '', dosis: '', fecha: '', es_tratamiento: false }]);
    const [control_banos, setControl_banos] = useState([{ fecha: '', productos_utilizados: '' }]);
    const [produccion_leche, setProduccion_leche] = useState([{ fecha: '', cantidad: '', calidad: '' }]);
    const [inseminaciones, setInseminaciones] = useState([{ fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]);
    const [listaProductos, setListaProductos] = useState([]);
    const [listaEnfermedades, setListaEnfermedades] = useState([]);


    useEffect(() => {
        // Cargar lista de enfermedades
        fetch('http://localhost:5000/crud/enfermedades')
            .then(res => res.json())
            .then(data => setListaEnfermedades(data))
            .catch(err => console.error('Error al cargar enfermedades:', err));

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

    const handleProductoChange = (index, field, value) => {
        const updatedProductos = [...productos];
        updatedProductos[index][field] = value;
        setProductos(updatedProductos);
    };

    const addProducto = () => {
        setProductos([...productos, { id: '', dosis: '', fecha: '', es_tratamiento: false }]);
    };

    const handleBanoChange = (index, field, value) => {
        const updatedBanos = [...control_banos];
        updatedBanos[index][field] = value;
        setControl_banos(updatedBanos);
    };

    const addBano = () => {
        setControl_banos([...control_banos, { fecha: '', productos_utilizados: '' }]);
    };

    const handleProduccionLecheChange = (index, field, value) => {
        const updatedProduccionLeche = [...produccion_leche];
        updatedProduccionLeche[index][field] = value;
        setProduccion_leche(updatedProduccionLeche);
    };

    const addProduccionLeche = () => {
        setProduccion_leche([...produccion_leche, { fecha: '', cantidad: '', calidad: '' }]);
    };

    const handleInseminacionChange = (index, field, value) => {
        const updatedInseminaciones = [...inseminaciones];
        updatedInseminaciones[index][field] = value;
        setInseminaciones(updatedInseminaciones);
    };

    const addInseminacion = () => {
        setInseminaciones([...inseminaciones, { fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]);
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
            estado,  // Añadir estado al formData
            inseminacion,  // Añadir inseminacion al formData
            enfermedades,
            productos,
            control_banos,
            produccion_leche,
            inseminaciones  // Añadir inseminaciones al formData
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
                setEstado('');  // Reset estado
                setInseminacion(false);  // Reset inseminacion
                setEnfermedades([{ id: '', fecha: '' }]);
                setProductos([{ id: '', dosis: '', fecha: '', es_tratamiento: false }]);
                setControl_banos([{ fecha: '', productos_utilizados: '' }]);
                setProduccion_leche([{ fecha: '', cantidad: '', calidad: '' }]);
                setInseminaciones([{ fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]);  // Reset inseminaciones
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

                                {/* Sección de Estado */}
                                <Col sm="12" md="6" lg="6">
                                    <FloatingLabel controlId="estado" label="Estado">
                                        <Form.Select
                                            value={estado}
                                            onChange={(e) => setEstado(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione el estado</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Enfermo">Enfermo</option>
                                            <option value="Vendido">Vendido</option>
                                            <option value="Muerto">Muerto</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>

                                {/* Sección de Inseminación */}
                                <Col sm="12" md="6" lg="6">
                                    <Form.Check
                                        type="checkbox"
                                        id="inseminacion"
                                        label="¿Ha sido inseminado?"
                                        checked={inseminacion}
                                        onChange={(e) => setInseminacion(e.target.checked)}
                                    />
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

                                {/* Sección de Productos (incluyendo tratamientos) */}
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
                                            <Col sm="12">
                                                <Form.Check
                                                    type="checkbox"
                                                    label="¿Es un tratamiento?"
                                                    checked={producto.es_tratamiento}
                                                    onChange={(e) => handleProductoChange(index, 'es_tratamiento', e.target.checked)}
                                                />
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

                                {/* Sección de Producción de Leche */}
                                <Col sm="12">
                                    <h5>Producción de Leche</h5>
                                    {produccion_leche.map((produccion, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="4">
                                                <FloatingLabel controlId={`produccion-fecha-${index}`} label="Fecha">
                                                    <Form.Control
                                                        type="date"
                                                        value={produccion.fecha}
                                                        onChange={(e) => handleProduccionLecheChange(index, 'fecha', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col sm="4">
                                                <FloatingLabel controlId={`produccion-cantidad-${index}`} label="Cantidad (L)">
                                                    <Form.Control
                                                        type="number"
                                                        value={produccion.cantidad}
                                                        onChange={(e) => handleProduccionLecheChange(index, 'cantidad', e.target.value)}
                                                        step="0.01"
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col sm="4">
                                                <FloatingLabel controlId={`produccion-calidad-${index}`} label="Calidad">
                                                    <Form.Control
                                                        type="text"
                                                        value={produccion.calidad}
                                                        onChange={(e) => handleProduccionLecheChange(index, 'calidad', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addProduccionLeche}>Añadir Producción de Leche</Button>
                                </Col>

                                {/* Sección de Inseminaciones */}
                                <Col sm="12">
                                    <h5>Historial de Inseminaciones</h5>
                                    {inseminaciones.map((inseminacion, index) => (
                                        <Row key={index} className="g-3">
                                            <Col sm="3">
                                                <FloatingLabel controlId={`inseminacion-fecha-${index}`} label="Fecha de Inseminación">
                                                    <Form.Control
                                                        type="date"
                                                        value={inseminacion.fecha_inseminacion}
                                                        onChange={(e) => handleInseminacionChange(index, 'fecha_inseminacion', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>

                                            <Col sm="3">
                                                <FloatingLabel controlId={`inseminacion-tipo-${index}`} label="Tipo de Inseminación">
                                                    <Form.Select
                                                        value={inseminacion.tipo_inseminacion}
                                                        onChange={(e) => handleInseminacionChange(index, 'tipo_inseminacion', e.target.value)}
                                                    >
                                                        <option value="">Seleccione el tipo de inseminación</option>
                                                        <option value="Inseminación Natural">Inseminación Natural</option>
                                                        <option value="Inseminación Artificial">Inseminación Artificial</option>
                                                        <option value="Inseminación por Transferencia de Embriones (TE)">Inseminación por Transferencia de Embriones (TE)</option>
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>

                                            <Col sm="3">
                                                <FloatingLabel controlId={`inseminacion-resultado-${index}`} label="Resultado">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Resultado"
                                                        value={inseminacion.resultado}
                                                        onChange={(e) => handleInseminacionChange(index, 'resultado', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col sm="3">
                                                <FloatingLabel controlId={`inseminacion-observaciones-${index}`} label="Observaciones">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Observaciones"
                                                        value={inseminacion.observaciones}
                                                        onChange={(e) => handleInseminacionChange(index, 'observaciones', e.target.value)}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button variant="link" onClick={addInseminacion}>Añadir Inseminación</Button>
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
