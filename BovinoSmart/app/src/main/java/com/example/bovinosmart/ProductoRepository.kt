import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class ProductoRepository(context: Context) {
    private val dbHelper = AppDatabaseHelper(context)

    // Insertar un nuevo producto
    fun insert(producto: Producto) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("nombre", producto.nombre)
            put("tipo", producto.tipo)
            put("dosis_recomendada", producto.dosisRecomendada)
            put("frecuencia_aplicacion", producto.frecuenciaAplicacion)
            put("notas", producto.notas)
        }
        db.insert("Productos", null, values)
        db.close()
    }

    // Obtener todos los productos
    fun getAll(): List<Producto> {
        val productos = mutableListOf<Producto>()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Productos", null)
        with(cursor) {
            while (moveToNext()) {
                val id = getLong(getColumnIndexOrThrow("id"))
                val nombre = getString(getColumnIndexOrThrow("nombre"))
                val tipo = getString(getColumnIndexOrThrow("tipo"))
                val dosisRecomendada = getString(getColumnIndexOrThrow("dosis_recomendada"))
                val frecuenciaAplicacion = getString(getColumnIndexOrThrow("frecuencia_aplicacion"))
                val notas = getString(getColumnIndexOrThrow("notas"))
                productos.add(Producto(id, nombre, tipo, dosisRecomendada, frecuenciaAplicacion, notas))
            }
            close()
        }
        db.close()
        return productos
    }
}
