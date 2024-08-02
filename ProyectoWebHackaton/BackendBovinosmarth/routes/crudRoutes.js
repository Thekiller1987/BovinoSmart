const express = require('express');
const router = express.Router();

module.exports = (db) => {


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

    
    router.get('/tratamientos', (req, res) => {
        const sql = 'SELECT * FROM Tratamientos';
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener tratamientos:', err);
                return res.status(500).json({ error: 'Error al obtener tratamientos' });
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
            enfermedades,
            tratamientos,
            productos,
            control_banos
        } = req.body;
    
        if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
            return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
        }
    
        const sqlAnimal = `
            INSERT INTO Animales (nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valuesAnimal = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual];
    
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
                        INSERT INTO Historial_Tratamientos (idAnimal, idTratamientos, fecha)
                        VALUES (?, ?, ?)
                    `;
                    const valuesTratamiento = [animalId, tratamiento.id, tratamiento.fecha];
    
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
    
            res.status(201).json({ idAnimal: animalId });
        });
    });
    




    router.get('/listarAnimales', (req, res) => {
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
                GROUP_CONCAT(DISTINCT E.nombre ORDER BY E.nombre ASC SEPARATOR ', ') AS enfermedades,
                GROUP_CONCAT(DISTINCT HE.fecha ORDER BY HE.fecha ASC SEPARATOR ', ') AS fechas_enfermedad,
                GROUP_CONCAT(DISTINCT T.tipo ORDER BY T.tipo ASC SEPARATOR ', ') AS tratamientos,
                GROUP_CONCAT(DISTINCT T.dosis ORDER BY T.dosis ASC SEPARATOR ', ') AS dosis_tratamiento,
                GROUP_CONCAT(DISTINCT T.motivo ORDER BY T.motivo ASC SEPARATOR ', ') AS motivos_tratamiento,
                GROUP_CONCAT(DISTINCT HT.fecha ORDER BY HT.fecha ASC SEPARATOR ', ') AS fechas_tratamiento,
                GROUP_CONCAT(DISTINCT P.nombre ORDER BY P.nombre ASC SEPARATOR ', ') AS productos,
                GROUP_CONCAT(DISTINCT HP.dosis ORDER BY HP.dosis ASC SEPARATOR ', ') AS dosis_producto,
                GROUP_CONCAT(DISTINCT HP.fecha ORDER BY HP.fecha ASC SEPARATOR ', ') AS fechas_producto,
                GROUP_CONCAT(DISTINCT CB.fecha ORDER BY CB.fecha ASC SEPARATOR ', ') AS fechas_bano,
                GROUP_CONCAT(DISTINCT CB.productos_utilizados ORDER BY CB.productos_utilizados ASC SEPARATOR ', ') AS productos_utilizados_bano
            FROM 
                Animales A
            LEFT JOIN 
                Historial_Enfermedades HE ON A.idAnimal = HE.idAnimal
            LEFT JOIN 
                Enfermedades E ON HE.idEnfermedades = E.idEnfermedades
            LEFT JOIN 
                Historial_Tratamientos HT ON A.idAnimal = HT.idAnimal
            LEFT JOIN 
                Tratamientos T ON HT.idTratamientos = T.idTratamientos
            LEFT JOIN 
                Historial_Productos HP ON A.idAnimal = HP.idAnimal
            LEFT JOIN 
                Productos P ON HP.idProductos = P.idProductos
            LEFT JOIN 
                Control_Banos CB ON A.idAnimal = CB.idAnimal
            GROUP BY 
                A.idAnimal
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
            enfermedades,
            tratamientos,
            productos,
            control_banos
        } = req.body;
    
        if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
            return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
        }
    
        const sql = `
            UPDATE Animales
            SET nombre = ?, sexo = ?, imagen = ?, codigo_idVaca = ?, fecha_nacimiento = ?, raza = ?, observaciones = ?, peso_nacimiento = ?, peso_destete = ?, peso_actual = ?
            WHERE idAnimal = ?
        `;
        const values = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, id];
    
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al actualizar registro de Animal:', err);
                return res.status(500).json({ error: 'Error al actualizar registro de Animal' });
            }
    
            console.log('Datos de Animal actualizados correctamente.');
    
            // Eliminar registros existentes en Historial_Enfermedades
            db.query('DELETE FROM Historial_Enfermedades WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Historial_Enfermedades:', err);
                } else {
                    // Insertar nuevos registros en Historial_Enfermedades
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
    
            // Eliminar registros existentes en Historial_Tratamientos
            db.query('DELETE FROM Historial_Tratamientos WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Historial_Tratamientos:', err);
                } else {
                    // Insertar nuevos registros en Historial_Tratamientos
                    if (tratamientos && Array.isArray(tratamientos)) {
                        tratamientos.forEach(tratamiento => {
                            const sqlTratamiento = `
                                INSERT INTO Historial_Tratamientos (idAnimal, idTratamientos, fecha)
                                VALUES (?, ?, ?)
                            `;
                            const valuesTratamiento = [id, tratamiento.id, tratamiento.fecha];
    
                            db.query(sqlTratamiento, valuesTratamiento, (err) => {
                                if (err) {
                                    console.error('Error al insertar en Historial de Tratamientos:', err);
                                } else {
                                    console.log('Historial de Tratamientos insertado:', valuesTratamiento);
                                }
                            });
                        });
                    }
                }
            });
    
            // Eliminar registros existentes en Historial_Productos
            db.query('DELETE FROM Historial_Productos WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Historial_Productos:', err);
                } else {
                    // Insertar nuevos registros en Historial_Productos
                    if (productos && Array.isArray(productos)) {
                        productos.forEach(producto => {
                            const sqlProducto = `
                                INSERT INTO Historial_Productos (idAnimal, idProductos, dosis, fecha)
                                VALUES (?, ?, ?, ?)
                            `;
                            const valuesProducto = [id, producto.id, producto.dosis, producto.fecha];
    
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
    
            // Eliminar registros existentes en Control_Banos
            db.query('DELETE FROM Control_Banos WHERE idAnimal = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar registros en Control_Banos:', err);
                } else {
                    // Insertar nuevos registros en Control_Banos
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
    
            res.status(200).json({ message: 'Registro de Animal actualizado con éxito' });
        });
    });
        
    


