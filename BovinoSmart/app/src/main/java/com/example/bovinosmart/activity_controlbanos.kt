import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class ControlBanosActivity : AppCompatActivity() {
    private lateinit var controlBanosRepo: ControlBanosRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_control_banos)

        controlBanosRepo = ControlBanosRepository(this)

        val fechaBano = findViewById<EditText>(R.id.edittext_fecha_bano)
        val productosUtilizados = findViewById<EditText>(R.id.edittext_productos_utilizados)
        val botonGuardar = findViewById<Button>(R.id.button_guardar_bano)

        botonGuardar.setOnClickListener {
            val nuevoBano = ControlBanos(
                fecha = fechaBano.text.toString(),
                productosUtilizados = productosUtilizados.text.toString()
            )

            GlobalScope.launch {
                controlBanosRepo.insert(nuevoBano)
                finish() // Cierra la actividad después de insertar
            }
        }
    }
}
