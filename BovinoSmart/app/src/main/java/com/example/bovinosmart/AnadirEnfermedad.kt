import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AnadirEnfermedad : AppCompatActivity() {
    private lateinit var enfermedadRepo: EnfermedadRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_anadir_enfermedad)

        enfermedadRepo = EnfermedadRepository(this)

        val nombreEnfermedad = findViewById<EditText>(R.id.edittext_nombre_enfermedad)
        val descripcionEnfermedad = findViewById<EditText>(R.id.edittext_descripcion_enfermedad)
        val botonAgregar = findViewById<Button>(R.id.button_agregar_enfermedad)

        botonAgregar.setOnClickListener {
            val nuevaEnfermedad = Enfermedad(
                id = 0, // Dejar como 0 para autoincremento
                nombre = nombreEnfermedad.text.toString(),
                descripcion = descripcionEnfermedad.text.toString()
            )

            CoroutineScope(Dispatchers.IO).launch {
                enfermedadRepo.insert(nuevaEnfermedad)
                withContext(Dispatchers.Main) {
                    finish() // Cierra la actividad después de agregar
                }
            }
        }
    }
}
