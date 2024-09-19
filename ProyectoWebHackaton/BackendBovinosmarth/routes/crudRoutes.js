const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { client } = require('../paypal'); // Importa la configuración de PayPal



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



    router.post('/crear-pedido', authenticateToken, async (req, res) => {
        const { idLicencia } = req.body; // ID de la licencia seleccionada
        const { id } = req.user; // ID del usuario autenticado

        // Consulta para obtener los detalles de la licencia seleccionada
        const query = 'SELECT * FROM Licencias WHERE idLicencia = ?';
        db.query(query, [idLicencia], async (err, results) => {
            if (err) {
                console.error('Error al obtener detalles de la licencia:', err);
                return res.status(500).json({ error: 'Error al obtener detalles de la licencia' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Licencia no encontrada' });
            }

            const licencia = results[0];

            // Crear el pedido con PayPal
            const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: licencia.costo.toString() // Costo de la licencia
                    },
                    description: licencia.descripcion
                }],
                application_context: {
                    return_url: `${process.env.FRONTEND_URL}/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/cancel`
                }
            });

            try {
                const order = await client().execute(request);
                res.json({ id: order.result.id });
            } catch (error) {
                console.error('Error al crear el pedido en PayPal:', error);
                res.status(500).json({ error: 'Error al crear el pedido' });
            }
        });
    });







    router.post('/capturar-pago', authenticateToken, async (req, res) => {
        const { orderID } = req.body; // El ID del pedido de PayPal
        const { id } = req.user; // ID del usuario autenticado

        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        try {
            const capture = await client().execute(request);

            if (capture.result.status === 'COMPLETED') {
                const idLicencia = capture.result.purchase_units[0].description; // Obtener el ID de licencia desde la descripción del pedido

                // Actualizar la licencia del usuario en la base de datos
                const query = 'UPDATE Usuarios SET idLicencia = ? WHERE idUsuario = ?';
                db.query(query, [idLicencia, id], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la licencia del usuario:', err);
                        return res.status(500).json({ error: 'Error al actualizar la licencia' });
                    }

                    res.status(200).json({ message: 'Pago capturado y licencia actualizada correctamente' });
                });
            } else {
                res.status(400).json({ error: 'Pago no completado' });
            }
        } catch (error) {
            console.error('Error al capturar el pago de PayPal:', error);
            res.status(500).json({ error: 'Error al capturar el pago' });
        }
    });










    // Ruta para obtener todas las licencias
    router.get('/licencias', (req, res) => {
        const sql = 'SELECT * FROM Licencias';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener licencias:', err);
                return res.status(500).json({ error: 'Error al obtener licencias' });
            }
            res.status(200).json(results);
        });
    });



    router.post('/update-licencia', authenticateToken, (req, res) => {
        const { tipoLicencia } = req.body;
        const userId = req.user.id; // Obtén el ID del usuario del token de autenticación

        // Verifica si el usuario tiene el rol de "Ganadero"
        if (req.user.rol !== 'Ganadero') {
            return res.status(403).json({ error: 'No tienes permisos para actualizar la licencia' });
        }

        const queryLicencia = 'SELECT idLicencia FROM Licencias WHERE tipo = ?';
        db.query(queryLicencia, [tipoLicencia], (err, results) => {
            if (err || results.length === 0) {
                console.error('Error al buscar licencia:', err);
                return res.status(404).json({ error: 'Licencia no encontrada' });
            }

            const idLicencia = results[0].idLicencia;
            const queryUpdate = 'UPDATE Usuarios SET idLicencia = ? WHERE idUsuario = ?';
            db.query(queryUpdate, [idLicencia, userId], (err) => {
                if (err) {
                    console.error('Error al actualizar licencia del usuario:', err);
                    return res.status(500).json({ error: 'Error al actualizar licencia' });
                }

                res.status(200).json({ message: 'Licencia actualizada correctamente' });
            });
        });
    });







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






    // Ruta para registrar un nuevo animal
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
            estado,
            inseminacion,
            estadoReproductivo,
            inseminaciones,
            idFinca // Nuevo: Relación con la tabla Fincas
        } = req.body;

        const insertAnimalQuery = `
        INSERT INTO Animales (
            nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones,
            peso_nacimiento, peso_destete, peso_actual, estado, inseminacion, idFinca
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const animalParams = [
            nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones,
            peso_nacimiento, peso_destete, peso_actual, estado, inseminacion, idFinca
        ];

        db.query(insertAnimalQuery, animalParams, (err, animalResult) => {
            if (err) {
                console.error('Error al insertar registro de Animal:', err);
                res.status(500).json({ error: 'Error al registrar el animal' });
                return;
            }

            const idAnimal = animalResult.insertId;

            // Paso 2: Insertar el estado reproductivo en la tabla Estado_Reproductivo
            if (estadoReproductivo && (sexo === 'Hembra' || sexo === 'Macho')) {
                const insertEstadoReproductivoQuery = `
                INSERT INTO Estado_Reproductivo (
                    idAnimal, ciclo_celo, fecha_ultimo_celo, servicios_realizados, numero_gestaciones,
                    partos_realizados, resultados_lactancia, uso_programa_inseminacion, resultado_prueba_reproductiva
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

                const estadoReproductivoParams = [
                    idAnimal,
                    estadoReproductivo.ciclo_celo || null,
                    estadoReproductivo.fecha_ultimo_celo || null,
                    estadoReproductivo.servicios_realizados || null,
                    estadoReproductivo.numero_gestaciones || null,
                    estadoReproductivo.partos_realizados || null,
                    estadoReproductivo.resultados_lactancia || null,
                    estadoReproductivo.uso_programa_inseminacion || null,
                    estadoReproductivo.resultado_prueba_reproductiva || null
                ];

                db.query(insertEstadoReproductivoQuery, estadoReproductivoParams, (err) => {
                    if (err) {
                        console.error('Error al insertar registro de Estado Reproductivo:', err);
                        res.status(500).json({ error: 'Error al registrar el estado reproductivo' });
                        return;
                    }

                    insertInseminaciones(idAnimal, inseminaciones, res);
                });
            } else {
                insertInseminaciones(idAnimal, inseminaciones, res);
            }
        });
    });

    // Inserción de inseminaciones
    function insertInseminaciones(idAnimal, inseminaciones, res) {
        if (inseminaciones && Array.isArray(inseminaciones) && inseminaciones.length > 0) {
            const inseminacionesQueries = inseminaciones.map((inseminacion) => {
                const insertInseminacionQuery = `
                INSERT INTO Inseminaciones (
                    idAnimal, fecha_inseminacion, tipo_inseminacion, resultado, observaciones
                ) VALUES (?, ?, ?, ?, ?)
            `;
                const inseminacionParams = [
                    idAnimal,
                    inseminacion.fecha_inseminacion || null,
                    inseminacion.tipo_inseminacion || null,
                    inseminacion.resultado || null,
                    inseminacion.observaciones || null
                ];

                return new Promise((resolve, reject) => {
                    db.query(insertInseminacionQuery, inseminacionParams, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(inseminacionesQueries)
                .then(() => {
                    res.status(200).json({ message: 'Animal, estado reproductivo e inseminaciones registrados exitosamente' });
                })
                .catch((err) => {
                    console.error('Error al insertar inseminaciones:', err);
                    res.status(500).json({ error: 'Error al registrar las inseminaciones' });
                });
        } else {
            res.status(200).json({ message: 'Animal registrado exitosamente' });
        }
    }



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
                 WHERE I.idAnimal = A.idAnimal) AS observaciones_inseminacion,
                -- Aquí se añaden los campos de la tabla Estado_Reproductivo
                ER.ciclo_celo,
                ER.fecha_ultimo_celo,
                ER.servicios_realizados,
                ER.numero_gestaciones,
                ER.partos_realizados,
                ER.resultados_lactancia,
                ER.uso_programa_inseminacion,
                ER.resultado_prueba_reproductiva
            FROM 
                Animales A
            LEFT JOIN Estado_Reproductivo ER ON A.idAnimal = ER.idAnimal
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
    

    router.put('/updateAnimal/:id', async (req, res) => {
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
            inseminaciones,
            estadoReproductivo // Incluye los datos de estado reproductivo
        } = req.body;

        if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
            return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
        }

        const sqlAnimal = `
            UPDATE Animales
            SET nombre = ?, sexo = ?, imagen = ?, codigo_idVaca = ?, fecha_nacimiento = ?, raza = ?, observaciones = ?, peso_nacimiento = ?, peso_destete = ?, peso_actual = ?, estado = ?, inseminacion = ?
            WHERE idAnimal = ?
        `;
        const valuesAnimal = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, estado, inseminacion, id];

        try {
            // Actualizar registro del animal
            await db.query(sqlAnimal, valuesAnimal);

            console.log('Datos de Animal actualizados correctamente.');

            // Actualizar o eliminar registros relacionados
            await actualizarHistorialEnfermedades(db, id, enfermedades);
            await actualizarHistorialProductos(db, id, productos);
            await actualizarControlBanos(db, id, control_banos);
            await actualizarProduccionLeche(db, id, produccion_leche);
            await actualizarInseminaciones(db, id, inseminaciones);

            // Actualizar el estado reproductivo si se envía
            if (estadoReproductivo) {
                await actualizarEstadoReproductivo(db, id, estadoReproductivo);
            }

            res.status(200).json({ message: 'Animal y datos relacionados actualizados correctamente' });

        } catch (err) {
            console.error('Error al actualizar los registros:', err);
            res.status(500).json({ error: 'Error al actualizar los registros' });
        }
    });

    // Función para actualizar el historial de enfermedades
    async function actualizarHistorialEnfermedades(db, idAnimal, enfermedades) {
        await db.query('DELETE FROM Historial_Enfermedades WHERE idAnimal = ?', [idAnimal]);

        if (enfermedades && Array.isArray(enfermedades)) {
            for (const enfermedad of enfermedades) {
                const sqlEnfermedad = `INSERT INTO Historial_Enfermedades (idAnimal, idEnfermedades, fecha) VALUES (?, ?, ?)`;
                const valuesEnfermedad = [idAnimal, enfermedad.id, enfermedad.fecha];
                await db.query(sqlEnfermedad, valuesEnfermedad);
            }
        }
    }

    // Función para actualizar el historial de productos
    async function actualizarHistorialProductos(db, idAnimal, productos) {
        await db.query('DELETE FROM Historial_Productos WHERE idAnimal = ?', [idAnimal]);

        if (productos && Array.isArray(productos)) {
            for (const producto of productos) {
                const sqlProducto = `INSERT INTO Historial_Productos (idAnimal, idProductos, dosis, fecha, es_tratamiento) VALUES (?, ?, ?, ?, ?)`;
                const valuesProducto = [idAnimal, producto.id, producto.dosis, producto.fecha, producto.es_tratamiento];
                await db.query(sqlProducto, valuesProducto);
            }
        }
    }

    // Función para actualizar el control de baños
    async function actualizarControlBanos(db, idAnimal, control_banos) {
        await db.query('DELETE FROM Control_Banos WHERE idAnimal = ?', [idAnimal]);

        if (control_banos && Array.isArray(control_banos)) {
            for (const bano of control_banos) {
                const sqlBano = `INSERT INTO Control_Banos (idAnimal, fecha, productos_utilizados) VALUES (?, ?, ?)`;
                const valuesBano = [idAnimal, bano.fecha, bano.productos_utilizados];
                await db.query(sqlBano, valuesBano);
            }
        }
    }

    // Función para actualizar la producción de leche
    async function actualizarProduccionLeche(db, idAnimal, produccion_leche) {
        await db.query('DELETE FROM Produccion_Leche WHERE idAnimal = ?', [idAnimal]);

        if (produccion_leche && Array.isArray(produccion_leche)) {
            for (const leche of produccion_leche) {
                const sqlLeche = `INSERT INTO Produccion_Leche (idAnimal, fecha, cantidad, calidad) VALUES (?, ?, ?, ?)`;
                const valuesLeche = [idAnimal, leche.fecha, leche.cantidad, leche.calidad];
                await db.query(sqlLeche, valuesLeche);
            }
        }
    }

    // Función para actualizar las inseminaciones
    async function actualizarInseminaciones(db, idAnimal, inseminaciones) {
        await db.query('DELETE FROM Inseminaciones WHERE idAnimal = ?', [idAnimal]);

        if (inseminaciones && Array.isArray(inseminaciones)) {
            for (const inseminacion of inseminaciones) {
                const sqlInseminacion = `INSERT INTO Inseminaciones (idAnimal, fecha_inseminacion, tipo_inseminacion, resultado, observaciones) VALUES (?, ?, ?, ?, ?)`;
                const valuesInseminacion = [idAnimal, inseminacion.fecha, inseminacion.tipo, inseminacion.resultado, inseminacion.observaciones];
                await db.query(sqlInseminacion, valuesInseminacion);
            }
        }
    }

    async function actualizarEstadoReproductivo(db, idAnimal, estadoReproductivo) {
        if (!estadoReproductivo || typeof estadoReproductivo !== 'object') {
            console.error('El valor de estadoReproductivo no es un objeto válido:', estadoReproductivo);
            return;
        }
    
        // Extraer los valores del objeto estadoReproductivo
        const {
            ciclo_celo,
            fecha_ultimo_celo,
            servicios_realizados,
            numero_gestaciones,
            partos_realizados,
            resultados_lactancia,
            uso_programa_inseminacion,
            resultado_prueba_reproductiva
        } = estadoReproductivo;
    
        // Convertir las fechas al formato adecuado (YYYY-MM-DD)
        const formattedFechaUltimoCelo = fecha_ultimo_celo ? new Date(fecha_ultimo_celo).toISOString().split('T')[0] : null;
    
        const sqlEstadoReproductivo = `
            UPDATE Estado_Reproductivo SET 
            ciclo_celo = ?,
            fecha_ultimo_celo = ?,
            servicios_realizados = ?,
            numero_gestaciones = ?,
            partos_realizados = ?,
            resultados_lactancia = ?,
            uso_programa_inseminacion = ?,
            resultado_prueba_reproductiva = ?
            WHERE idAnimal = ?
        `;
    
        const valuesEstadoReproductivo = [
            ciclo_celo || null,
            formattedFechaUltimoCelo,
            servicios_realizados || null,
            numero_gestaciones || null,
            partos_realizados || null,
            resultados_lactancia || null,
            uso_programa_inseminacion || null,
            resultado_prueba_reproductiva || null,
            idAnimal
        ];
    
        try {
            await db.query(sqlEstadoReproductivo, valuesEstadoReproductivo);
            console.log('Estado reproductivo actualizado correctamente.');
        } catch (err) {
            console.error('Error al actualizar el estado reproductivo:', err);
            throw err;
        }
    }




    router.delete('/deleteAnimal/:id', async (req, res) => {
        const id = req.params.id;
    
        // Lista de consultas SQL para eliminar los registros relacionados
        const queries = [
            { sql: 'DELETE FROM Estado_Reproductivo WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Historial_Enfermedades WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Historial_Productos WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Control_Banos WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Produccion_Leche WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Inseminaciones WHERE idAnimal = ?', params: [id] },
            { sql: 'DELETE FROM Animales WHERE idAnimal = ?', params: [id] }
        ];
    
        try {
            // Iniciar una transacción
            await startTransaction();
    
            // Ejecutar todas las consultas de eliminación de forma secuencial
            for (const query of queries) {
                await executeQuery(query.sql, query.params);
            }
    
            // Si todas las consultas se ejecutan correctamente, confirmar la transacción
            await commitTransaction();
    
            res.status(200).json({ message: 'Registro de animal eliminado con éxito' });
        } catch (err) {
            console.error('Error al eliminar registros:', err);
            // En caso de error, revertir la transacción
            await rollbackTransaction();
            res.status(500).json({ error: 'Error al eliminar registros' });
        }
    });
    
    // Función para ejecutar consultas SQL
    const executeQuery = (sql, params) => {
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
    
    // Funciones para manejar transacciones
    const startTransaction = () => {
        return new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
    
    const commitTransaction = () => {
        return new Promise((resolve, reject) => {
            db.commit((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
    
    const rollbackTransaction = () => {
        return new Promise((resolve, reject) => {
            db.rollback(() => {
                resolve(); // No necesitamos capturar errores aquí, ya que la reversión es la acción final
            });
        });
    };
    


    //Apartado de enfermedades

    // Crear una nueva enfermedad
    router.post('/enfermedades', (req, res) => {
        const { nombre, descripcion, sintomas, modotrasmision, imagen } = req.body; // Incluye los nuevos campos en la desestructuración

        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = 'INSERT INTO Enfermedades (nombre, descripcion, sintomas, modotrasmision, imagen) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nombre, descripcion, sintomas, modotrasmision, imagen], (err, result) => {
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
        const { nombre, descripcion, sintomas, modotrasmision, imagen } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = 'UPDATE Enfermedades SET nombre = ?, descripcion = ?, sintomas = ?, modotrasmision = ?, imagen = ? WHERE idEnfermedades = ?';
        db.query(sql, [nombre, descripcion, sintomas, modotrasmision, imagen, id], (err, result) => {
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
        const { nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo, imagen } = req.body; // Añadido 'imagen'

        // Validar los campos obligatorios
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = `
    INSERT INTO Productos (nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo, imagen) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento || false, motivo || null, imagen || null]; // Añadido 'imagen'

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
        const { nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento, motivo, imagen } = req.body; // Añadido 'imagen'

        // Validar los campos obligatorios
        if (!nombre) {
            return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
        }

        const sql = `
    UPDATE Productos 
    SET nombre = ?, tipo = ?, dosis_recomendada = ?, frecuencia_aplicacion = ?, notas = ?, es_tratamiento = ?, motivo = ?, imagen = ? 
    WHERE idProductos = ?
    `;

        const values = [nombre, tipo, dosis_recomendada, frecuencia_aplicacion, notas, es_tratamiento || false, motivo || null, imagen || null, id]; // Añadido 'imagen'

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

        // El rol por defecto es "Empleado" y la licencia básica por defecto
        const rol = 'Empleado';
        const idLicencia = 1; // ID de la licencia básica

        // Validación de entrada
        if (!nombre_usuario || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Encriptar la contraseña
        const hashedPassword = bcrypt.hashSync(contrasena, 10);

        // Insertar un nuevo usuario con licencia básica y rol de "Empleado"
        const query = 'INSERT INTO Usuarios (nombre_usuario, contrasena, rol, idLicencia) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre_usuario, hashedPassword, rol, idLicencia], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).json({ error: 'Error al registrar usuario' });
            }
            res.json({ message: 'Usuario registrado correctamente' });
        });
    });



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

            // Generar un token JWT con información adicional sobre el usuario
            const token = jwt.sign({ id: user.idUsuario, rol: user.rol, idLicencia: user.idLicencia }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Devolver el token y el rol
            res.json({ message: 'Inicio de sesión exitoso', token, rol: user.rol, idLicencia: user.idLicencia });
        });
    });






    const verificarPermisos = (funcionalidad) => {
        return (req, res, next) => {
            const { idLicencia } = req.user;  // Asume que la información del usuario se almacena en req.user
            const query = 'SELECT caracteristicas FROM Licencias WHERE idLicencia = ?';

            db.query(query, [idLicencia], (err, results) => {
                if (err) {
                    console.error('Error al verificar permisos:', err);
                    return res.status(500).json({ error: 'Error al verificar permisos' });
                }

                if (results.length === 0) {
                    return res.status(403).json({ error: 'Licencia no válida' });
                }

                const licencia = JSON.parse(results[0].caracteristicas);
                if (licencia.funcionalidades.includes(funcionalidad)) {
                    next();  // Permitir el acceso si la funcionalidad está permitida por la licencia
                } else {
                    res.status(403).json({ error: 'No tienes permisos para esta funcionalidad' });
                }
            });
        };
    };

    // Ejemplo de uso del middleware
    router.get('/gestion-finca', verificarPermisos('gestion_finca'), (req, res) => {
        res.json({ message: 'Acceso a la gestión de la finca permitido' });
    });




    // Ruta para obtener todos los usuarios
    router.get('/usuarios', authenticateToken, (req, res) => {
        const sql = 'SELECT * FROM Usuarios';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                return res.status(500).json({ error: 'Error al obtener usuarios' });
            }
            res.status(200).json(results);
        });
    });

    // Ruta para actualizar un usuario
    router.put('/usuarios/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
        const { nombre_usuario, rol } = req.body;

        if (!nombre_usuario) {
            return res.status(400).json({ error: 'El campo "nombre_usuario" es obligatorio' });
        }

        const sql = 'UPDATE Usuarios SET nombre_usuario = ?, rol = ? WHERE idUsuario = ?';
        db.query(sql, [nombre_usuario, rol, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        });
    });

    // Ruta para eliminar un usuario
    router.delete('/usuarios/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM Usuarios WHERE idUsuario = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar usuario:', err);
                return res.status(500).json({ error: 'Error al eliminar usuario' });
            }
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        });
    });




    // Ruta para actualizar la contraseña de un usuario
    router.put('/usuarios/:id/password', authenticateToken, (req, res) => {
        const id = req.params.id;
        const { nueva_contrasena } = req.body;

        if (!nueva_contrasena) {
            return res.status(400).json({ error: 'El campo "nueva_contrasena" es obligatorio' });
        }

        // Encripta la nueva contraseña
        const hashedPassword = bcrypt.hashSync(nueva_contrasena, 10);

        const sql = 'UPDATE Usuarios SET contrasena = ? WHERE idUsuario = ?';
        db.query(sql, [hashedPassword, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar la contraseña del usuario:', err);
                return res.status(500).json({ error: 'Error al actualizar la contraseña del usuario' });
            }
            res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        });
    });

    //---------------------------------------------------------------------------------------------------------------------




    router.post('/estado-reproductivo', authenticateToken, (req, res) => {
        const {
            idAnimal,
            ciclo_celo = '',
            fecha_ultimo_celo = null,
            servicios_realizados = 0,
            numero_gestaciones = 0,
            partos_realizados = 0,
            resultados_lactancia = '',
            fecha_ultima_prueba_reproductiva = null,
            resultado_prueba_reproductiva = ''
        } = req.body;

        const sql = `
        INSERT INTO estado_reproductivo (
            idAnimal, ciclo_celo, fecha_ultimo_celo, servicios_realizados,
            numero_gestaciones, partos_realizados, resultados_lactancia,
            fecha_ultima_prueba_reproductiva, resultado_prueba_reproductiva
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            idAnimal,
            ciclo_celo,
            fecha_ultimo_celo ? fecha_ultimo_celo : null,
            servicios_realizados ? servicios_realizados : 0,
            numero_gestaciones ? numero_gestaciones : 0,
            partos_realizados ? partos_realizados : 0,
            resultados_lactancia,
            fecha_ultima_prueba_reproductiva ? fecha_ultima_prueba_reproductiva : null,
            resultado_prueba_reproductiva
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al crear el estado reproductivo:', err);
                return res.status(500).json({ error: 'Error al crear el estado reproductivo' });
            }
            res.status(201).json({ message: 'Estado reproductivo creado con éxito', id: result.insertId });
        });
    });


    // Leer todos los registros de estado reproductivo
    router.get('/estado-reproductivo', authenticateToken, (req, res) => {
        const sql = 'SELECT * FROM Estado_Reproductivo';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error al obtener estados reproductivos:', err);
                return res.status(500).json({ error: 'Error al obtener estados reproductivos' });
            }
            res.status(200).json(results);
        });
    });

    // Leer un estado reproductivo por ID
    router.get('/estado-reproductivo/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
        const sql = 'SELECT * FROM Estado_Reproductivo WHERE idEstadoReproductivo = ?';
        db.query(sql, [id], (err, results) => {
            if (err) {
                console.error('Error al obtener el estado reproductivo:', err);
                return res.status(500).json({ error: 'Error al obtener el estado reproductivo' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Estado reproductivo no encontrado' });
            }
            res.status(200).json(results[0]);
        });
    });

    // Actualizar un estado reproductivo por ID
    router.put('/estado-reproductivo/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
        const {
            ciclo_celo,
            fecha_ultimo_celo,
            servicios_realizados,
            numero_gestaciones,
            partos_realizados,
            resultados_lactancia,
            fecha_ultima_prueba_reproductiva,
            resultado_prueba_reproductiva
        } = req.body;

        const sql = `
        UPDATE Estado_Reproductivo SET 
        ciclo_celo = ?, fecha_ultimo_celo = ?, servicios_realizados = ?,
        numero_gestaciones = ?, partos_realizados = ?, resultados_lactancia = ?,
        fecha_ultima_prueba_reproductiva = ?, resultado_prueba_reproductiva = ?
        WHERE idEstadoReproductivo = ?
    `;

        const values = [
            ciclo_celo, fecha_ultimo_celo, servicios_realizados,
            numero_gestaciones, partos_realizados, resultados_lactancia,
            fecha_ultima_prueba_reproductiva, resultado_prueba_reproductiva, id
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error al actualizar el estado reproductivo:', err);
                return res.status(500).json({ error: 'Error al actualizar el estado reproductivo' });
            }
            res.status(200).json({ message: 'Estado reproductivo actualizado con éxito' });
        });
    });

    // Eliminar un estado reproductivo por ID
    router.delete('/estado-reproductivo/:id', authenticateToken, (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM Estado_Reproductivo WHERE idEstadoReproductivo = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar el estado reproductivo:', err);
                return res.status(500).json({ error: 'Error al eliminar el estado reproductivo' });
            }
            res.status(200).json({ message: 'Estado reproductivo eliminado con éxito' });
        });
    });








    

    return router;
};