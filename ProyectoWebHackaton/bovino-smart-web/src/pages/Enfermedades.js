import React, { useState } from 'react'; // Importa React y el hook useState para manejar estados.
import { Container, Button } from 'react-bootstrap'; // Importa componentes de React Bootstrap para la interfaz.
import Header from '../components/Header'; // Importa el componente Header personalizado.
import '../styles/Enfermedades.css'; // Importa estilos personalizados.
import FlechaIcon from '../Iconos/Vector.png'; // Importa la imagen de la flecha

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
            <Container className="container-enfermedad">
                <h2 className="titulo-enfermedad">Nueva Enfermedad:</h2>
                <form className="formulario-enfermedad" onSubmit={handleSubmit}>
                    <div className="upload-image">
                        <input
                            type="file"
                            id="file-input"
                            accept=".jpg, .png, .jpeg"
                            onChange={handleImagenChange}
                            className="hidden-input"
                        />
                        <label htmlFor="file-input" className="upload-label">
                            <img src={FlechaIcon} alt="Subir" className="upload-icon" />
                        </label>
                    </div>
                    <div className="campo-enfermedad">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo-enfermedad">
                        <label>Descripción:</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo-enfermedad">
                        <label>Síntomas:</label>
                        <textarea
                            value={sintomas}
                            onChange={(e) => setSintomas(e.target.value)}
                            required
                        />
                    </div>
                    <div className="campo-enfermedad">
                        <label>Modo de Transmisión:</label>
                        <textarea
                            value={modotrasmision}
                            onChange={(e) => setModoTransmision(e.target.value)}
                            required
                        />
                    </div>
                    <div className="center-button">
                        <Button variant="primary" type="submit" className="custom-button" size="lg">
                            Registrar Enfermedad
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    );
}

export default Enfermedades;