router.delete('/deleteAnimal/:id', (req, res) => {
    const id = req.params.id;

    const deleteHistorialEnfermedades = 'DELETE FROM Historial_Enfermedades WHERE idAnimal = ?';
    const deleteHistorialTratamientos = 'DELETE FROM Historial_Tratamientos WHERE idAnimal = ?';
    const deleteHistorialProductos = 'DELETE FROM Historial_Productos WHERE idAnimal = ?';
    const deleteControlBanos = 'DELETE FROM Control_Banos WHERE idAnimal = ?';
    const deleteProduccionLeche = 'DELETE FROM Produccion_Leche WHERE idAnimal = ?';
    const deleteAnimal = 'DELETE FROM Animales WHERE idAnimal = ?';

    db.query(deleteHistorialEnfermedades, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar historial de enfermedades:', err);
            return res.status(500).json({ error: 'Error al eliminar historial de enfermedades' });
        }
        
        db.query(deleteHistorialTratamientos, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar historial de tratamientos:', err);
                return res.status(500).json({ error: 'Error al eliminar historial de tratamientos' });
            }

            db.query(deleteHistorialProductos, [id], (err, result) => {
                if (err) {
                    console.error('Error al eliminar historial de productos:', err);
                    return res.status(500).json({ error: 'Error al eliminar historial de productos' });
                }

                db.query(deleteControlBanos, [id], (err, result) => {
                    if (err) {
                        console.error('Error al eliminar control de baños:', err);
                        return res.status(500).json({ error: 'Error al eliminar control de baños' });
                    }

                    db.query(deleteProduccionLeche, [id], (err, result) => {
                        if (err) {
                            console.error('Error al eliminar producción de leche:', err);
                            return res.status(500).json({ error: 'Error al eliminar producción de leche' });
                        }

                        db.query(deleteAnimal, [id], (err, result) => {
                            if (err) {
                                console.error('Error al eliminar registro de animal:', err);
                                return res.status(500).json({ error: 'Error al eliminar registro de animal' });
                            }

                            res.status(200).json({ message: 'Registro de animal eliminado con éxito' });
                        });
                    });
                });
            });
        });
    });
});



return router;
};