import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class EditEnfermedadActivity : AppCompatActivity() {
    private lateinit var enfermedadRepo: EnfermedadRepository
    private var enfermedadId: Long = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_enfermedad)

        enfermedadRepo = EnfermedadRepository(this)
        enfermedadId = intent.getLongExtra("ENFERMEDAD_ID", 0)

        val nombreEnfermedad = findViewById<EditText>(R.id.edittext_nombre_enfermedad)
        val descripcionEnfermedad = findViewById<EditText>(R.id.edittext_descripcion_enfermedad)
        val botonGuardar = findViewById<Button>(R.id.button_guardar_enfermedad)
        val botonEliminar = findViewById<Button>(R.id.button_eliminar_enfermedad)

        // Cargar datos de la enfermedad para edición
        GlobalScope.launch {
            val enfermedad = enfermedadRepo.getById(enfermedadId)
            runOnUiThread {
                nombreEnfermedad.setText(enfermedad?.nombre)
                descripcionEnfermedad.setText(enfermedad?.descripcion)
            }
        }

        botonGuardar.setOnClickListener {
            val updatedEnfermedad = Enfermedad(
                id = enfermedadId,
                nombre = nombreEnfermedad.text.toString(),
                descripcion = descripcionEnfermedad.text.toString()
            )

            GlobalScope.launch {
                enfermedadRepo.update(updatedEnfermedad)
                finish() // Cierra la actividad después de actualizar
            }
        }

        botonEliminar.setOnClickListener {
            GlobalScope.launch {
                enfermedadRepo.deleteById(enfermedadId)
                finish() // Cierra la actividad después de eliminar
            }
        }
    }
}
