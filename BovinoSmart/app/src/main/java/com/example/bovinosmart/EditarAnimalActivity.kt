import android.app.DatePickerDialog
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.R
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.io.ByteArrayOutputStream
import java.util.*

class EditarAnimalActivity : AppCompatActivity() {

    private lateinit var animalRepo: AnimalRepository
    private var animalId: Long = 0
    private var imagenAnimal: ByteArray? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_editar_animal)

        animalRepo = AnimalRepository(this)

        val nombreAnimal = findViewById<EditText>(R.id.edittext_nombre_animal)
        val spinnerSexo = findViewById<Spinner>(R.id.spinner_sexo)
        val imagenAnimalView = findViewById<ImageView>(R.id.imageview_imagen_animal)
        val botonSubirImagen = findViewById<Button>(R.id.button_subir_imagen)
        val codigoId = findViewById<EditText>(R.id.edittext_codigo_id)
        val fechaNacimiento = findViewById<EditText>(R.id.edittext_fecha_nacimiento)
        val spinnerRaza = findViewById<Spinner>(R.id.spinner_raza)
        val observaciones = findViewById<EditText>(R.id.edittext_observaciones)
        val pesoNacimiento = findViewById<EditText>(R.id.edittext_peso_nacimiento)
        val pesoDestete = findViewById<EditText>(R.id.edittext_peso_destete)
        val pesoActual = findViewById<EditText>(R.id.edittext_peso_actual)
        val botonGuardar = findViewById<Button>(R.id.button_guardar_animal)

        // Obtener ID del animal desde el Intent
        animalId = intent.getLongExtra("ANIMAL_ID", 0)

        if (animalId > 0) {
            // Cargar datos del animal para edición
            GlobalScope.launch {
                val animal = animalRepo.getAnimalById(animalId)
                runOnUiThread {
                    animal?.let {
                        nombreAnimal.setText(it.nombre)
                        spinnerSexo.setSelection(getSexoPosition(it.sexo))
                        it.imagen?.let { img ->
                            val bitmap = BitmapFactory.decodeByteArray(img, 0, img.size)
                            imagenAnimalView.setImageBitmap(bitmap)
                        }
                        codigoId.setText(it.codigoId)
                        fechaNacimiento.setText(it.fechaNacimiento)
                        spinnerRaza.setSelection(getRazaPosition(it.raza))
                        observaciones.setText(it.observaciones)
                        pesoNacimiento.setText(it.pesoNacimiento.toString())
                        pesoDestete.setText(it.pesoDestete.toString())
                        pesoActual.setText(it.pesoActual.toString())
                    }
                }
            }
        }

        botonSubirImagen.setOnClickListener {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            startActivityForResult(intent, REQUEST_IMAGE_CAPTURE)
        }

        fechaNacimiento.setOnClickListener {
            showDatePickerDialog(fechaNacimiento)
        }

        botonGuardar.setOnClickListener {
            val animal = Animal(
                id = animalId,
                nombre = nombreAnimal.text.toString(),
                sexo = spinnerSexo.selectedItem.toString(),
                imagen = imagenAnimal,
                codigoId = codigoId.text.toString(),
                fechaNacimiento = fechaNacimiento.text.toString(),
                raza = spinnerRaza.selectedItem.toString(),
                observaciones = observaciones.text.toString(),
                pesoNacimiento = pesoNacimiento.text.toString().toDouble(),
                pesoDestete = pesoDestete.text.toString().toDouble(),
                pesoActual = pesoActual.text.toString().toDouble()
            )

            GlobalScope.launch {
                if (animalId > 0) {
                    animalRepo.update(animal) // Actualizar en lugar de insertar
                } else {
                    animalRepo.insert(animal) // Inserta si es un nuevo animal
                }
                finish()
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            val imageBitmap = data?.extras?.get("data") as Bitmap
            imagenAnimal = bitmapToByteArray(imageBitmap)
            findViewById<ImageView>(R.id.imageview_imagen_animal).setImageBitmap(imageBitmap)
        }
    }

    private fun showDatePickerDialog(editText: EditText) {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(this,
            { _, year, month, dayOfMonth ->
                val selectedDate = "${dayOfMonth}/${month + 1}/${year}"
                editText.setText(selectedDate)
            }, year, month, day)
        datePickerDialog.show()
    }

    private fun bitmapToByteArray(bitmap: Bitmap): ByteArray {
        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
        return stream.toByteArray()
    }

    private fun getSexoPosition(sexo: String): Int {
        val opcionesSexo = resources.getStringArray(R.array.sexo_options)
        return opcionesSexo.indexOf(sexo)
    }

    private fun getRazaPosition(raza: String): Int {
        val opcionesRaza = resources.getStringArray(R.array.raza_options)
        return opcionesRaza.indexOf(raza)
    }

    companion object {
        private const val REQUEST_IMAGE_CAPTURE = 1
    }
}
