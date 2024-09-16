import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect.
import { Form, Row, Col, Container, FloatingLabel, Card, Button } from 'react-bootstrap'; // Importa componentes de React Bootstrap.
import Header from '../components/Header'; // Importa el componente Header personalizado.
import '../styles/App.css'; // Importa los estilos CSS personalizados.

function Animal() {
    // Estados para los datos del formulario.
    const [nombre, setNombre] = useState(''); // Estado para el nombre del animal.
    const [sexo, setSexo] = useState(''); // Estado para el sexo del animal.
    const [imagen, setImagen] = useState(''); // Estado para la imagen del animal.
    const [codigo_idVaca, setCodigo_idVaca] = useState(''); // Estado para el código ID de la vaca.
    const [fecha_nacimiento, setFecha_nacimiento] = useState(''); // Estado para la fecha de nacimiento.
    const [raza, setRaza] = useState(''); // Estado para la raza del animal.
    const [observaciones, setObservaciones] = useState(''); // Estado para las observaciones.
    const [peso_nacimiento, setPeso_nacimiento] = useState(''); // Estado para el peso al nacer.
    const [peso_destete, setPeso_destete] = useState(''); // Estado para el peso al destete.
    const [peso_actual, setPeso_actual] = useState(''); // Estado para el peso actual.
    const [estado, setEstado] = useState(''); // Estado para el campo estado.
    const [inseminacion, setInseminacion] = useState(false); // Estado para indicar si el animal ha sido inseminado.
    const [enfermedades, setEnfermedades] = useState([{ id: '', fecha: '' }]); // Estado para el historial de enfermedades.
    const [productos, setProductos] = useState([{ id: '', dosis: '', fecha: '', es_tratamiento: false }]); // Estado para los productos aplicados.
    const [control_banos, setControl_banos] = useState([{ fecha: '', productos_utilizados: '' }]); // Estado para el control de baños.
    const [produccion_leche, setProduccion_leche] = useState([{ fecha: '', cantidad: '', calidad: '' }]); // Estado para la producción de leche.
    const [inseminaciones, setInseminaciones] = useState([{ fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]); // Estado para el historial de inseminaciones.
    const [listaProductos, setListaProductos] = useState([]); // Estado para la lista de productos cargados del servidor.
    const [listaEnfermedades, setListaEnfermedades] = useState([]); // Estado para la lista de enfermedades cargadas del servidor.
    const [cicloCelo, setCicloCelo] = useState(''); // Estado para el ciclo de celo
    const [fechaUltimoCelo, setFechaUltimoCelo] = useState(''); // Estado para la fecha del último celo
    const [serviciosRealizados, setServiciosRealizados] = useState(''); // Estado para los servicios realizados
    const [numeroGestaciones, setNumeroGestaciones] = useState(''); // Estado para el número de gestaciones
    const [partosRealizados, setPartosRealizados] = useState(''); // Estado para los partos realizados
    const [resultadosLactancia, setResultadosLactancia] = useState(''); // Estado para los resultados de la lactancia
    const [fechaUltimaPruebaReproductiva, setFechaUltimaPruebaReproductiva] = useState(''); // Estado para la fecha de la última prueba reproductiva
    const [resultadoPruebaReproductiva, setResultadoPruebaReproductiva] = useState(''); // Estado para el resultado de la prueba reproductiva

    const [estadoReproductivo, setEstadoReproductivo] = useState({
        ciclo_celo: '',
        fecha_ultimo_celo: '',
        servicios_realizados: '',
        numero_gestaciones: '',
        partos_realizados: '',
        resultados_lactancia: '',
        fecha_ultima_prueba_reproductiva: '',
        resultado_prueba_reproductiva: ''
    });

    // Hook useEffect para cargar las listas de enfermedades y productos al montar el componente.
    useEffect(() => {
        // Cargar lista de enfermedades desde el servidor.
        fetch('http://localhost:5000/crud/enfermedades')
            .then(res => res.json())
            .then(data => setListaEnfermedades(data)) // Actualiza el estado con la lista de enfermedades.
            .catch(err => console.error('Error al cargar enfermedades:', err)); // Maneja errores en la carga de enfermedades.

        // Cargar lista de productos desde el servidor.
        fetch('http://localhost:5000/crud/productos')
            .then(res => res.json())
            .then(data => setListaProductos(data)) // Actualiza el estado con la lista de productos.
            .catch(err => console.error('Error al cargar productos:', err)); // Maneja errores en la carga de productos.
    }, []);

    // Funciones para manejar los cambios en los campos del formulario.

    // Función para manejar los cambios en los campos de enfermedades.
    const handleEnfermedadChange = (index, field, value) => {
        const updatedEnfermedades = [...enfermedades]; // Copia el estado actual de enfermedades.
        updatedEnfermedades[index][field] = value; // Actualiza el campo específico en la enfermedad seleccionada.
        setEnfermedades(updatedEnfermedades); // Actualiza el estado con la lista modificada de enfermedades.
    };

    // Función para añadir una nueva enfermedad al historial.
    const addEnfermedad = () => {
        setEnfermedades([...enfermedades, { id: '', fecha: '' }]); // Agrega un nuevo objeto de enfermedad al estado.
    };

    // Función para manejar los cambios en los campos de productos.
    const handleProductoChange = (index, field, value) => {
        const updatedProductos = [...productos]; // Copia el estado actual de productos.
        updatedProductos[index][field] = value; // Actualiza el campo específico en el producto seleccionado.
        setProductos(updatedProductos); // Actualiza el estado con la lista modificada de productos.
    };

    // Función para añadir un nuevo producto al historial de productos aplicados.
    const addProducto = () => {
        setProductos([...productos, { id: '', dosis: '', fecha: '', es_tratamiento: false }]); // Agrega un nuevo objeto de producto al estado.
    };

    // Función para manejar los cambios en los campos de control de baños.
    const handleBanoChange = (index, field, value) => {
        const updatedBanos = [...control_banos]; // Copia el estado actual de control de baños.
        updatedBanos[index][field] = value; // Actualiza el campo específico en el baño seleccionado.
        setControl_banos(updatedBanos); // Actualiza el estado con la lista modificada de control de baños.
    };

    // Función para añadir un nuevo registro de baño al historial.
    const addBano = () => {
        setControl_banos([...control_banos, { fecha: '', productos_utilizados: '' }]); // Agrega un nuevo objeto de baño al estado.
    };

    // Función para manejar los cambios en los campos de producción de leche.
    const handleProduccionLecheChange = (index, field, value) => {
        const updatedProduccionLeche = [...produccion_leche]; // Copia el estado actual de producción de leche.
        updatedProduccionLeche[index][field] = value; // Actualiza el campo específico en la producción de leche seleccionada.
        setProduccion_leche(updatedProduccionLeche); // Actualiza el estado con la lista modificada de producción de leche.
    };

    // Función para añadir un nuevo registro de producción de leche.
    const addProduccionLeche = () => {
        setProduccion_leche([...produccion_leche, { fecha: '', cantidad: '', calidad: '' }]); // Agrega un nuevo objeto de producción de leche al estado.
    };

    // Función para manejar los cambios en los campos de inseminación.
    const handleInseminacionChange = (index, field, value) => {
        const updatedInseminaciones = [...inseminaciones]; // Copia el estado actual de inseminaciones.
        updatedInseminaciones[index][field] = value; // Actualiza el campo específico en la inseminación seleccionada.
        setInseminaciones(updatedInseminaciones); // Actualiza el estado con la lista modificada de inseminaciones.
    };

    // Función para añadir una nueva inseminación al historial.
    const addInseminacion = () => {
        setInseminaciones([...inseminaciones, { fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]); // Agrega un nuevo objeto de inseminación al estado.
    };

    // Función para manejar el cambio de imagen del animal.
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

    // Función para manejar el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario.
    
        // Validar que las fechas sean correctas y los campos obligatorios estén llenos
        if (sexo === 'Hembra') {
            if (!cicloCelo || !fechaUltimoCelo || !serviciosRealizados || !numeroGestaciones || !partosRealizados || !resultadosLactancia) {
                alert('Por favor, complete todos los campos relacionados con el estado reproductivo de la hembra.');
                return;
            }
        } else if (sexo === 'Macho') {
            if (!fechaUltimaPruebaReproductiva || !resultadoPruebaReproductiva) {
                alert('Por favor, complete todos los campos relacionados con el estado reproductivo del macho.');
                return;
            }
        }
    
        // Asegurarse de que las fechas no sean nulas y estén en el formato correcto
        const formattedFechaUltimoCelo = fechaUltimoCelo ? new Date(fechaUltimoCelo).toISOString().split('T')[0] : null;
        const formattedFechaUltimaPruebaReproductiva = fechaUltimaPruebaReproductiva ? new Date(fechaUltimaPruebaReproductiva).toISOString().split('T')[0] : null;
    
        // Crea un objeto con los datos del formulario.
        const formData = {
            nombre,
            sexo,
            imagen,
            codigo_idVaca,
            fecha_nacimiento: new Date(fecha_nacimiento).toISOString().split('T')[0],
            raza,
            observaciones,
            peso_nacimiento,
            peso_destete,
            peso_actual,
            estado,
            inseminacion,
            enfermedades,
            productos,
            control_banos,
            produccion_leche,
            inseminaciones,
            estadoReproductivo: { // Nuevo objeto para el estado reproductivo
                ciclo_celo: cicloCelo || '',
                fecha_ultimo_celo: formattedFechaUltimoCelo || '',
                servicios_realizados: serviciosRealizados || 0,
                numero_gestaciones: numeroGestaciones || 0,
                partos_realizados: partosRealizados || 0,
                resultados_lactancia: resultadosLactancia || '',
                fecha_ultima_prueba_reproductiva: formattedFechaUltimaPruebaReproductiva || '',
                resultado_prueba_reproductiva: resultadoPruebaReproductiva || ''
            }
        };
    
        try {
            // Envía una solicitud POST al servidor para crear un nuevo animal.
            const response = await fetch('http://localhost:5000/crud/createAnimal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (response.ok) {
                alert('Animal registrado exitosamente'); // Muestra un mensaje de éxito.
                // Resetea todos los campos del formulario.
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
                setEstado('');
                setInseminacion(false);
                setEnfermedades([{ id: '', fecha: '' }]);
                setProductos([{ id: '', dosis: '', fecha: '', es_tratamiento: false }]);
                setControl_banos([{ fecha: '', productos_utilizados: '' }]);
                setProduccion_leche([{ fecha: '', cantidad: '', calidad: '' }]);
                setInseminaciones([{ fecha_inseminacion: '', tipo_inseminacion: '', resultado: '', observaciones: '' }]);
                // Resetear los estados del estado reproductivo
                setCicloCelo('');
                setFechaUltimoCelo('');
                setServiciosRealizados('');
                setNumeroGestaciones('');
                setPartosRealizados('');
                setResultadosLactancia('');
                setFechaUltimaPruebaReproductiva('');
                setResultadoPruebaReproductiva('');
            } else {
                alert('Error al registrar el animal'); // Muestra un mensaje de error.
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Maneja el error en la solicitud.
            alert('Error en la solicitud al servidor'); // Muestra un mensaje de error.
        }
    };

    return (
        <div>
            <Header /> {/* Renderiza el componente Header */}
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
                                {/* Campo para el sexo del animal */}
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
                                {/* Campo para la imagen del animal */}
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
                                {/* Campo para el código ID de la vaca */}
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
                                {/* Campo para la fecha de nacimiento del animal */}
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
                                {/* Campo para la raza del animal */}
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
                                {/* Campo para observaciones adicionales */}
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
                                {/* Campo para el peso al nacer */}
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
                                {/* Campo para el peso al destete */}
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
                                {/* Campo para el peso actual del animal */}
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

                                {/* Sección de Estado del animal */}
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


                                  {/* Campos del estado reproductivo para hembras */}
                                  {sexo === 'Hembra' && (
                                    <>
                                        <Col sm="12">
                                            <h5>Estado Reproductivo (Hembras)</h5>
                                            {/* Ciclo de Celo */}
                                            <FloatingLabel controlId="cicloCelo" label="Ciclo de Celo">
                                                <Form.Select value={estadoReproductivo.ciclo_celo} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, ciclo_celo: e.target.value })}>
                                                    <option value="">Seleccione el ciclo</option>
                                                    <option value="18 días">18 días</option>
                                                    <option value="21 días">21 días</option>
                                                    <option value="24 días">24 días</option>
                                                    <option value="28 días">28 días</option>
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Fecha del Último Celo */}
                                            <FloatingLabel controlId="fechaUltimoCelo" label="Fecha del Último Celo">
                                                <Form.Control type="date" value={estadoReproductivo.fecha_ultimo_celo} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, fecha_ultimo_celo: e.target.value })} />
                                            </FloatingLabel>

                                            {/* Servicios Realizados */}
                                            <FloatingLabel controlId="serviciosRealizados" label="Intentos de insiminacion">
                                                <Form.Select value={estadoReproductivo.servicios_realizados} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, servicios_realizados: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    {[...Array(10).keys()].map((num) => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Número de Gestaciones */}
                                            <FloatingLabel controlId="numeroGestaciones" label="Numero de veces preñada">
                                                <Form.Select value={estadoReproductivo.numero_gestaciones} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, numero_gestaciones: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    {[...Array(10).keys()].map((num) => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Partos Realizados */}
                                            <FloatingLabel controlId="partosRealizados" label="Partos Realizados">
                                                <Form.Select value={estadoReproductivo.partos_realizados} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, partos_realizados: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    {[...Array(10).keys()].map((num) => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Resultados de la Lactancia */}
                                            <FloatingLabel controlId="resultadosLactancia" label="Resultados de la Lactancia luego del parto">
                                                <Form.Select value={estadoReproductivo.resultados_lactancia} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, resultados_lactancia: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    <option value="Alta producción">Alta producción</option>
                                                    <option value="Producción normal">Producción normal</option>
                                                    <option value="Baja producción">Baja producción</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                    </>
                                )}

                                {/* Campos del estado reproductivo para machos */}
                                {sexo === 'Macho' && (
                                    <>
                                        <Col sm="12">
                                            <h5>Estado Reproductivo (Machos)</h5>
                                            {/* Fertilidad */}
                                            <FloatingLabel controlId="fertilidad" label="Fertilidad">
                                                <Form.Select value={estadoReproductivo.fertilidad} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, fertilidad: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    <option value="Alta">Alta</option>
                                                    <option value="Media">Media</option>
                                                    <option value="Baja">Baja</option>
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Uso en Programas de Inseminación */}
                                            <FloatingLabel controlId="usoProgramaInseminacion" label="Uso en Programas de Inseminación">
                                                <Form.Select value={estadoReproductivo.uso_programa_inseminacion} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, uso_programa_inseminacion: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    <option value="Frecuente">Frecuente</option>
                                                    <option value="Ocasional">Ocasional</option>
                                                    <option value="Nunca">Nunca</option>
                                                </Form.Select>
                                            </FloatingLabel>

                                            {/* Resultado de la Prueba Reproductiva */}
                                            <FloatingLabel controlId="resultadoPruebaReproductivaMacho" label="Resultado de la Prueba Reproductiva">
                                                <Form.Select value={estadoReproductivo.resultado_prueba_reproductiva_macho} onChange={(e) => setEstadoReproductivo({ ...estadoReproductivo, resultado_prueba_reproductiva_macho: e.target.value })}>
                                                    <option value="">Seleccione</option>
                                                    <option value="Positivo">Positivo</option>
                                                    <option value="Negativo">Negativo</option>
                                                    <option value="Pendiente">Pendiente</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                    </>
                                )}
                            </Row>
                            {/* Botón para enviar el formulario */}
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

export default Animal; // Exporta el componente Animal para ser utilizado en otras partes de la aplicación.
