import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class Animal(
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

class AnimalRepository(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "bovinosmart.db"
        private const val DATABASE_VERSION = 1
        private const val TABLE_NAME = "animales"
    }

    override fun onCreate(db: SQLiteDatabase) {
        val createTable = """
            CREATE TABLE $TABLE_NAME (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                sexo TEXT,
                imagen BLOB,
                codigo_id TEXT,
                fecha_nacimiento TEXT,
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

    fun insert(animal: Animal) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("nombre", animal.nombre)
            put("sexo", animal.sexo)
            put("imagen", animal.imagen) // Asegúrate de que esto sea un ByteArray
            put("codigo_id", animal.codigoId)
            put("fecha_nacimiento", animal.fechaNacimiento)
            put("raza", animal.raza)
            put("observaciones", animal.observaciones)
            put("peso_nacimiento", animal.pesoNacimiento)
            put("peso_destete", animal.pesoDestete)
            put("peso_actual", animal.pesoActual)
        }

        db.insert(TABLE_NAME, null, values)
        db.close()
    }

    fun update(animal: Animal) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put("nombre", animal.nombre)
            put("sexo", animal.sexo)
            put("imagen", animal.imagen)
            put("codigo_id", animal.codigoId)
            put("fecha_nacimiento", animal.fechaNacimiento)
            put("raza", animal.raza)
            put("observaciones", animal.observaciones)
            put("peso_nacimiento", animal.pesoNacimiento)
            put("peso_destete", animal.pesoDestete)
            put("peso_actual", animal.pesoActual)
        }

        db.update(TABLE_NAME, values, "id = ?", arrayOf(animal.id.toString()))
        db.close()
    }

    fun getAnimalById(id: Long): Animal? {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_NAME,
            null, // Selecciona todas las columnas
            "id = ?", // Filtro
            arrayOf(id.toString()), // Argumentos para el filtro
            null, // No agrupar
            null, // No filtrar
            null // No ordenar
        )

        return if (cursor.moveToFirst()) {
            val nombre = cursor.getString(cursor.getColumnIndex("nombre"))
            val sexo = cursor.getString(cursor.getColumnIndex("sexo"))
            val imagen = cursor.getBlob(cursor.getColumnIndex("imagen"))
            val codigoId = cursor.getString(cursor.getColumnIndex("codigo_id"))
            val fechaNacimiento = cursor.getString(cursor.getColumnIndex("fecha_nacimiento"))
            val raza = cursor.getString(cursor.getColumnIndex("raza"))
            val observaciones = cursor.getString(cursor.getColumnIndex("observaciones"))
            val pesoNacimiento = cursor.getDouble(cursor.getColumnIndex("peso_nacimiento"))
            val pesoDestete = cursor.getDouble(cursor.getColumnIndex("peso_destete"))
            val pesoActual = cursor.getDouble(cursor.getColumnIndex("peso_actual"))

            Animal(id, nombre, sexo, imagen, codigoId, fechaNacimiento, raza, observaciones, pesoNacimiento, pesoDestete, pesoActual)
        } else {
            null // Retorna null si no se encuentra el animal
        }.also {
            cursor.close() // Cierra el cursor después de usarlo
            db.close() // Cierra la base de datos si ya no la necesitas
        }
    }

    fun getAll(): List<Animal> {
        val db = readableDatabase
        val cursor = db.query(TABLE_NAME, null, null, null, null, null, null)
        val animales = mutableListOf<Animal>()

        with(cursor) {
            while (moveToNext()) {
                val animal = Animal(
                    id = getLong(getColumnIndexOrThrow("id")),
                    nombre = getString(getColumnIndexOrThrow("nombre")),
                    sexo = getString(getColumnIndexOrThrow("sexo")),
                    imagen = getBlob(getColumnIndexOrThrow("imagen")),
                    codigoId = getString(getColumnIndexOrThrow("codigo_id")),
                    fechaNacimiento = getString(getColumnIndexOrThrow("fecha_nacimiento")),
                    raza = getString(getColumnIndexOrThrow("raza")),
                    observaciones = getString(getColumnIndexOrThrow("observaciones")),
                    pesoNacimiento = getDouble(getColumnIndexOrThrow("peso_nacimiento")),
                    pesoDestete = getDouble(getColumnIndexOrThrow("peso_destete")),
                    pesoActual = getDouble(getColumnIndexOrThrow("peso_actual"))
                )
                animales.add(animal)
            }
        }
        cursor.close()
        db.close() // Cerrar la base de datos después de usarla
        return animales
    }

    // Otros métodos como deleteById, etc.
}
