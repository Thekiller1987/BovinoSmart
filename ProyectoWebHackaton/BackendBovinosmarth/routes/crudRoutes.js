const express = require('express');
const router = express.Router();

module.exports = (db) => {


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
        peso_actual
    } = req.body;

    if (!nombre || !sexo || !codigo_idVaca || !fecha_nacimiento || !raza) {
        return res.status(400).json({ error: 'Los campos "nombre", "sexo", "codigo_idVaca", "fecha_nacimiento" y "raza" son obligatorios' });
    }

    const sql = `
        INSERT INTO Animales (nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar registro de Animal:', err);
            res.status(500).json({ error: 'Error al insertar registro de Animal' });
        } else {
            res.status(201).json({ idAnimal: result.insertId });
        }
    });
});






router.get('/listarAnimales', (req, res) => {
    const sql = `
        SELECT * FROM Animales
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
    const { nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual } = req.body;

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
            res.status(500).json({ error: 'Error al actualizar registro de Animal' });
        } else {
            res.status(200).json({ message: 'Registro de Animal actualizado con éxito' });
        }
    });
});


router.delete('/deleteAnimal/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM Animales WHERE idAnimal = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar registro de Animal:', err);
            res.status(500).json({ error: 'Error al eliminar registro de Animal' });
        } else {
            res.status(200).json({ message: 'Registro de Animal eliminado con éxito' });
        }
    });
});


return router;
};