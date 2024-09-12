require('dotenv').config(); // Carga las variables de entorno desde un archivo .env
const express = require('express'); // Importa el framework de servidor web Express
const mysql = require('mysql'); // Importa el módulo MySQL para conectar a la base de datos
const cors = require('cors'); // Importa CORS para permitir solicitudes desde diferentes orígenes

const app = express(); // Crea una instancia de la aplicación Express
const port = 5000; // Define el puerto en el que se ejecutará el servidor

// Configuración de CORS
app.use(cors()); // Habilita CORS para permitir solicitudes de recursos cruzados

// Configuración para analizar solicitudes JSON con un límite de tamaño
app.use(express.json({ limit: '50mb' })); // Permite a la aplicación analizar solicitudes JSON con un tamaño máximo de 50MB

// Configuración de la conexión a la primera base de datos (BoVinoSmartBD)
const db = mysql.createConnection({
  host: 'localhost', // Host de la base de datos
  user: 'root', // Usuario de la base de datos
  password: 'Yamilg620', // Contraseña del usuario
  database: 'BoVinoSmartBD', // Nombre de la base de datos
});

// Conexión a la primera base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos BoVinoSmartBD');
  }
});

// Configuración de la conexión a la segunda base de datos (trazabilidad_ganaderaIA)
const db2 = mysql.createConnection({
  host: 'localhost', // Host de la base de datos
  user: 'root', // Usuario de la base de datos
  password: 'Yamilg620', // Contraseña del usuario
  database: 'trazabilidad_ganaderaIA', // Nombre de la base de datos
});

// Conexión a la segunda base de datos
db2.connect((err) => {
  if (err) {
    console.error('Error de conexión a la segunda base de datos:', err);
  } else {
    console.log('Conexión exitosa a la segunda base de datos trazabilidad_ganaderaIA');
  }
});

// Importar y usar rutas para la primera base de datos
const crudRoutes = require('./routes/crudRoutes')(db); // Importa las rutas CRUD para la primera base de datos y pasa la conexión a la base de datos
app.use('/crud', crudRoutes); // Asigna las rutas CRUD de la primera base de datos al prefijo '/crud'

// Importar y usar rutas para la segunda base de datos
const crudRoutesDb2 = require('./routes/crudRoutesDb2')(db2); // Importa las rutas CRUD para la segunda base de datos y pasa la conexión a la base de datos
app.use('/crudDb2', crudRoutesDb2); // Asigna las rutas CRUD de la segunda base de datos al prefijo '/crudDb2'

// Manejador de errores para errores de análisis JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).send({ error: 'Error en el formato JSON de la solicitud' });
  } else {
    next();
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor backend en funcionamiento en el puerto ${port}`);
});
