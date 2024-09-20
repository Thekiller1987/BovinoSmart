import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table, Container } from 'react-bootstrap';
import Header from '../components/Header';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editUsuario, setEditUsuario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState(''); // Estado para la nueva contraseña

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación
      const response = await fetch('http://localhost:5000/crud/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}` // Incluir el token en el encabezado de la solicitud
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        throw new Error('Error al obtener usuarios');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEditClick = (usuario) => {
    setEditUsuario(usuario);
    setNuevaContrasena(''); // Limpiar la nueva contraseña al editar un usuario
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación
        const response = await fetch(`http://localhost:5000/crud/usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}` // Incluir el token en el encabezado de la solicitud
          }
        });
        if (response.ok) {
          setUsuarios(usuarios.filter(u => u.idUsuario !== id));
        } else {
          throw new Error('Error al eliminar el usuario');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Obtener el token de autenticación
      const response = await fetch(`http://localhost:5000/crud/usuarios/${editUsuario.idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token en el encabezado de la solicitud
        },
        body: JSON.stringify({ nombre_usuario: editUsuario.nombre_usuario, rol: editUsuario.rol }),
      });

      if (response.ok) {
        alert('Usuario actualizado correctamente');
        setShowModal(false); // Cierra el modal
        fetchUsuarios(); // Recarga la lista de usuarios
      } else {
        throw new Error('Error al actualizar el usuario');
      }

      // Actualizar la contraseña si se ha ingresado una nueva
      if (nuevaContrasena) {
        const responsePassword = await fetch(`http://localhost:5000/crud/usuarios/${editUsuario.idUsuario}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ nueva_contrasena: nuevaContrasena }),
        });

        if (responsePassword.ok) {
          alert('Contraseña actualizada correctamente');
        } else {
          throw new Error('Error al actualizar la contraseña');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header />
      <Container>
        <h2>Gestión de Usuarios</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Usuario</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.idUsuario}>
                <td>{usuario.idUsuario}</td>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.rol}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClick(usuario)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(usuario.idUsuario)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nombre_usuario">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre de Usuario"
                value={editUsuario ? editUsuario.nombre_usuario : ''}
                onChange={(e) => setEditUsuario({ ...editUsuario, nombre_usuario: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={editUsuario ? editUsuario.rol : ''}
                onChange={(e) => setEditUsuario({ ...editUsuario, rol: e.target.value })}
                required
              >
                <option value="Ganadero">Ganadero</option>
                <option value="Empleado">Empleado</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="nueva_contrasena">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nueva Contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionUsuarios;
