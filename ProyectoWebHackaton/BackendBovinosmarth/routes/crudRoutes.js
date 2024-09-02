const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {


    

      // Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token no válido' });
      req.user = user;
      next();
    });
  };
  
  // Asegurar rutas con el middleware
  router.get('/ruta-protegida', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso permitido porque estás autenticado' });
  });

    router.get('/enfermedades', (req, res) => {
        const sql = 'SELECT * FROM Enfermedades';

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener enfermedades:', err);
                return res.status(500).json({ error: 'Error al obtener enfermedades' });
            }
            res.status(200).json(results);
        });
    });



    router.get('/productos', (req, res) => {
        const sql = 'SELECT * FROM Productos';

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.status(200).json(results);
        });
    });



    router.get('/Produccion_Leche', (req, res) => {
        const sql = 'SELECT * FROM Produccion_Leche';

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener Produccion_Leche:', err);
                return res.status(500).json({ error: 'Error al obtener Produccion_Leche' });
            }
            res.status(200).json(results);
        });
    });







    //Apartado de animales
    router.post('/createAnimal', (req, res) => {
        const {
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
            estado,  // Añadir el estado del animal
            inseminacion,  // Añadir si ha sido inseminado
            enfermedades,
            tratamientos,
            productos,
            control_banos,
            produccion_leche,
            inseminaciones  // Añadir inseminaciones
        } = req.body;

        if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
            return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
        }

        const sqlAnimal = `
            INSERT INTO Animales (nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, estado, inseminacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valuesAnimal = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, estado, inseminacion];

        db.query(sqlAnimal, valuesAnimal, (err, result) => {
            if (err) {
                console.error('Error al insertar registro de Animal:', err);
                return res.status(500).json({ error: 'Error al insertar registro de Animal' });
            }

            const animalId = result.insertId;

            // Inserción en Historial de Enfermedades
            if (enfermedades && Array.isArray(enfermedades)) {
                enfermedades.forEach(enfermedad => {
                    const sqlEnfermedad = `
                        INSERT INTO Historial_Enfermedades (idAnimal, idEnfermedades, fecha)
                        VALUES (?, ?, ?)
                    `;
                    const valuesEnfermedad = [animalId, enfermedad.id, enfermedad.fecha];

                    db.query(sqlEnfermedad, valuesEnfermedad, (err) => {
                        if (err) {
                            console.error('Error al insertar en Historial de Enfermedades:', err);
                        }
                    });
                });
            }

            // Inserción en Historial de Tratamientos
            if (tratamientos && Array.isArray(tratamientos)) {
                tratamientos.forEach(tratamiento => {
                    const sqlTratamiento = `
                        INSERT INTO Historial_Productos (idAnimal, idProductos, dosis, fecha, es_tratamiento)
                        VALUES (?, ?, ?, ?, TRUE)
                    `;
                    const valuesTratamiento = [animalId, tratamiento.id, tratamiento.dosis, tratamiento.fecha];

                    db.query(sqlTratamiento, valuesTratamiento, (err) => {
                        if (err) {
                            console.error('Error al insertar en Historial de Tratamientos:', err);
                        }
                    });
                });
            }

            // Inserción en Historial de Productos
            if (productos && Array.isArray(productos)) {
                productos.forEach(producto => {
                    const sqlProducto = `
                        INSERT INTO Historial_Productos (idAnimal, idProductos, dosis, fecha)
                        VALUES (?, ?, ?, ?)
                    `;
                    const valuesProducto = [animalId, producto.id, producto.dosis, producto.fecha];

                    db.query(sqlProducto, valuesProducto, (err) => {
                        if (err) {
                            console.error('Error al insertar en Historial de Productos:', err);
                        }
                    });
                });
            }

            // Inserción en Control de Baños
            if (control_banos && Array.isArray(control_banos)) {
                control_banos.forEach(bano => {
                    const sqlBano = `
                        INSERT INTO Control_Banos (idAnimal, fecha, productos_utilizados)
                        VALUES (?, ?, ?)
                    `;
                    const valuesBano = [animalId, bano.fecha, bano.productos_utilizados];

                    db.query(sqlBano, valuesBano, (err) => {
                        if (err) {
                            console.error('Error al insertar en Control de Baños:', err);
                        }
                    });
                });
            }

            // Inserción en Producción de Leche
            if (produccion_leche && Array.isArray(produccion_leche)) {
                produccion_leche.forEach(leche => {
                    const sqlLeche = `
                        INSERT INTO Produccion_Leche (idAnimal, fecha, cantidad, calidad)
                        VALUES (?, ?, ?, ?)
                    `;
                    const valuesLeche = [animalId, leche.fecha, leche.cantidad, leche.calidad];

                    db.query(sqlLeche, valuesLeche, (err) => {
                        if (err) {
                            console.error('Error al insertar en Producción de Leche:', err);
                        }
                    });
                });
            }

            // Inserción en Inseminaciones
            if (inseminaciones && Array.isArray(inseminaciones)) {
                inseminaciones.forEach(inseminacion => {
                    const sqlInseminacion = `
                        INSERT INTO Inseminaciones (idAnimal, fecha_inseminacion, tipo_inseminacion, resultado, observaciones)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    const valuesInseminacion = [animalId, inseminacion.fecha_inseminacion, inseminacion.tipo_inseminacion, inseminacion.resultado, inseminacion.observaciones];

                    db.query(sqlInseminacion, valuesInseminacion, (err) => {
                        if (err) {
                            console.error('Error al insertar en Inseminaciones:', err);
                        }
                    });
                });
            }

            res.status(201).json({ idAnimal: animalId });
        });
    });



    router.get('/listarAnimales' ,(req, res) => {
        const sql = `
            SELECT 
    A.idAnimal,
    A.nombre,
    A.sexo,
    A.imagen,
    A.codigo_idVaca,
    A.fecha_nacimiento,
    A.raza,
    A.observaciones,
    A.peso_nacimiento,
    A.peso_destete,
    A.peso_actual,
    A.estado,  
    A.inseminacion, 
    (SELECT GROUP_CONCAT(E.nombre ORDER BY HE.fecha ASC SEPARATOR ', ')
     FROM Historial_Enfermedades HE
     JOIN Enfermedades E ON HE.idEnfermedades = E.idEnfermedades
     WHERE HE.idAnimal = A.idAnimal) AS enfermedades,
    (SELECT GROUP_CONCAT(HE.fecha ORDER BY HE.fecha ASC SEPARATOR ', ')
     FROM Historial_Enfermedades HE
     WHERE HE.idAnimal = A.idAnimal) AS fechas_enfermedad,
    (SELECT GROUP_CONCAT(P.nombre ORDER BY HP.fecha ASC SEPARATOR ', ')
     FROM Historial_Productos HP
     JOIN Productos P ON HP.idProductos = P.idProductos
     WHERE HP.idAnimal = A.idAnimal) AS productos,
    (SELECT GROUP_CONCAT(HP.dosis ORDER BY HP.fecha ASC SEPARATOR ', ')
     FROM Historial_Productos HP
     WHERE HP.idAnimal = A.idAnimal) AS dosis_producto,
    (SELECT GROUP_CONCAT(HP.fecha ORDER BY HP.fecha ASC SEPARATOR ', ')
     FROM Historial_Productos HP
     WHERE HP.idAnimal = A.idAnimal) AS fechas_producto,
    (SELECT GROUP_CONCAT(HP.es_tratamiento ORDER BY HP.fecha ASC SEPARATOR ', ')
     FROM Historial_Productos HP
     WHERE HP.idAnimal = A.idAnimal) AS tratamientos, 
    (SELECT GROUP_CONCAT(CB.fecha ORDER BY CB.fecha ASC SEPARATOR ', ')
     FROM Control_Banos CB
     WHERE CB.idAnimal = A.idAnimal) AS fechas_bano,
    (SELECT GROUP_CONCAT(CB.productos_utilizados ORDER BY CB.fecha ASC SEPARATOR ', ')
     FROM Control_Banos CB
     WHERE CB.idAnimal = A.idAnimal) AS productos_utilizados_bano,
    (SELECT GROUP_CONCAT(PL.fecha ORDER BY PL.fecha ASC SEPARATOR ', ')
     FROM Produccion_Leche PL
     WHERE PL.idAnimal = A.idAnimal) AS fechas_produccion_leche,
    (SELECT GROUP_CONCAT(PL.cantidad ORDER BY PL.fecha ASC SEPARATOR ', ')
     FROM Produccion_Leche PL
     WHERE PL.idAnimal = A.idAnimal) AS cantidades_produccion_leche,
    (SELECT GROUP_CONCAT(PL.calidad ORDER BY PL.fecha ASC SEPARATOR ', ')
     FROM Produccion_Leche PL
     WHERE PL.idAnimal = A.idAnimal) AS calidades_produccion_leche,
    (SELECT GROUP_CONCAT(I.fecha_inseminacion ORDER BY I.fecha_inseminacion ASC SEPARATOR ', ')
     FROM Inseminaciones I
     WHERE I.idAnimal = A.idAnimal) AS fechas_inseminacion, 
    (SELECT GROUP_CONCAT(I.tipo_inseminacion ORDER BY I.fecha_inseminacion ASC SEPARATOR ', ')
     FROM Inseminaciones I
     WHERE I.idAnimal = A.idAnimal) AS tipos_inseminacion, 
    (SELECT GROUP_CONCAT(I.resultado ORDER BY I.fecha_inseminacion ASC SEPARATOR ', ')
     FROM Inseminaciones I
     WHERE I.idAnimal = A.idAnimal) AS resultados_inseminacion, 
    (SELECT GROUP_CONCAT(I.observaciones ORDER BY I.fecha_inseminacion ASC SEPARATOR ', ')
     FROM Inseminaciones I
     WHERE I.idAnimal = A.idAnimal) AS observaciones_inseminacion 
FROM 
    Animales A
        `;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error al recuperar registros de Animales:', err);
                res.status(500).json({ error: 'Error al recuperar registros de Animales' });
            } else {
                res.status(200).json(result);
            }
        });
    });

    router.put('/updateAnimal/:id', (req, res) => {
        const id = req.params.id;
        const {
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
            estado,
            inseminacion,
            enfermedades,
            productos,
            control_banos,
            produccion_leche,
            inseminaciones
        } = req.body;
    
        if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
            return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
        }
    
        const sql = `
            UPDATE Animales
            SET nombre = ?, sexo = ?, imagen = ?, codigo_idVaca = ?, fecha_nacimiento = ?, raza = ?, observaciones = ?, peso_nacimiento = ?, peso_destete = ?, peso_actual = ?, estado = ?, inseminacion = ?
            WHERE idAnimal = ?
        `;
        const values = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, estado, inseminacion, id];
    
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al actualizar registro de Animal:', err);
                return res.status(500).json({ error: 'Error al actualizar registro de Animal' });
            }
    
            console.log('Datos de Animal actualizados correctamente.');
    
            // Actualizar historial de enfermedades
            db.query('DELETE FROM Historial_Enfermedades WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Historial_Enfermedades:', err);
                } else {
                    if (enfermedades && Array.isArray(enfermedades)) {
                        enfermedades.forEach(enfermedad => {
                            const sqlEnfermedad = `
                                INSERT INTO Historial_Enfermedades (idAnimal, idEnfermedades, fecha)
                                VALUES (?, ?, ?)
                            `;
                            const valuesEnfermedad = [id, enfermedad.id, enfermedad.fecha];
    
                            db.query(sqlEnfermedad, valuesEnfermedad, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Historial de Enfermedades:', err);
                                } else {
                                    console.log('Historial de Enfermedades insertado:', valuesEnfermedad);
                                }
                            });
                        });
                    }
                }
            });
    
            // Actualizar historial de productos
            db.query('DELETE FROM Historial_Productos WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Historial_Productos:', err);
                } else {
                    if (productos && Array.isArray(productos)) {
                        productos.forEach(producto => {
                            const sqlProducto = `
                                INSERT INTO Historial_Productos (idAnimal, idProductos, dosis, fecha, es_tratamiento)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            const valuesProducto = [id, producto.id, producto.dosis, producto.fecha, producto.es_tratamiento];
    
                            db.query(sqlProducto, valuesProducto, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Historial de Productos:', err);
                                } else {
                                    console.log('Historial de Productos insertado:', valuesProducto);
                                }
                            });
                        });
                    }
                }
            });
    
            // Actualizar control de baños
            db.query('DELETE FROM Control_Banos WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Control_Banos:', err);
                } else {
                    if (control_banos && Array.isArray(control_banos)) {
                        control_banos.forEach(bano => {
                            const sqlBano = `
                                INSERT INTO Control_Banos (idAnimal, fecha, productos_utilizados)
                                VALUES (?, ?, ?)
                            `;
                            const valuesBano = [id, bano.fecha, bano.productos_utilizados];
    
                            db.query(sqlBano, valuesBano, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Control de Baños:', err);
                                } else {
                                    console.log('Control de Baños insertado:', valuesBano);
                                }
                            });
                        });
                    }
                }
            });
    
            // Actualizar producción de leche
            db.query('DELETE FROM Produccion_Leche WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Produccion_Leche:', err);
                } else {
                    if (produccion_leche && Array.isArray(produccion_leche)) {
                        produccion_leche.forEach(leche => {
                            const sqlLeche = `
                                INSERT INTO Produccion_Leche (idAnimal, fecha, cantidad, calidad)
                                VALUES (?, ?, ?, ?)
                            `;
                            const valuesLeche = [id, leche.fecha, leche.cantidad, leche.calidad];
    
                            db.query(sqlLeche, valuesLeche, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Producción de Leche:', err);
                                } else {
                                    console.log('Producción de Leche insertada:', valuesLeche);
                                }
                            });
                        });
                    }
                }
            });
    
            // Actualizar historial de inseminaciones
            db.query('DELETE FROM Inseminaciones WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Inseminaciones:', err);
                } else {
                    if (inseminaciones && Array.isArray(inseminaciones)) {
                        inseminaciones.forEach(inseminacion => {
                            const sqlInseminacion = `
                                INSERT INTO Inseminaciones (idAnimal, fecha_inseminacion, tipo_inseminacion, resultado, observaciones)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            const valuesInseminacion = [id, inseminacion.fecha, inseminacion.tipo, inseminacion.resultado, inseminacion.observaciones];
    
                            db.query(sqlInseminacion, valuesInseminacion, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Historial de Inseminaciones:', err);
                                } else {
                                    console.log('Historial de Inseminaciones insertado:', valuesInseminacion);
                                }
                            });
                        });
                    }
                }
            });
    
            res.status(200).json({ message: 'Animal actualizado correctamente' });
        });
    });
    



    router.delete('/deleteAnimal/:id', (req, res) => {
        const id = req.params.id;

        const queries = [
            { sql: 'DELETE FROM Historial_Enfermedades WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Historial_Productos WHERE idAnimal = ?', params: [id] },  // Incluye tratamientos como parte de productos
            { sql: 'DELETE FROM Control_Banos WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Produccion_Leche WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Inseminaciones WHERE idAnimal = ?', params: [id] }, // Agrega la eliminación del historial de inseminaciones
            { sql: 'DELETE FROM Animales WHERE idAnimal = ?', params: [id] }
        ];

        const executeQuery = ({ sql, params }) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        Promise.all(queries.map(executeQuery))
            .then(results => {
                res.status(200).json({ message: 'Registro de animal eliminado con éxito' });
            })
            .catch(err => {
                console.error('Error al eliminar registros:', err);
                res.status(500).json({ error: 'Error al eliminar registros' });
            });
    });



    //Apartado de enfermedades


    // Crear una nueva enfermedad
    router.post('/enfermedades', (req, res) => {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = 'INSERT INTO Enfermedades (nombre, descripcion) VALUES (?, ?)';
        db.query(sql, [nombre, descripcion], (err, result) => {
            if (err) {
                console.error('Error al crear enfermedad:', err);
                return res.status(500).json({ error: 'Error al crear enfermedad' });
            }
            res.status(201).json({ message: 'Enfermedad creada con éxito', id: result.insertId });
        });
    });

    // Leer todas las enfermedades
    router.get('/enfermedades', (req, res) => {
        const sql = 'SELECT * FROM Enfermedades';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener enfermedades:', err);
                return res.status(500).json({ error: 'Error al obtener enfermedades' });
            }
            res.status(200).json(results);
        });
    });

    // Leer una enfermedad por ID
    router.get('/enfermedades/:id', (req, res) => {
        const id = req.params.id;
        const sql = 'SELECT * FROM Enfermedades WHERE idEnfermedades = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener la enfermedad:', err);
                return res.status(500).json({ error: 'Error al obtener la enfermedad' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Enfermedad no encontrada' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Actualizar una enfermedad por ID
    router.put('/enfermedades/:id', (req, res) => {
        const id = req.params.id;
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = 'UPDATE Enfermedades SET nombre = ?, descripcion = ? WHERE idEnfermedades = ?';
        db.query(sql, [nombre, descripcion, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar enfermedad:', err);
                return res.status(500).json({ error: 'Error al actualizar enfermedad' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Enfermedad no encontrada' });
            }
            res.status(200).json({ message: 'Enfermedad actualizada con éxito' });
        });
    });

    // Borrar una enfermedad por ID
    router.delete('/enfermedades/:id', (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM Enfermedades WHERE idEnfermedades = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al borrar enfermedad:', err);
                return res.status(500).json({ error: 'Error al borrar enfermedad' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Enfermedad no encontrada' });
            }
            res.status(200).json({ message: 'Enfermedad borrada con éxito' });
        });
    });

    //Productos



    // Crear un nuevo producto
    router.post('/productos', (req, res) => {
        const { nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo } = req.body;

        // Validar los campos obligatorios
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = `
        INSERT INTO Productos (nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento || false, motivo || null];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al crear producto:', err);
                return res.status(500).json({ error: 'Error al crear producto' });
            }
            res.status(201).json({ message: 'Producto creado con éxito', id: result.insertId });
        });
    });


    // Leer todos los productos
    router.get('/productos', (req, res) => {
        const sql = 'SELECT * FROM Productos';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.status(200).json(results);
        });
    });

    // Leer un producto por ID
    router.get('/productos/:id', (req, res) => {
        const id = req.params.id;
        const sql = 'SELECT * FROM Productos WHERE idProductos = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener el producto:', err);
                return res.status(500).json({ error: 'Error al obtener el producto' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Actualizar un producto por ID
    router.put('/productos/:id', (req, res) => {
        const id = req.params.id;
        const { nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo } = req.body;

        // Validar los campos obligatorios
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = `
        UPDATE Productos 
        SET nombre = ?, tipo = ?, dosis_recomendada = ?, frecuencia_aplicacion = ?, notas = ?, es_tratamiento = ?, motivo = ? 
        WHERE idProductos = ?
    `;

        const values = [nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento || false, motivo || null, id];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al actualizar producto:', err);
                return res.status(500).json({ error: 'Error al actualizar producto' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        });
    });


    // Borrar un producto por ID
    router.delete('/productos/:id', (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM Productos WHERE idProductos = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al borrar producto:', err);
                return res.status(500).json({ error: 'Error al borrar producto' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json({ message: 'Producto borrado con éxito' });
        });
    });







// Ruta para registrar un nuevo usuario
router.post('/register', (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(contrasena, 10);

    const query = 'INSERT INTO Usuarios (nombre_usuario, contrasena) VALUES (?, ?)';
    db.query(query, [nombre_usuario, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      res.json({ message: 'Usuario registrado correctamente' });
    });
  });
  
    // Ruta para iniciar sesión
    router.post('/login', (req, res) => {
        const { nombre_usuario, contrasena } = req.body;
    
        const query = 'SELECT * FROM Usuarios WHERE nombre_usuario = ?';
        db.query(query, [nombre_usuario], (err, results) => {
          if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
          }
    
          if (results.length === 0) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
          }
    
          const user = results[0];
    
          // Verificar la contraseña
          const validPassword = bcrypt.compareSync(contrasena, user.contrasena);
          if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
          }
    
          // Generar un token JWT
          const token = jwt.sign({ id: user.idUsuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
          res.json({ message: 'Inicio de sesión exitoso', token });
        });
      });




    return router;
};