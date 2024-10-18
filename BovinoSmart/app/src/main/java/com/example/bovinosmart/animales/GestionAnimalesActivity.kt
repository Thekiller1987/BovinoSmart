package com.example.bovinosmart.animales

import android.app.DatePickerDialog
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import java.io.ByteArrayOutputStream
import java.util.*

class GestionAnimalesActivity : AppCompatActivity() {

    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var animalAdapter: AnimalAdapter
    private val animalesList = mutableListOf<Animal>()
    private var currentAnimal: Animal? = null
    private val REQUEST_IMAGE_PICK = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_animales)

        dbHelper = BoVinoSmartDBHelper(this)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewAnimales1)
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Adaptador para manejar la lista de animales
        animalAdapter = AnimalAdapter(animalesList, { animal ->
            showAnimalForm(animal)
        }, { animal ->
            deleteAnimal(animal)
        })

        recyclerView.adapter = animalAdapter

        // Botón para agregar un nuevo animal
        val addButton: ImageButton = findViewById(R.id.addButtonAnimal1)
        addButton.setOnClickListener {
            currentAnimal = null
            showAnimalForm(null)
        }

        loadAnimales()

        // Botón de Guardar
        val guardarButton: Button = findViewById(R.id.guardarAnimalButton1)
        guardarButton.setOnClickListener {
            saveAnimal()
        }

        // Botón de seleccionar imagen
        val selectImageButton: Button = findViewById(R.id.selectImageButtonAnimal)
        selectImageButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        // Configuración de los Spinners (Estado e Inseminación)
        setupSpinners()
    }

    private fun setupSpinners() {
        val estadoSpinner: Spinner = findViewById(R.id.estadoSpinner)
        val inseminacionSpinner: Spinner = findViewById(R.id.inseminacionSpinner)

        val estadoAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            listOf("Vivo", "Muerto")
        )
        estadoAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        estadoSpinner.adapter = estadoAdapter

        val inseminacionAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            listOf("Sí", "No")
        )
        inseminacionAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        inseminacionSpinner.adapter = inseminacionAdapter
    }

    // Función para cargar la lista de animales desde la base de datos
    private fun loadAnimales() {
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Animales", null)

        animalesList.clear()
        while (cursor.moveToNext()) {
            val animal = Animal(
                idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal")),
                nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre")),
                sexo = cursor.getString(cursor.getColumnIndexOrThrow("sexo")),
                imagen = cursor.getString(cursor.getColumnIndexOrThrow("imagen")),
                codigoIdVaca = cursor.getString(cursor.getColumnIndexOrThrow("codigo_idVaca")),
                fechaNacimiento = cursor.getString(cursor.getColumnIndexOrThrow("fecha_nacimiento")),
                raza = cursor.getString(cursor.getColumnIndexOrThrow("raza")),
                observaciones = cursor.getString(cursor.getColumnIndexOrThrow("observaciones")),
                pesoNacimiento = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_nacimiento")),
                pesoDestete = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_destete")),
                pesoActual = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_actual")),
                estado = cursor.getString(cursor.getColumnIndexOrThrow("estado")),
                inseminacion = cursor.getInt(cursor.getColumnIndexOrThrow("inseminacion")) == 1
            )
            animalesList.add(animal)
        }
        cursor.close()
        animalAdapter.notifyDataSetChanged()
    }

    // Función para guardar un animal nuevo o actualizado
    private fun saveAnimal() {
        val nombreEditText: EditText = findViewById(R.id.nombreAnimal)
        val codigoEditText: EditText = findViewById(R.id.codigoAnimal)
        val razaEditText: EditText = findViewById(R.id.razaAnimal)
        val pesoNacimientoEditText: EditText = findViewById(R.id.pesoNacimientoAnimal)
        val pesoDesteteEditText: EditText = findViewById(R.id.pesoDesteteAnimal)
        val pesoActualEditText: EditText = findViewById(R.id.pesoActualAnimal)
        val fechaNacimientoEditText: EditText = findViewById(R.id.fechaNacimientoAnimal)
        val imageView: ImageView = findViewById(R.id.imageViewAnimal)
        val sexoRadioGroup: RadioGroup = findViewById(R.id.sexoRadioGroup)
        val estadoSpinner: Spinner = findViewById(R.id.estadoSpinner)
        val inseminacionSpinner: Spinner = findViewById(R.id.inseminacionSpinner)
        val observacionesEditText: EditText = findViewById(R.id.observacionesAnimal)

        val selectedSexoId = sexoRadioGroup.checkedRadioButtonId
        val sexo = when (selectedSexoId) {
            R.id.radioVaca -> "vaca"
            R.id.radioToro -> "toro"
            else -> ""
        }

        val estado = estadoSpinner.selectedItem.toString()
        val inseminacion = inseminacionSpinner.selectedItem.toString() == "Sí"

        if (nombreEditText.text.isNullOrEmpty() || codigoEditText.text.isNullOrEmpty() ||
            sexo.isEmpty() || razaEditText.text.isNullOrEmpty() ||
            pesoActualEditText.text.isNullOrEmpty() || fechaNacimientoEditText.text.isNullOrEmpty()
        ) {
            Toast.makeText(this, "Todos los campos son obligatorios", Toast.LENGTH_SHORT).show()
            return
        }

        val drawable = imageView.drawable
        if (drawable == null || (drawable is BitmapDrawable && drawable.bitmap == null)) {
            Toast.makeText(this, "Selecciona una imagen", Toast.LENGTH_SHORT).show()
            return
        }

        val bitmap = (drawable as BitmapDrawable).bitmap
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream) // Reduce calidad para evitar problemas de tamaño
        val imageBase64 = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)

        val nuevoAnimal = Animal(
            nombre = nombreEditText.text.toString(),
            sexo = sexo,
            imagen = imageBase64,
            codigoIdVaca = codigoEditText.text.toString(),
            fechaNacimiento = fechaNacimientoEditText.text.toString(),
            raza = razaEditText.text.toString(),
            observaciones = observacionesEditText.text.toString(),
            pesoNacimiento = pesoNacimientoEditText.text.toString().toDouble(),
            pesoDestete = pesoDesteteEditText.text.toString().toDouble(),
            pesoActual = pesoActualEditText.text.toString().toDouble(),
            estado = estado,
            inseminacion = inseminacion
        )

        val db = dbHelper.writableDatabase

        if (currentAnimal == null) {
            db.insert("Animales", null, nuevoAnimal.toContentValues())
            Toast.makeText(this, "Animal guardado", Toast.LENGTH_SHORT).show()
        } else {
            db.update("Animales", nuevoAnimal.toContentValues(), "idAnimal = ?", arrayOf(currentAnimal!!.idAnimal.toString()))
            Toast.makeText(this, "Animal actualizado", Toast.LENGTH_SHORT).show()
        }
        closeAnimalForm()
        loadAnimales()
    }

    private fun deleteAnimal(animal: Animal) {
        val db = dbHelper.writableDatabase
        db.delete("Animales", "idAnimal = ?", arrayOf(animal.idAnimal.toString()))
        Toast.makeText(this, "Animal eliminado", Toast.LENGTH_SHORT).show()
        loadAnimales()
    }

    private fun showAnimalForm(animal: Animal?) {
        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewAnimales1)
        val searchInput: EditText = findViewById(R.id.searchInput)
        val animalButtonsContainer: LinearLayout = findViewById(R.id.animalButtonsContainer)
        val titleTextView: TextView = findViewById(R.id.title)

        recyclerView.visibility = View.GONE
        searchInput.visibility = View.GONE
        animalButtonsContainer.visibility = View.GONE
        titleTextView.visibility = View.GONE

        val formContainer: ScrollView = findViewById(R.id.scrollView)
        formContainer.visibility = View.VISIBLE

        val nombreEditText: EditText = findViewById(R.id.nombreAnimal)
        val codigoEditText: EditText = findViewById(R.id.codigoAnimal)
        val sexoRadioGroup: RadioGroup = findViewById(R.id.sexoRadioGroup)
        val razaEditText: EditText = findViewById(R.id.razaAnimal)
        val pesoNacimientoEditText: EditText = findViewById(R.id.pesoNacimientoAnimal)
        val pesoDesteteEditText: EditText = findViewById(R.id.pesoDesteteAnimal)
        val pesoActualEditText: EditText = findViewById(R.id.pesoActualAnimal)
        val fechaNacimientoEditText: EditText = findViewById(R.id.fechaNacimientoAnimal)
        val estadoSpinner: Spinner = findViewById(R.id.estadoSpinner)
        val inseminacionSpinner: Spinner = findViewById(R.id.inseminacionSpinner)
        val observacionesEditText: EditText = findViewById(R.id.observacionesAnimal)
        val imageView: ImageView = findViewById(R.id.imageViewAnimal)

        if (animal != null) {
            currentAnimal = animal
            nombreEditText.setText(animal.nombre)
            codigoEditText.setText(animal.codigoIdVaca)
            razaEditText.setText(animal.raza)
            pesoNacimientoEditText.setText(animal.pesoNacimiento.toString())
            pesoDesteteEditText.setText(animal.pesoDestete.toString())
            pesoActualEditText.setText(animal.pesoActual.toString())
            fechaNacimientoEditText.setText(animal.fechaNacimiento)

            when (animal.sexo) {
                "vaca" -> sexoRadioGroup.check(R.id.radioVaca)
                "toro" -> sexoRadioGroup.check(R.id.radioToro)
            }

            estadoSpinner.setSelection(if (animal.estado == "Vivo") 0 else 1)
            inseminacionSpinner.setSelection(if (animal.inseminacion) 0 else 1)
            observacionesEditText.setText(animal.observaciones)

            val imageBytes = Base64.decode(animal.imagen, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imageView.setImageBitmap(bitmap)
        } else {
            currentAnimal = null
            nombreEditText.text.clear()
            codigoEditText.text.clear()
            razaEditText.text.clear()
            pesoNacimientoEditText.text.clear()
            pesoDesteteEditText.text.clear()
            pesoActualEditText.text.clear()
            fechaNacimientoEditText.text.clear()
            sexoRadioGroup.clearCheck()
            estadoSpinner.setSelection(0)
            inseminacionSpinner.setSelection(0)
            observacionesEditText.text.clear()
            imageView.setImageResource(android.R.color.darker_gray)
        }
    }

    private fun closeAnimalForm() {
        val formContainer: ScrollView = findViewById(R.id.scrollView)
        formContainer.visibility = View.GONE

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewAnimales1)
        val searchInput: EditText = findViewById(R.id.searchInput)
        val animalButtonsContainer: LinearLayout = findViewById(R.id.animalButtonsContainer)
        val titleTextView: TextView = findViewById(R.id.title)

        recyclerView.visibility = View.VISIBLE
        searchInput.visibility = View.VISIBLE
        animalButtonsContainer.visibility = View.VISIBLE
        titleTextView.visibility = View.VISIBLE
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == RESULT_OK && requestCode == REQUEST_IMAGE_PICK) {
            val selectedImageUri = data?.data
            try {
                val inputStream = contentResolver.openInputStream(selectedImageUri!!)
                val bitmap = BitmapFactory.decodeStream(inputStream)
                val imageView: ImageView = findViewById(R.id.imageViewAnimal)
                imageView.setImageBitmap(bitmap)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun showDatePicker(fechaEditText: EditText) {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)

        val datePickerDialog = DatePickerDialog(this, { _, selectedYear, selectedMonth, selectedDay ->
            val fecha = "$selectedDay/${selectedMonth + 1}/$selectedYear"
            fechaEditText.setText(fecha)
        }, year, month, day)

        datePickerDialog.show()
    }
}

fun Animal.toContentValues(): ContentValues {
    return ContentValues().apply {
        put("nombre", nombre)
        put("sexo", sexo)
        put("imagen", imagen)
        put("codigo_idVaca", codigoIdVaca)
        put("fecha_nacimiento", fechaNacimiento)
        put("raza", raza)
        put("observaciones", observaciones)
        put("peso_nacimiento", pesoNacimiento)
        put("peso_destete", pesoDestete)
        put("peso_actual", pesoActual)
        put("estado", estado)
        put("inseminacion", if (inseminacion) 1 else 0)
    }
}
