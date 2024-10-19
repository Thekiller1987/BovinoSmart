import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Header from '../components/Header'; // Importa el componente Header personalizado
import '../styles/Producto.css'; // Importa estilos personalizados
import FlechaIcon from '../Iconos/Vector.png'; // Importa la imagen de la flecha

function Productos() {
    // Estados para los datos del formulario
    const [nombre, setNombre] = useState(''); // Estado para el nombre del producto
    const [tipo, setTipo] = useState(''); // Estado para el tipo del producto
    const [dosisRecomendada, setDosisRecomendada] = useState(''); // Estado para la dosis recomendada
    const [frecuenciaAplicacion, setFrecuenciaAplicacion] = useState(''); // Estado para la frecuencia de aplicación
    const [notas, setNotas] = useState(''); // Estado para notas adicionales
    const [esTratamiento, setEsTratamiento] = useState(false); // Estado para indicar si es un tratamiento
    const [motivo, setMotivo] = useState(''); // Estado para el motivo del tratamiento
    const [imagen, setImagen] = useState(''); // Estado para la imagen del producto

    // Maneja el cambio de la imagen del producto
    const handleImagenChange = (event) => {
        const file = event.target.files[0]; // Obtiene el archivo de imagen seleccionado
        const reader = new FileReader(); // Crea un lector de archivos
        reader.onload = () => {
            setImagen(reader.result); // Al cargar, establece la imagen como base64
        };
        if (file) {
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos base64
        }
    };

    // Manejo del envío del formulario
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
            imagen
        };

        try {
            // Envía una solicitud POST al servidor para registrar un nuevo producto
            const response = await fetch('http://localhost:5000/crud/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Producto registrado'); // Muestra un mensaje de éxito si la respuesta es correcta
                // Resetea los campos del formulario
                setNombre('');
                setTipo('');
                setDosisRecomendada('');
                setFrecuenciaAplicacion('');
                setNotas('');
                setEsTratamiento(false);
                setMotivo('');
                setImagen('');
            } else {
                alert('Error al registrar el producto'); // Muestra un mensaje de error si la respuesta no es correcta
            }
        } catch (error) {
            console.error('Error en la solicitud:', error); // Muestra el error en la consola
            alert('Error en la solicitud al servidor'); // Muestra un mensaje de error en caso de fallo de la solicitud
        }
    };

    return (
        <div>
            <Header /> {/* Renderiza el componente Header */}
            <div className="decorative-image-2"></div> {/* Imagen decorativa */}
            <div className="decorative-image-3"></div> {/* Imagen decorativa */}
            <Container className="container-producto">
                <h2 className="titulo-producto">Registrar Producto:</h2>
                <form className="formulario-producto" onSubmit={handleSubmit}>
                    <div className="upload-image-producto">
                        <input
                            type="file"
                            id="file-input"
                            accept=".jpg, .png, .jpeg"
                            onChange={handleImagenChange}
                            className="hidden-input-producto"
                        />
                        <label htmlFor="file-input" className="upload-label-producto">
                            <img src={FlechaIcon} alt="Subir" className="upload-icon-producto" />
                        </label>
                    </div>
                    <div className="campo-producto">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo-producto">
                        <label>Tipo:</label>
                        <input
                            type="text"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo-producto">
                        <label>Dosis Recomendada:</label>
                        <input
                            type="text"
                            value={dosisRecomendada}
                            onChange={(e) => setDosisRecomendada(e.target.value)}
                        />
                    </div>
                    <div className="campo-productoAplicacion">
                        <label>Frecuencia de Aplicación:</label>
                        <input
                            type="text"
                            value={frecuenciaAplicacion}
                            onChange={(e) => setFrecuenciaAplicacion(e.target.value)}
                        />
                    </div>
                    <div className="campo-producto">
                        <label>Notas:</label>
                        <input
                            type="text"
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                        />
                    </div>
                    <div className="campo-producto">
                        <label>
                            <input
                                type="checkbox"
                                checked={esTratamiento}
                                onChange={(e) => setEsTratamiento(e.target.checked)}
                            />
                            ¿Es un tratamiento?
                        </label>
                    </div>
                    {esTratamiento && (
                        <div className="campo-producto">
                            <label>Motivo del Tratamiento:</label>
                            <input
                                type="text"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="center-button-producto">
                        <Button variant="primary" type="submit" className="custom-button-producto" size="lg">
                            Registrar Producto
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default Productos;
