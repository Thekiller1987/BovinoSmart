import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Offcanvas, Button, NavDropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };


    return (

        <div>
            {/* Navbar principal */}
            <Navbar className="navbar-color" variant="dark" expand="md">
                <Container>
                    <Navbar.Brand href="#home">BoVinoSmarth</Navbar.Brand>
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



                            <NavDropdown title="Animales" id="animales">
                                <NavDropdown.Item>
                                    <Link to="/Animales" className="link-unstyled">Registrar Animales</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link to="/AnimalList" className="link-unstyled">Listar Animales</Link>
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





                            <NavDropdown title="Productos" id="productos">
                                <NavDropdown.Item>
                                    <Link to="/Productos" className="link-unstyled">Registrar Productos</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link to="/ProductoList" className="link-unstyled">Listar Productos</Link>
                                </NavDropdown.Item>
                            </NavDropdown>




                            <NavDropdown title="Tratamiento" id="tratamiento">
                                <NavDropdown.Item>
                                    <Link to="/Tratamiento" className="link-unstyled">Registrar Tratamiento</Link>
                                </NavDropdown.Item>

                                <NavDropdown.Item>
                                    <Link to="/TratamientoList" className="link-unstyled">Listar Tratamiento</Link>
                                </NavDropdown.Item>
                            </NavDropdown>




                            <NavDropdown title="IA" id="IA">
                                <NavDropdown.Item>
                                    <Link to="/PreguntaIA" className="link-unstyled">Manola</Link>
                                </NavDropdown.Item>

                            </NavDropdown>
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



                        <NavDropdown title="Tratamiento" id="Tratamiento">
                            <NavDropdown.Item>
                                <Link to="/Tratamiento" className="link-unstyled">Registrar Tratamiento</Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <Link to="/TratamientoList" className="link-unstyled">Listar Tratamiento</Link>
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="IA" id="IA">
                                <NavDropdown.Item>
                                    <Link to="/PreguntaIA" className="link-unstyled">Manola</Link>
                                </NavDropdown.Item>

                            </NavDropdown>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );

}

export default Header;