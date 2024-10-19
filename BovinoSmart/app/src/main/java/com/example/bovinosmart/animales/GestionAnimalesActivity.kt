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
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.Enfermedades.GestionHistorialEnfermedades
import com.example.bovinosmart.Productos.GestionHistorialProductos
import com.example.bovinosmart.R
import com.example.bovinosmart.controlbanos.GestionControlBanosActivity
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import com.example.bovinosmart.inseminacion.GestionInseminacionesActivity
import com.example.bovinosmart.ProduccionLeche.GestionProduccionLecheActivity
import java.io.ByteArrayOutputStream
import java.util.*

class GestionAnimalesActivity : AppCompatActivity() {

    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var animalAdapter: AnimalAdapter
    private val animalesList = mutableListOf<Animal>()
    private var currentAnimal: Animal? = null
    private val REQUEST_IMAGE_PICK = 1001
    private var selectedImageBitmap: Bitmap? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_animales)

        dbHelper = BoVinoSmartDBHelper(this)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewAnimales1)
        recyclerView.layoutManager = LinearLayoutManager(this)

        animalAdapter = AnimalAdapter(animalesList, { animal ->
            showAnimalForm(animal)
        }, { animal ->
            deleteAnimal(animal)
        })
        recyclerView.adapter = animalAdapter

        loadAnimales()

        val addButton: ImageButton = findViewById(R.id.addButtonAnimal1)
        val menuDesplegable: LinearLayout = findViewById(R.id.menuDesplegable)

        addButton.setOnClickListener {
            if (menuDesplegable.visibility == View.GONE) {
                menuDesplegable.visibility = View.VISIBLE
            } else {
                menuDesplegable.visibility = View.GONE
            }
        }

        val btnHistorialProductos: Button = findViewById(R.id.btnHistorialProductos)
        val btnHistorialEnfermedades: Button = findViewById(R.id.btnHistorialEnfermedades)
        val btnControlBanos: Button = findViewById(R.id.btnControlBanos)
        val btnInseminacion: Button = findViewById(R.id.btnInseminacion)
        val btnCrearAnimal: Button = findViewById(R.id.btnCrearAnimal)
        val btnProduccionLeche: Button = findViewById(R.id.btnProduccionLeche)

        btnHistorialProductos.setOnClickListener {
            val intent = Intent(this, GestionHistorialProductos::class.java)
            startActivity(intent)
        }

        btnHistorialEnfermedades.setOnClickListener {
            val intent = Intent(this, GestionHistorialEnfermedades::class.java)
            startActivity(intent)
        }

        btnControlBanos.setOnClickListener {
            val intent = Intent(this, GestionControlBanosActivity::class.java)
            startActivity(intent)
        }

        btnInseminacion.setOnClickListener {
            val intent = Intent(this, GestionInseminacionesActivity::class.java)
            startActivity(intent)
        }

        btnProduccionLeche.setOnClickListener {
            val intent = Intent(this, GestionProduccionLecheActivity::class.java)
            startActivity(intent)
        }

        btnCrearAnimal.setOnClickListener {
            showAnimalForm(null)
        }
    }

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

    private fun showAnimalForm(animal: Animal?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_animal, null)
        val dialogBuilder = AlertDialog.Builder(this)
            .setView(dialogView)
            .setTitle(if (animal == null) "Agregar Animal" else "Editar Animal")

        val alertDialog = dialogBuilder.show()

        val nombreEditText: EditText = dialogView.findViewById(R.id.editTextNombreAnimal)
        val codigoEditText: EditText = dialogView.findViewById(R.id.editTextCodigoIdVaca)
        val razaEditText: EditText = dialogView.findViewById(R.id.editTextRazaAnimal)
        val pesoNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextPesoNacimiento)
        val pesoDesteteEditText: EditText = dialogView.findViewById(R.id.editTextPesoDestete)
        val pesoActualEditText: EditText = dialogView.findViewById(R.id.editTextPesoActual)
        val fechaNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextFechaNacimiento)
        val imageView: ImageView = dialogView.findViewById(R.id.imageViewAnimal)
        val sexoSpinner: Spinner = dialogView.findViewById(R.id.spinnerSexoAnimal)
        val estadoEditText: EditText = dialogView.findViewById(R.id.editTextEstado)
        val inseminacionCheckBox: CheckBox = dialogView.findViewById(R.id.checkBoxInseminacion)
        val observacionesEditText: EditText = dialogView.findViewById(R.id.editTextObservaciones)

        // Configurar el Spinner para "Sexo"
        val sexoAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            listOf("Vaca", "Toro")
        )
        sexoAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        sexoSpinner.adapter = sexoAdapter

        // Configurar el DatePicker para "Fecha de Nacimiento"
        fechaNacimientoEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(this, { _, selectedYear, selectedMonth, selectedDay ->
                val fecha = "$selectedDay/${selectedMonth + 1}/$selectedYear"
                fechaNacimientoEditText.setText(fecha)
            }, year, month, day)

            datePickerDialog.show()
        }

        val selectImageButton: Button = dialogView.findViewById(R.id.buttonSeleccionarImagen)
        selectImageButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        val guardarButton: Button = dialogView.findViewById(R.id.btnGuardarAnimal)
        guardarButton.setOnClickListener {
            if (validateForm(dialogView)) {
                saveAnimal(dialogView)
                alertDialog.dismiss()
            }
        }

        if (animal != null) {
            currentAnimal = animal
            nombreEditText.setText(animal.nombre)
            codigoEditText.setText(animal.codigoIdVaca)
            razaEditText.setText(animal.raza)
            pesoNacimientoEditText.setText(animal.pesoNacimiento.toString())
            pesoDesteteEditText.setText(animal.pesoDestete.toString())
            pesoActualEditText.setText(animal.pesoActual.toString())
            fechaNacimientoEditText.setText(animal.fechaNacimiento)
            sexoSpinner.setSelection(if (animal.sexo == "Vaca") 0 else 1)
            estadoEditText.setText(animal.estado)
            inseminacionCheckBox.isChecked = animal.inseminacion
            observacionesEditText.setText(animal.observaciones)

            val imageBytes = Base64.decode(animal.imagen, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imageView.setImageBitmap(bitmap)
            selectedImageBitmap = bitmap
        } else {
            currentAnimal = null
            selectedImageBitmap = null
        }
    }

    private fun validateForm(dialogView: View): Boolean {
        val nombreEditText: EditText = dialogView.findViewById(R.id.editTextNombreAnimal)
        val codigoEditText: EditText = dialogView.findViewById(R.id.editTextCodigoIdVaca)
        val razaEditText: EditText = dialogView.findViewById(R.id.editTextRazaAnimal)
        val pesoNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextPesoNacimiento)
        val pesoDesteteEditText: EditText = dialogView.findViewById(R.id.editTextPesoDestete)
        val pesoActualEditText: EditText = dialogView.findViewById(R.id.editTextPesoActual)
        val fechaNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextFechaNacimiento)
        val estadoEditText: EditText = dialogView.findViewById(R.id.editTextEstado)

        // Validar campos obligatorios
        if (nombreEditText.text.isNullOrEmpty() || codigoEditText.text.isNullOrEmpty() ||
            razaEditText.text.isNullOrEmpty() || pesoNacimientoEditText.text.isNullOrEmpty() ||
            pesoDesteteEditText.text.isNullOrEmpty() || pesoActualEditText.text.isNullOrEmpty() ||
            fechaNacimientoEditText.text.isNullOrEmpty() || estadoEditText.text.isNullOrEmpty()) {

            Toast.makeText(this, "Todos los campos son obligatorios", Toast.LENGTH_SHORT).show()
            return false
        }

        // Validar que los pesos sean números
        try {
            pesoNacimientoEditText.text.toString().toDouble()
            pesoDesteteEditText.text.toString().toDouble()
            pesoActualEditText.text.toString().toDouble()
        } catch (e: NumberFormatException) {
            Toast.makeText(this, "Los pesos deben ser números válidos", Toast.LENGTH_SHORT).show()
            return false
        }

        // Validar que la imagen esté seleccionada
        if (selectedImageBitmap == null) {
            Toast.makeText(this, "Selecciona una imagen", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }

    private fun saveAnimal(dialogView: View) {
        val nombreEditText: EditText = dialogView.findViewById(R.id.editTextNombreAnimal)
        val codigoEditText: EditText = dialogView.findViewById(R.id.editTextCodigoIdVaca)
        val razaEditText: EditText = dialogView.findViewById(R.id.editTextRazaAnimal)
        val pesoNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextPesoNacimiento)
        val pesoDesteteEditText: EditText = dialogView.findViewById(R.id.editTextPesoDestete)
        val pesoActualEditText: EditText = dialogView.findViewById(R.id.editTextPesoActual)
        val fechaNacimientoEditText: EditText = dialogView.findViewById(R.id.editTextFechaNacimiento)
        val sexoSpinner: Spinner = dialogView.findViewById(R.id.spinnerSexoAnimal)
        val estadoEditText: EditText = dialogView.findViewById(R.id.editTextEstado)
        val inseminacionCheckBox: CheckBox = dialogView.findViewById(R.id.checkBoxInseminacion)
        val observacionesEditText: EditText = dialogView.findViewById(R.id.editTextObservaciones)

        val nombre = nombreEditText.text.toString()
        val sexo = sexoSpinner.selectedItem.toString()
        val codigoIdVaca = codigoEditText.text.toString()
        val fechaNacimiento = fechaNacimientoEditText.text.toString()
        val raza = razaEditText.text.toString()
        val observaciones = observacionesEditText.text.toString()
        val pesoNacimiento = pesoNacimientoEditText.text.toString().toDouble()
        val pesoDestete = pesoDesteteEditText.text.toString().toDouble()
        val pesoActual = pesoActualEditText.text.toString().toDouble()
        val estado = estadoEditText.text.toString()
        val inseminacion = inseminacionCheckBox.isChecked

        val outputStream = ByteArrayOutputStream()
        selectedImageBitmap!!.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
        val imageBase64 = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)

        val nuevoAnimal = Animal(
            nombre = nombre,
            sexo = sexo,
            imagen = imageBase64,
            codigoIdVaca = codigoIdVaca,
            fechaNacimiento = fechaNacimiento,
            raza = raza,
            observaciones = observaciones,
            pesoNacimiento = pesoNacimiento,
            pesoDestete = pesoDestete,
            pesoActual = pesoActual,
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

        loadAnimales()
    }

    private fun deleteAnimal(animal: Animal) {
        val db = dbHelper.writableDatabase
        db.delete("Animales", "idAnimal = ?", arrayOf(animal.idAnimal.toString()))
        Toast.makeText(this, "Animal eliminado", Toast.LENGTH_SHORT).show()
        loadAnimales()
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

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode == RESULT_OK && requestCode == REQUEST_IMAGE_PICK) {
            val selectedImageUri = data?.data
            try {
                val inputStream = contentResolver.openInputStream(selectedImageUri!!)
                selectedImageBitmap = BitmapFactory.decodeStream(inputStream)
                val imageView: ImageView = findViewById(R.id.imageViewAnimal)
                imageView.setImageBitmap(selectedImageBitmap)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
