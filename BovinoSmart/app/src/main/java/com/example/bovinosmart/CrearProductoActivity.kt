import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class CrearProductoActivity : AppCompatActivity() {
    private lateinit var productoRepo: ProductoRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_producto)

        productoRepo = ProductoRepository(this)

        val nombreProducto = findViewById<EditText>(R.id.edittext_nombre_producto)
        val tipoProducto = findViewById<EditText>(R.id.edittext_tipo_producto)
        val dosisRecomendada = findViewById<EditText>(R.id.edittext_dosis_recomendada)
        val frecuenciaAplicacion = findViewById<EditText>(R.id.edittext_frecuencia_aplicacion)
        val notasAdicionales = findViewById<EditText>(R.id.edittext_notas_adicionales)
        val botonGuardar = findViewById<Button>(R.id.button_guardar_producto)

        botonGuardar.setOnClickListener {
            val nuevoProducto = Producto(
                nombre = nombreProducto.text.toString(),
                tipo = tipoProducto.text.toString(),
                dosisRecomendada = dosisRecomendada.text.toString(),
                frecuenciaAplicacion = frecuenciaAplicacion.text.toString(),
                notas = notasAdicionales.text.toString()
            )

            GlobalScope.launch {
                productoRepo.insert(nuevoProducto)
                finish() // Cierra la actividad después de insertar
            }
        }
    }
}
