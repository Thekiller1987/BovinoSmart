import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Offcanvas, Button, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir a otras páginas
    const [userRoles, setUserRoles] = useState([]);
    const [userLicense, setUserLicense] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decodifica el token
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

    // Función de cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        navigate('/Login'); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <div>
            {/* Navbar principal */}
            <Navbar className="navbar-color" variant="dark" expand="md">
                <Container>
                    <Navbar.Brand href="/">BoVinoSmart</Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        style={{ display: 'none' }}
                        className="d-sm-none d-xs-none"
                    />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link>
                                <Link to="/" className="link-unstyled">Inicio</Link>
                            </Nav.Link>

                            <Nav.Link>
                                <Link to="/about" className="link-unstyled">Información</Link>
                            </Nav.Link>

                            {/* Dropdown de Animales */}
                            {userRoles.includes('Ganadero') && (
                                <NavDropdown title="Animales" id="animales">
                                    <NavDropdown.Item>
                                        <Link to="/Animales" className="link-unstyled">Registrar Animales</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/AnimalList" className="link-unstyled">Listar Animales</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* Dropdown de Enfermedades */}
                            {userRoles.includes('Ganadero') && (
                                <NavDropdown title="Enfermedades" id="enfermedades">
                                    <NavDropdown.Item>
                                        <Link to="/Enfermedades" className="link-unstyled">Registrar Enfermedades</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/EnfermedadList" className="link-unstyled">Listar Enfermedades</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* Dropdown de Productos */}
                            {userRoles.includes('Ganadero') && (
                                <NavDropdown title="Productos" id="productos">
                                    <NavDropdown.Item>
                                        <Link to="/Productos" className="link-unstyled">Registrar Productos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/ProductoList" className="link-unstyled">Listar Productos</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}


                            {userLicense === '3' && (
                                <NavDropdown title="IA" id="IA">
                                    <NavDropdown.Item>
                                        <Link to="/PreguntaIA" className="link-unstyled">Manola</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}





                            {/* Dropdown de Animales */}
                            {userRoles.includes('Empleado') && (
                                <NavDropdown title="Animales" id="animales">

                                    <NavDropdown.Item>
                                        <Link to="/AnimalList" className="link-unstyled">Listar Animales</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}

                            {/* Opciones para Ganadero que puede actualizar licencia */}
                            {userRoles.includes('Ganadero') && (
                                <Nav.Link>
                                    <Link to="/select-licencia" className="link-unstyled">Actualizar Licencia</Link>
                                </Nav.Link>
                            )}


                             {/* Opciones para Ganadero que puede GestionarUsuarios */}
                             {userRoles.includes('Ganadero') && (
                                <Nav.Link>
                                    <Link to="/GestionUsuarios" className="link-unstyled">Gestionar usuarios</Link>
                                </Nav.Link>
                            )}

                             {/* Opciones para Ganadero que puede gestionar estado reproductivo */}
                             {userRoles.includes('Ganadero') && (
                                <Nav.Link>
                                    <Link to="/GestionEstadoReproductivo" className="link-unstyled">Gestionar Estado Reproductivo</Link>
                                </Nav.Link>
                            )}


                            

                            {/* Botón de cierre de sesión */}
                            <Button variant="outline-light" onClick={handleLogout}>
                                Cerrar Sesión
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                    <Button
                        variant="outline-light"
                        onClick={toggleMenu}
                        className="d-md-none d-block"
                        aria-controls="basic-navbar-nav"
                        aria-expanded={showMenu ? 'true' : 'false'}
                    >
                        Menú
                    </Button>
                </Container>
            </Navbar>

            {/* Menú lateral (Offcanvas) */}
            <Offcanvas show={showMenu} onHide={toggleMenu} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menú</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link>
                            <Link to="/" className="link-unstyled">Inicio</Link>
                        </Nav.Link>

                        <Nav.Link>
                            <Link to="/about" className="link-unstyled">About</Link>
                        </Nav.Link>

                        {/* Replicar el dropdown de opciones para el menú lateral */}
                        {userRoles.includes('Ganadero') && (
                            <>
                                <NavDropdown title="Animales" id="animales">
                                    <NavDropdown.Item>
                                        <Link to="/Animales" className="link-unstyled">Registrar animales</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/AnimalList" className="link-unstyled">Listar animales</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Enfermedades" id="enfermedades">
                                    <NavDropdown.Item>
                                        <Link to="/Enfermedades" className="link-unstyled">Registrar Enfermedades</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/EnfermedadList" className="link-unstyled">Listar Enfermedades</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Productos" id="Productos">
                                    <NavDropdown.Item>
                                        <Link to="/Productos" className="link-unstyled">Registrar Productos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/ProductoList" className="link-unstyled">Listar Productos</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>

                                {/* Opción para actualizar licencia */}
                                <Nav.Link>
                                    <Link to="/select-licencia" className="link-unstyled">Actualizar Licencia</Link>
                                </Nav.Link>
                            </>
                        )}

                        {userLicense === '3' && (
                            <NavDropdown title="IA" id="IA">
                                <NavDropdown.Item>
                                    <Link to="/PreguntaIA" className="link-unstyled">Manola</Link>
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}

                        {userRoles.includes('Empleado') && (
                            <>
                                <Nav.Link>
                                    <Link to="/registro-produccion" className="link-unstyled">Registro de Producción</Link>
                                </Nav.Link>
                                <Nav.Link>
                                    <Link to="/control-banos" className="link-unstyled">Control de Baños</Link>
                                </Nav.Link>
                            </>
                        )}

                         {/* Opciones para Ganadero que puede actualizar licencia */}
                         {userRoles.includes('Ganadero') && (
                                <Nav.Link>
                                    <Link to="/GestionUsuarios" className="link-unstyled">Gestionar usuarios</Link>
                                </Nav.Link>
                            )}

                              {/* Opciones para Ganadero que puede gestionar estado reproductivo */}
                              {userRoles.includes('Ganadero') && (
                                <Nav.Link>
                                    <Link to="/GestionEstadoReproductivo" className="link-unstyled">Gestionar Estado Reproductivo</Link>
                                </Nav.Link>
                            )}

                        {/* Botón de cierre de sesión en el menú lateral */}
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
