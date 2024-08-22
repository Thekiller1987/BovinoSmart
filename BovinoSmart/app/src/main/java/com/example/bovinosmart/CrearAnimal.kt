import android.app.Activity
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

class CrearAnimalActivity : AppCompatActivity() {
    private lateinit var animalRepo: AnimalRepository
    private lateinit var productoRepo: ProductoRepository
    private lateinit var banoRepo: ControlBanosRepository
    private lateinit var enfermedadRepo: EnfermedadRepository

    private val IMAGE_REQUEST_CODE = 1001
    private var imageUri: Uri? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_crear_animal)

        animalRepo = AnimalRepository(this)
        productoRepo = ProductoRepository(this)
        banoRepo = ControlBanosRepository(this)
        enfermedadRepo = EnfermedadRepository(this)

        val nombreAnimal = findViewById<EditText>(R.id.edittext_nombre_animal)
        val sexoSpinner = findViewById<Spinner>(R.id.spinner_sexo)
        val codigoIdVaca = findViewById<EditText>(R.id.edittext_codigo_id_vaca)
        val fechaNacimiento = findViewById<EditText>(R.id.edittext_fecha_nacimiento)
        val raza = findViewById<EditText>(R.id.edittext_raza)
        val observaciones = findViewById<EditText>(R.id.edittext_observaciones)
        val pesoNacimiento = findViewById<EditText>(R.id.edittext_peso_nacimiento)
        val pesoDestete = findViewById<EditText>(R.id.edittext_peso_destete)
        val pesoActual = findViewById<EditText>(R.id.edittext_peso_actual)
        val imagenAnimal = findViewById<ImageView>(R.id.imageview_imagen_animal)
        val guardarButton = findViewById<Button>(R.id.button_guardar_animal)

        // Cargar datos en los spinners
        loadSpinnerData()

        imagenAnimal.setOnClickListener {
            // Lanzar el intent para seleccionar imagen
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, IMAGE_REQUEST_CODE)
        }

        guardarButton.setOnClickListener {
            val animal = Animal(
                id = 0, // Asigna un ID nuevo, se puede manejar en el repositorio
                nombre = nombreAnimal.text.toString(),
                sexo = sexoSpinner.selectedItem.toString(),
                imagen = imageUri?.let { uri -> convertImageToByteArray(uri) }, // Convertir a ByteArray
                codigoId = codigoIdVaca.text.toString(), // Asegúrate de que este campo sea correcto
                fechaNacimiento = fechaNacimiento.text.toString(),
                raza = raza.text.toString(),
                observaciones = observaciones.text.toString(),
                pesoNacimiento = pesoNacimiento.text.toString().toDoubleOrNull() ?: 0.0,
                pesoDestete = pesoDestete.text.toString().toDoubleOrNull() ?: 0.0,
                pesoActual = pesoActual.text.toString().toDoubleOrNull() ?: 0.0
            )

            GlobalScope.launch {
                animalRepo.insert(animal)
                finish() // Cierra la actividad después de guardar
            }
        }
    }

    private fun loadSpinnerData() {
        // Cargar enfermedades
        val enfermedades = enfermedadRepo.getAll()
        val enfermedadesAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, enfermedades.map { it.nombre })
        findViewById<Spinner>(R.id.spinner_enfermedades).adapter = enfermedadesAdapter

        // Cargar productos
        val productos = productoRepo.getAll()
        val productosAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, productos.map { it.nombre })
        findViewById<Spinner>(R.id.spinner_productos).adapter = productosAdapter

        // Cargar baños
        val banos = banoRepo.getAll()
        val banosAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, banos.map { it.fecha })
        findViewById<Spinner>(R.id.spinner_banos).adapter = banosAdapter
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == IMAGE_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
            imageUri = data.data
            val inputStream = contentResolver.openInputStream(imageUri!!)
            val bitmap = BitmapFactory.decodeStream(inputStream)
            findViewById<ImageView>(R.id.imageview_imagen_animal).setImageBitmap(bitmap)
        }
    }

    private fun convertImageToByteArray(uri: Uri): ByteArray? {
        val inputStream = contentResolver.openInputStream(uri)
        val bitmap = BitmapFactory.decodeStream(inputStream)
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
        return byteArrayOutputStream.toByteArray() // Cambiado a ByteArray
    }
}
