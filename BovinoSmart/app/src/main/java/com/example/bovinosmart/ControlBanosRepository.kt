import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class ControlBanosRepository(context: Context) {
    private val dbHelper = AppDatabaseHelper(context)

    // Insertar un nuevo control de baño
    fun insert(controlBanos: ControlBanos) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("fecha", controlBanos.fecha)
            put("productos_utilizados", controlBanos.productosUtilizados)
        }
        db.insert("Control_Banos", null, values)
        db.close()
    }

    // Obtener todos los registros de control de baños
    fun getAll(): List<ControlBanos> {
        val controlBanosList = mutableListOf<ControlBanos>()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Control_Banos", null)
        with(cursor) {
            while (moveToNext()) {
                val id = getLong(getColumnIndexOrThrow("id"))
                val fecha = getString(getColumnIndexOrThrow("fecha"))
                val productosUtilizados = getString(getColumnIndexOrThrow("productos_utilizados"))
                controlBanosList.add(ControlBanos(id, fecha, productosUtilizados))
            }
            close()
        }
        db.close()
        return controlBanosList
    }
}
