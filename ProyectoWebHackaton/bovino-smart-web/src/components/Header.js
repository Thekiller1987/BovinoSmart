import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Offcanvas, Button, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // Importa el archivo CSS personalizado
import logo from '../logo/Logo.png'; // Importa la imagen del logo

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const [userRoles, setUserRoles] = useState([]);
    const [userLicense, setUserLicense] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const userData = JSON.parse(atob(token.split('.')[1]));
                setUserRoles(userData.rol ? [userData.rol] : []);
                setUserLicense(userData.idLicencia.toString());
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        }
    }, []);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/Login');
    };

    return (
        <div>
            {/* Navbar principal */}
            <Navbar className="navbar-color" variant="dark" expand="md">
                <Container fluid>
                    <Navbar.Brand href="/">
                        {/* Logo a la izquierda del nombre */}
                        <img
                            src={logo}
                            alt="BoVinoSmart Logo"
                            className="navbar-logo"
                        />
                        BovinoSmart
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={toggleMenu}
                    />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/" className="link-unstyled">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/about" className="link-unstyled">Información</Nav.Link>

                            {/* Opciones dinámicas basadas en los roles del usuario */}
                            {userRoles.includes('Ganadero') && (
                                <>
                                    <NavDropdown title="Animales" id="animales">
                                        <NavDropdown.Item as={Link} to="/Animales" className="link-unstyled">
                                            Registrar Animales
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/AnimalList" className="link-unstyled">
                                            Listar Animales
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Enfermedades" id="enfermedades">
                                        <NavDropdown.Item as={Link} to="/Enfermedades" className="link-unstyled">
                                            Registrar Enfermedades
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/EnfermedadList" className="link-unstyled">
                                            Listar Enfermedades
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                    <NavDropdown title="Productos" id="productos">
                                        <NavDropdown.Item as={Link} to="/Productos" className="link-unstyled">
                                            Registrar Productos
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/ProductoList" className="link-unstyled">
                                            Listar Productos
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                 
                           
                                    <Nav.Link as={Link} to="/ActivarLicencia" className="link-unstyled">
                                        Activacion Licencia
                                    </Nav.Link>


                                    <Nav.Link as={Link} to="/Graficos" className="link-unstyled">
                                        Graficos
                                    </Nav.Link>
                                </>
                            )}

                            {userLicense === '3' && (
                                <NavDropdown title="IA" id="IA">
                                    <NavDropdown.Item as={Link} to="/PreguntaIA" className="link-unstyled">
                                        Manola
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {userRoles.includes('Empleado') && (
                                <>
                                    <Nav.Link as={Link} to="/registro-produccion" className="link-unstyled">
                                        Registro de Producción
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/control-banos" className="link-unstyled">
                                        Control de Baños
                                    </Nav.Link>

                                    <Nav.Link as={Link} to="/ActivarLicencia" className="link-unstyled">
                                        Activacion Licencia
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>

                        {/* Botón de cierre de sesión */}
                        <Button variant="outline-light" onClick={handleLogout} className="btn-circle">
                            <img src={require('../Iconos/fi-rr-user.png')} alt="Cerrar sesión" className="icono-cerrar-sesion" />
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Menú lateral (Offcanvas) */}
            <Offcanvas show={showMenu} onHide={toggleMenu} placement="start" className="offcanvas">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menú</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/" className="link-unstyled">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="link-unstyled">Información</Nav.Link>
                        {userRoles.includes('Ganadero') && (
                            <>
                                <NavDropdown title="Animales" id="animales">
                                    <NavDropdown.Item as={Link} to="/Animales" className="link-unstyled">
                                        Registrar animales
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/AnimalList" className="link-unstyled">
                                        Listar animales
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Enfermedades" id="enfermedades">
                                    <NavDropdown.Item as={Link} to="/Enfermedades" className="link-unstyled">
                                        Registrar Enfermedades
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/EnfermedadList" className="link-unstyled">
                                        Listar Enfermedades
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Productos" id="Productos">
                                    <NavDropdown.Item as={Link} to="/Productos" className="link-unstyled">
                                        Registrar Productos
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/ProductoList" className="link-unstyled">
                                        Listar Productos
                                    </NavDropdown.Item>
                                </NavDropdown>
                         
                            

                                
                                <Nav.Link as={Link} to="/Graficos" className="link-unstyled">
                                        Graficos
                                    </Nav.Link>
                            </>
                        )}
                        <Button variant="outline-dark" onClick={handleLogout}>
                            Cerrar Sesión
                        </Button>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
}

export default Header;
