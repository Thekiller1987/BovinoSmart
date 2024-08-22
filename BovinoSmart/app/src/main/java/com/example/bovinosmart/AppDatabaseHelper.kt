import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class AppDatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        // Crear tabla Animales
        db.execSQL("""
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
                peso_actual REAL
            )
        """)

        // Crear tabla Enfermedades
        db.execSQL("""
            CREATE TABLE Enfermedades (
                idEnfermedades INTEGER PRIMARY KEY AUTOINCREMENT, 
                nombre TEXT UNIQUE, 
                descripcion TEXT
            )
        """)

        // Crear tabla Historial de Enfermedades
        db.execSQL("""
            CREATE TABLE Historial_Enfermedades (
                idHistoEnfermedades INTEGER PRIMARY KEY AUTOINCREMENT, 
                idAnimal INTEGER, 
                idEnfermedades INTEGER, 
                fecha DATE, 
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal), 
                FOREIGN KEY (idEnfermedades) REFERENCES Enfermedades(idEnfermedades)
            )
        """)

        // Crear tabla Tratamientos
        db.execSQL("""
            CREATE TABLE Tratamientos (
                idTratamientos INTEGER PRIMARY KEY AUTOINCREMENT, 
                tipo TEXT, 
                dosis TEXT, 
                motivo TEXT
            )
        """)

        // Crear tabla Historial de Tratamientos
        db.execSQL("""
            CREATE TABLE Historial_Tratamientos (
                idHistoTratamiento INTEGER PRIMARY KEY AUTOINCREMENT, 
                idAnimal INTEGER, 
                idTratamientos INTEGER, 
                fecha DATE, 
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal), 
                FOREIGN KEY (idTratamientos) REFERENCES Tratamientos(idTratamientos)
            )
        """)

        // Crear tabla Productos
        db.execSQL("""
            CREATE TABLE Productos (
                idProductos INTEGER PRIMARY KEY AUTOINCREMENT, 
                nombre TEXT UNIQUE, 
                tipo TEXT, 
                dosis_recomendada TEXT, 
                frecuencia_aplicacion TEXT, 
                notas TEXT
            )
        """)

        // Crear tabla Historial de Productos
        db.execSQL("""
            CREATE TABLE Historial_Productos (
                idHistoProducto INTEGER PRIMARY KEY AUTOINCREMENT, 
                idAnimal INTEGER, 
                idProductos INTEGER, 
                dosis TEXT, 
                fecha DATE, 
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal), 
                FOREIGN KEY (idProductos) REFERENCES Productos(idProductos)
            )
        """)

        // Crear tabla Control de Baños
        db.execSQL("""
            CREATE TABLE Control_Banos (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                idAnimal INTEGER, 
                fecha DATE, 
                productos_utilizados TEXT, 
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            )
        """)

        // Crear tabla Producción de Leche
        db.execSQL("""
            CREATE TABLE Produccion_Leche (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                idAnimal INTEGER, 
                fecha DATE, 
                cantidad REAL, 
                calidad TEXT, 
                FOREIGN KEY (idAnimal) REFERENCES Animales(idAnimal)
            )
        """)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Eliminar tablas si existen y recrearlas
        db.execSQL("DROP TABLE IF EXISTS Historial_Leche")
        db.execSQL("DROP TABLE IF EXISTS Control_Banos")
        db.execSQL("DROP TABLE IF EXISTS Historial_Productos")
        db.execSQL("DROP TABLE IF EXISTS Productos")
        db.execSQL("DROP TABLE IF EXISTS Historial_Tratamientos")
        db.execSQL("DROP TABLE IF EXISTS Tratamientos")
        db.execSQL("DROP TABLE IF EXISTS Historial_Enfermedades")
        db.execSQL("DROP TABLE IF EXISTS Enfermedades")
        db.execSQL("DROP TABLE IF EXISTS Animales")
        onCreate(db)
    }

    companion object {
        private const val DATABASE_NAME = "bovinosmart.db"
        private const val DATABASE_VERSION = 1
    }
}
