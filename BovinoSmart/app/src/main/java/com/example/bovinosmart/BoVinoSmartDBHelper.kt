package com.example.bovinosmart.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class BoVinoSmartDBHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "BoVinoSmartBD.db"
        const val DATABASE_VERSION = 2  // Aumentar la versión de la base de datos
    }

    override fun onCreate(db: SQLiteDatabase?) {
        // Crear las tablas aquí
        db?.execSQL(
            """
            CREATE TABLE Ganaderos (
                idGanadero INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                contacto TEXT,
                direccion TEXT
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Animales (
                idAnimal INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                sexo TEXT,
                imagen TEXT,
                codigo_idVaca TEXT UNIQUE,
                fecha_nacimiento DATE,
                raza TEXT,
                observaciones TEXT,
                peso_nacimiento REAL,
                peso_destete REAL,
                peso_actual REAL,
                estado TEXT,
                inseminacion BOOLEAN DEFAULT 0
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Enfermedades (
                idEnfermedades INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT UNIQUE,
                descripcion TEXT,
                sintomas TEXT,
                modotrasmision TEXT,
                imagen TEXT
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Historial_Enfermedades (
                idHistoEnfermedades INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                idEnfermedades INTEGER,
                fecha DATE,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal),
                FOREIGN KEY (idEnfermedades) REFERENCES Enfermedades(idEnfermedades)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Productos (
                idProductos INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT UNIQUE,
                tipo TEXT,
                dosis_recomendada TEXT,
                frecuencia_aplicacion TEXT,
                notas TEXT,
                es_tratamiento BOOLEAN DEFAULT 0,
                motivo TEXT,
                imagen TEXT
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Historial_Productos (
                idHistoProducto INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                idProductos INTEGER,
                dosis TEXT,
                fecha DATE,
                es_tratamiento BOOLEAN DEFAULT 0,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal),
                FOREIGN KEY (idProductos) REFERENCES Productos(idProductos)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Control_Banos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                fecha DATE,
                productos_utilizados TEXT,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Produccion_Leche (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                fecha DATE,
                cantidad REAL,
                calidad TEXT,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Inseminaciones (
                idInseminacion INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                fecha_inseminacion DATE,
                tipo_inseminacion TEXT,
                resultado TEXT,
                observaciones TEXT,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Estado_Reproductivo (
                idEstadoReproductivo INTEGER PRIMARY KEY AUTOINCREMENT,
                idAnimal INTEGER,
                ciclo_celo TEXT,
                fecha_ultimo_celo DATE,
                servicios_realizados INTEGER,
                numero_gestaciones INTEGER,
                partos_realizados INTEGER,
                resultados_lactancia TEXT,
                uso_programa_inseminacion TEXT,
                resultado_prueba_reproductiva TEXT,
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Licencias (
                idLicencia INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT,
                descripcion TEXT,
                costo REAL,
                caracteristicas TEXT  -- Almacenado como JSON
            );
            """
        )

        db?.execSQL(
            """
            CREATE TABLE Usuarios (
                idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre_usuario TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ultimo_acceso DATETIME,
                estado TEXT DEFAULT 'Activo',
                rol TEXT DEFAULT 'Empleado',
                idLicencia INTEGER,
                FOREIGN KEY (idLicencia) REFERENCES Licencias(idLicencia)
            );
            """
        )
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        // Elimina las tablas que ya no son necesarias
        db?.execSQL("DROP TABLE IF EXISTS Fincas")
        db?.execSQL("DROP TABLE IF EXISTS Ganaderos_Fincas")

        // Actualiza la estructura eliminando la relación con Fincas
        db?.execSQL("CREATE TEMPORARY TABLE Animales_backup AS SELECT * FROM Animales;")
        db?.execSQL("DROP TABLE Animales;")
        db?.execSQL(
            """
            CREATE TABLE Animales (
                idAnimal INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                sexo TEXT,
                imagen TEXT,
                codigo_idVaca TEXT UNIQUE,
                fecha_nacimiento DATE,
                raza TEXT,
                observaciones TEXT,
                peso_nacimiento REAL,
                peso_destete REAL,
                peso_actual REAL,
                estado TEXT,
                inseminacion BOOLEAN DEFAULT 0
            );
            """
        )
        db?.execSQL("INSERT INTO Animales SELECT idAnimal, nombre, sexo, imagen, codigo_idVaca, fecha_nacimiento, raza, observaciones, peso_nacimiento, peso_destete, peso_actual, estado, inseminacion FROM Animales_backup;")
        db?.execSQL("DROP TABLE Animales_backup;")
    }
}
