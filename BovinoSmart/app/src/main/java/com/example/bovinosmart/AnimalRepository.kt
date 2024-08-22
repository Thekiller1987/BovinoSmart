import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

// Data class representing the structure of the "Animales" table
data class Animales(
    val id: Long,
    val nombre: String,
    val sexo: String,
    val imagen: ByteArray?, // Cambiar a ByteArray para imagen
    val codigoId: String,
    val fechaNacimiento: String,
    val raza: String,
    val observaciones: String,
    val pesoNacimiento: Double,
    val pesoDestete: Double,
    val pesoActual: Double
)

class MyAnimalRepository(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "bovinosmart.db"
        private const val DATABASE_VERSION = 1
        private const val TABLE_NAME = "Animales" // Nombre de tabla debe coincidir con el esquema
    }

    override fun onCreate(db: SQLiteDatabase) {
        val createTable = """
            CREATE TABLE $TABLE_NAME (
                idAnimal INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                sexo TEXT,
                imagen BLOB,
                codigo_idVaca TEXT UNIQUE,
                fecha_nacimiento DATE,
                raza TEXT,
                observaciones TEXT,
                peso_nacimiento REAL,
                peso_destete REAL,
                peso_actual REAL
            )
        """
        db.execSQL(createTable)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    fun insert(animales: Animales) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("nombre", animales.nombre)
            put("sexo", animales.sexo)
            put("imagen", animales.imagen)
            put("codigo_idVaca", animales.codigoId) // Ajusta al nombre correcto de la columna
            put("fecha_nacimiento", animales.fechaNacimiento)
            put("raza", animales.raza)
            put("observaciones", animales.observaciones)
            put("peso_nacimiento", animales.pesoNacimiento)
            put("peso_destete", animales.pesoDestete)
            put("peso_actual", animales.pesoActual)
        }

        db.insert(TABLE_NAME, null, values)
        db.close()
    }

    fun update(animales: Animales) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("nombre", animales.nombre)
            put("sexo", animales.sexo)
            put("imagen", animales.imagen)
            put("codigo_idVaca", animales.codigoId) // Ajusta al nombre correcto de la columna
            put("fecha_nacimiento", animales.fechaNacimiento)
            put("raza", animales.raza)
            put("observaciones", animales.observaciones)
            put("peso_nacimiento", animales.pesoNacimiento)
            put("peso_destete", animales.pesoDestete)
            put("peso_actual", animales.pesoActual)
        }

        db.update(TABLE_NAME, values, "idAnimal = ?", arrayOf(animales.id.toString()))
        db.close()
    }

    fun getAnimalById(id: Long): Animales? {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_NAME,
            null,
            "idAnimal = ?",
            arrayOf(id.toString()),
            null,
            null,
            null
        )

        return if (cursor.moveToFirst()) {
            val nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
            val sexo = cursor.getString(cursor.getColumnIndexOrThrow("sexo"))
            val imagen = cursor.getBlob(cursor.getColumnIndexOrThrow("imagen"))
            val codigoId = cursor.getString(cursor.getColumnIndexOrThrow("codigo_idVaca")) // Ajusta al nombre correcto de la columna
            val fechaNacimiento = cursor.getString(cursor.getColumnIndexOrThrow("fecha_nacimiento"))
            val raza = cursor.getString(cursor.getColumnIndexOrThrow("raza"))
            val observaciones = cursor.getString(cursor.getColumnIndexOrThrow("observaciones"))
            val pesoNacimiento = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_nacimiento"))
            val pesoDestete = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_destete"))
            val pesoActual = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_actual"))

            Animales(id, nombre, sexo, imagen, codigoId, fechaNacimiento, raza, observaciones, pesoNacimiento, pesoDestete, pesoActual)
        } else {
            null
        }.also {
            cursor.close()
            db.close()
        }
    }

    fun getAll(): List<Animales> {
        val db = readableDatabase
        val cursor = db.query(TABLE_NAME, null, null, null, null, null, null)
        val animalesList = mutableListOf<Animales>()

        with(cursor) {
            while (moveToNext()) {
                val animales = Animales(
                    id = getLong(getColumnIndexOrThrow("idAnimal")), // Ajusta al nombre correcto de la columna
                    nombre = getString(getColumnIndexOrThrow("nombre")),
                    sexo = getString(getColumnIndexOrThrow("sexo")),
                    imagen = getBlob(getColumnIndexOrThrow("imagen")),
                    codigoId = getString(getColumnIndexOrThrow("codigo_idVaca")), // Ajusta al nombre correcto de la columna
                    fechaNacimiento = getString(getColumnIndexOrThrow("fecha_nacimiento")),
                    raza = getString(getColumnIndexOrThrow("raza")),
                    observaciones = getString(getColumnIndexOrThrow("observaciones")),
                    pesoNacimiento = getDouble(getColumnIndexOrThrow("peso_nacimiento")),
                    pesoDestete = getDouble(getColumnIndexOrThrow("peso_destete")),
                    pesoActual = getDouble(getColumnIndexOrThrow("peso_actual"))
                )
                animalesList.add(animales)
            }
        }
        cursor.close()
        db.close()
        return animalesList
    }
}
