import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

data class Enfermedad(
    val id: Long,
    val nombre: String,
    val descripcion: String
)

class EnfermedadRepository(context: Context) {
    private val dbHelper: DatabaseHelper = DatabaseHelper(context)

    // Método para obtener todas las enfermedades
    fun getAll(): List<Enfermedad> {
        val db = dbHelper.readableDatabase
        val cursor = db.query("enfermedades", null, null, null, null, null, null)
        val enfermedades = mutableListOf<Enfermedad>()

        with(cursor) {
            while (moveToNext()) {
                val enfermedad = Enfermedad(
                    id = getLong(getColumnIndexOrThrow("id")),
                    nombre = getString(getColumnIndexOrThrow("nombre")),
                    descripcion = getString(getColumnIndexOrThrow("descripcion"))
                )
                enfermedades.add(enfermedad)
            }
        }
        cursor.close()
        db.close() // Cerrar la base de datos después de usarla
        return enfermedades
    }

    // Método para insertar una nueva enfermedad
    fun insert(enfermedad: Enfermedad) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("nombre", enfermedad.nombre)
            put("descripcion", enfermedad.descripcion)
        }
        db.insert("enfermedades", null, values)
        db.close() // Cerrar la base de datos después de usarla
    }

    // Método para obtener una enfermedad por ID
    fun getById(id: Long): Enfermedad? {
        val db = dbHelper.readableDatabase
        val cursor = db.query("enfermedades", null, "id = ?", arrayOf(id.toString()), null, null, null)
        var enfermedad: Enfermedad? = null

        with(cursor) {
            if (moveToFirst()) {
                enfermedad = Enfermedad(
                    id = getLong(getColumnIndexOrThrow("id")),
                    nombre = getString(getColumnIndexOrThrow("nombre")),
                    descripcion = getString(getColumnIndexOrThrow("descripcion"))
                )
            }
        }
        cursor.close()
        db.close() // Cerrar la base de datos después de usarla
        return enfermedad
    }

    // Método para actualizar una enfermedad existente
    fun update(enfermedad: Enfermedad) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("nombre", enfermedad.nombre)
            put("descripcion", enfermedad.descripcion)
        }
        db.update("enfermedades", values, "id = ?", arrayOf(enfermedad.id.toString()))
        db.close() // Cerrar la base de datos después de usarla
    }

    // Método para eliminar una enfermedad por ID
    fun deleteById(id: Long) {
        val db = dbHelper.writableDatabase
        db.delete("enfermedades", "id = ?", arrayOf(id.toString()))
        db.close() // Cerrar la base de datos después de usarla
    }

    private class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
        override fun onCreate(db: SQLiteDatabase) {
            val createTable = """
                CREATE TABLE enfermedades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT,
                    descripcion TEXT
                )
            """
            db.execSQL(createTable)
        }

        override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
            db.execSQL("DROP TABLE IF EXISTS enfermedades")
            onCreate(db)
        }

        companion object {
            private const val DATABASE_NAME = "bovino_database"
            private const val DATABASE_VERSION = 1
        }
    }
}
