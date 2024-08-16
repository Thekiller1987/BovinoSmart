require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
const port = 5000;

// Configuración de CORS
app.use(cors());

// Agregar configuración para analizar solicitudes JSON con un límite de tamaño
app.use(express.json({ limit: '50mb' }));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yamilg620',
  database: 'BoVinoSmartBD',
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos BoVinoSmartBD');
  }
});



const db2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Yamilg620',
  database: 'trazabilidad_ganaderaIA',
});

db2.connect((err) => {
  if (err) {
    console.error('Error de conexión a la segunda base de datos:', err);
  } else {
    console.log('Conexión exitosa a la segunda base de datos trazabilidad_ganaderaIA');
  }
});



// Importar y usar rutas para la primera base de datos
const crudRoutes = require('./routes/crudRoutes')(db);
app.use('/crud', crudRoutes);


// Importar y usar rutas para la segunda base de datos
const crudRoutesDb2 = require('./routes/crudRoutesDb2')(db2);
app.use('/crudDb2', crudRoutesDb2);

// Manejador de errores para errores de análisis JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).send({ error: 'Error en el formato JSON de la solicitud' });
  } else {
    next();
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend en funcionamiento en el puerto ${port}`);
});


