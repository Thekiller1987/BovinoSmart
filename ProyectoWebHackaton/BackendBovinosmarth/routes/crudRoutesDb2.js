require('dotenv').config();
const express = require('express');
const axios = require('axios');

module.exports = function(db) {
    const router = express.Router();

    // Ruta para obtener todas las enfermedades
    router.get('/enfermedades', (req, res) => {
        const query = 'SELECT * FROM enfermedades';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener las enfermedades:', err);
                res.status(500).send({ error: 'Error al obtener las enfermedades' });
            } else {
                res.json(results);
            }
        });
    });

    // Ruta para obtener todos los medicamentos
    router.get('/medicamentos', (req, res) => {
        const query = 'SELECT * FROM medicamentos';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener los medicamentos:', err);
                res.status(500).send({ error: 'Error al obtener los medicamentos' });
            } else {
                res.json(results);
            }
        });
    });

    // Ruta para obtener tratamientos para una enfermedad específica
    router.get('/tratamientos/:enfermedad_id', (req, res) => {
        const enfermedadId = req.params.enfermedad_id;
        const query = `
            SELECT tratamientos.*, medicamentos.nombre AS medicamento_nombre 
            FROM tratamientos 
            JOIN medicamentos ON tratamientos.medicamento_id = medicamentos.id 
            WHERE tratamientos.enfermedad_id = ?
        `;
        db.query(query, [enfermedadId], (err, results) => {
            if (err) {
                console.error('Error al obtener los tratamientos:', err);
                res.status(500).send({ error: 'Error al obtener los tratamientos' });
            } else {
                res.json(results);
            }
        });
    });

    // Ruta para procesar preguntas con Wit.ai
    router.post('/preguntar', async (req, res) => {
        const { pregunta } = req.body;

        try {
            // Realiza la solicitud a Wit.ai
            const witResponse = await axios.get(
                `https://api.wit.ai/message`,
                {
                    params: {
                        v: '20230820',  // Versión de la API
                        q: pregunta,    // La pregunta del usuario
                    },
                    headers: {
                        'Authorization': `Bearer ${process.env.WIT_API_TOKEN}`,  // Token de acceso de Wit.ai
                    },
                }
            );

            const entities = witResponse.data.entities;

            // Variables para almacenar valores detectados
            const enfermedad = entities['enfermedad:enfermedad'] ? entities['enfermedad:enfermedad'][0].value : null;
            const medicamento = entities['medicamento:medicamento'] ? entities['medicamento:medicamento'][0].value : null;
            const animal = entities['animal:animal'] ? entities['animal:animal'][0].value : null;

            if (enfermedad) {
                // Consulta la base de datos para encontrar el tratamiento correspondiente
                let query = `
                    SELECT tratamientos.descripcion, medicamentos.nombre AS medicamento_nombre 
                    FROM tratamientos 
                    JOIN medicamentos ON tratamientos.medicamento_id = medicamentos.id 
                    JOIN enfermedades ON tratamientos.enfermedad_id = enfermedades.id
                    WHERE enfermedades.nombre = ?
                `;
                const queryParams = [enfermedad];

                if (medicamento) {
                    query += ' AND medicamentos.nombre = ?';
                    queryParams.push(medicamento);
                }

                db.query(query, queryParams, (err, results) => {
                    if (err) {
                        console.error('Error al obtener los tratamientos:', err);
                        res.status(500).send({ error: 'Error al obtener los tratamientos' });
                    } else if (results.length > 0) {
                        const tratamiento = results[0];
                        res.json({
                            respuesta: `Para la enfermedad ${enfermedad}, se recomienda el tratamiento con ${tratamiento.medicamento_nombre}: ${tratamiento.descripcion}`
                        });
                    } else {
                        res.json({ respuesta: 'No se encontró un tratamiento específico para la combinación dada.' });
                    }
                });
            } else {
                res.json({ respuesta: 'No se pudieron identificar los datos necesarios en tu pregunta.' });
            }
        } catch (err) {
            console.error('Error al procesar la pregunta:', err.response ? err.response.data : err.message);
            res.status(500).send({ error: 'Error al procesar la pregunta' });
        }
    });



    return router;
};
