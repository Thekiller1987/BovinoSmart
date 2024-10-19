package com.example.bovinosmart.animal

import android.app.DatePickerDialog
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager // Importar GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.util.*

class GestionAnimalesActivity : AppCompatActivity() {

    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var animalAdapter: AnimalAdapter
    private val animalesList = mutableListOf<Animal>()
    private val productosAplicadosList = mutableListOf<Pair<String, String>>() // Producto y Dosis
    private val enfermedadesList = mutableListOf<Pair<String, String>>() // Enfermedad y Fecha
    private val banosList = mutableListOf<Pair<String, String>>() // Producto y Fecha
    private var currentImageBase64: String? = null
    private var imgAnimalDialogView: ImageView? = null

    companion object {
        private const val REQUEST_IMAGE_PICK = 2
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_animales)

        dbHelper = BoVinoSmartDBHelper(this)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewAnimales1)
        // Cambiar LinearLayoutManager por GridLayoutManager para mostrar en 2 columnas
        recyclerView.layoutManager = GridLayoutManager(this, 2) // Aquí se establece que sean 2 columnas
        animalAdapter = AnimalAdapter(animalesList, { animal -> showAnimalForm(animal) }, { animal -> eliminarAnimal(animal) })
        recyclerView.adapter = animalAdapter

        loadAnimales()

        val btnAgregar: ImageButton = findViewById(R.id.addButtonAnimal1)
        btnAgregar.setOnClickListener {
            showAnimalForm(null)
        }
    }

    private fun loadAnimales() {
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Animales", null)

        animalesList.clear()
        if (cursor.moveToFirst()) {
            do {
                val animal = Animal(
                    idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal")),
                    nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre")),
                    sexo = cursor.getString(cursor.getColumnIndexOrThrow("sexo")),
                    imagen = cursor.getString(cursor.getColumnIndexOrThrow("imagen")),
                    codigoIdVaca = cursor.getString(cursor.getColumnIndexOrThrow("codigo_idVaca")),
                    raza = cursor.getString(cursor.getColumnIndexOrThrow("raza")),
                    pesoNacimiento = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_nacimiento")),
                    pesoDestete = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_destete")),
                    pesoActual = cursor.getDouble(cursor.getColumnIndexOrThrow("peso_actual")),
                    fechaNacimiento = cursor.getString(cursor.getColumnIndexOrThrow("fecha_nacimiento")),
                    estado = cursor.getString(cursor.getColumnIndexOrThrow("estado")),
                    inseminacion = cursor.getInt(cursor.getColumnIndexOrThrow("inseminacion")) == 1,
                    observaciones = cursor.getString(cursor.getColumnIndexOrThrow("observaciones"))
                )
                animalesList.add(animal)
            } while (cursor.moveToNext())
        }
        cursor.close()
        animalAdapter.updateList(animalesList)
    }

    private fun showAnimalForm(animal: Animal?) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_animal, null)
        val dialogBuilder = AlertDialog.Builder(this).setView(dialogView)
        val alertDialog = dialogBuilder.show()

        val editNombre = dialogView.findViewById<EditText>(R.id.edit_nombre)
        val editCodigo = dialogView.findViewById<EditText>(R.id.edit_codigo)
        val editRaza = dialogView.findViewById<EditText>(R.id.edit_raza)
        val editPesoNacimiento = dialogView.findViewById<EditText>(R.id.edit_peso_nacimiento)
        val editPesoDestete = dialogView.findViewById<EditText>(R.id.edit_peso_destete)
        val editPesoActual = dialogView.findViewById<EditText>(R.id.edit_peso_actual)
        val editFechaNacimiento = dialogView.findViewById<EditText>(R.id.edit_fecha_nacimiento)
        val spinnerSexo = dialogView.findViewById<Spinner>(R.id.spinner_sexo)
        val editEstado = dialogView.findViewById<EditText>(R.id.edit_estado)
        val checkboxInseminacion = dialogView.findViewById<CheckBox>(R.id.checkbox_inseminacion)
        val editObservaciones = dialogView.findViewById<EditText>(R.id.edit_observaciones)
        val btnImagenAnimal = dialogView.findViewById<Button>(R.id.btn_imagen_animal)
        imgAnimalDialogView = dialogView.findViewById(R.id.img_animal)

        // Configuración para los botones de agregar producto, baño y enfermedad
        val btnAgregarProducto = dialogView.findViewById<Button>(R.id.btn_agregar_producto)
        val btnAgregarEnfermedad = dialogView.findViewById<Button>(R.id.btn_agregar_enfermedad)
        val btnAgregarBano = dialogView.findViewById<Button>(R.id.btn_agregar_bano)

        val editFechaEnfermedad = dialogView.findViewById<EditText>(R.id.edit_fecha_enfermedad)
        val editFechaBano = dialogView.findViewById<EditText>(R.id.edit_fecha_bano)
        val editDosisProducto = dialogView.findViewById<EditText>(R.id.edit_dosis_producto)

        configurarDatePicker(editFechaNacimiento)
        configurarDatePicker(editFechaEnfermedad)
        configurarDatePicker(editFechaBano)

        btnImagenAnimal.setOnClickListener {
            seleccionarImagen()
        }

        // Cargar productos y enfermedades en los spinners
        val spinnerProductoAplicado = dialogView.findViewById<Spinner>(R.id.spinner_producto_aplicado)
        val spinnerEnfermedadAplicada = dialogView.findViewById<Spinner>(R.id.spinner_enfermedad_aplicada)
        val spinnerProductoBano = dialogView.findViewById<Spinner>(R.id.spinner_producto_bano)

        cargarProductosDesdeBD(spinnerProductoAplicado)
        cargarProductosDesdeBD(spinnerProductoBano)
        cargarEnfermedadesDesdeBD(spinnerEnfermedadAplicada)

        // Manejo de clics para agregar producto aplicado
        btnAgregarProducto.setOnClickListener {
            val producto = spinnerProductoAplicado.selectedItem.toString()
            val dosis = editDosisProducto.text.toString()
            if (producto.isNotEmpty() && dosis.isNotEmpty()) {
                productosAplicadosList.add(Pair(producto, dosis))
                Toast.makeText(this, "Producto agregado: $producto", Toast.LENGTH_SHORT).show()
                // Limpiar campos después de agregar
                spinnerProductoAplicado.setSelection(0)
                editDosisProducto.text.clear()
            } else {
                Toast.makeText(this, "Debe llenar todos los campos de producto", Toast.LENGTH_SHORT).show()
            }
        }

        // Manejo de clics para agregar enfermedad
        btnAgregarEnfermedad.setOnClickListener {
            val enfermedad = spinnerEnfermedadAplicada.selectedItem.toString()
            val fecha = editFechaEnfermedad.text.toString()
            if (enfermedad.isNotEmpty() && fecha.isNotEmpty()) {
                enfermedadesList.add(Pair(enfermedad, fecha))
                Toast.makeText(this, "Enfermedad agregada: $enfermedad", Toast.LENGTH_SHORT).show()
                // Limpiar campos después de agregar
                spinnerEnfermedadAplicada.setSelection(0)
                editFechaEnfermedad.text.clear()
            } else {
                Toast.makeText(this, "Debe llenar todos los campos de enfermedad", Toast.LENGTH_SHORT).show()
            }
        }

        // Manejo de clics para agregar baño
        btnAgregarBano.setOnClickListener {
            val productoBano = spinnerProductoBano.selectedItem.toString()
            val fechaBano = editFechaBano.text.toString()
            if (productoBano.isNotEmpty() && fechaBano.isNotEmpty()) {
                banosList.add(Pair(productoBano, fechaBano))
                Toast.makeText(this, "Baño agregado: $productoBano", Toast.LENGTH_SHORT).show()
                // Limpiar campos después de agregar
                spinnerProductoBano.setSelection(0)
                editFechaBano.text.clear()
            } else {
                Toast.makeText(this, "Debe llenar todos los campos de baño", Toast.LENGTH_SHORT).show()
            }
        }

        val btnGuardar = dialogView.findViewById<Button>(R.id.btn_guardar_animal)
        btnGuardar.setOnClickListener {
            saveAnimal(dialogView, animal)
            alertDialog.dismiss()
        }
    }

    private fun cargarProductosDesdeBD(spinner: Spinner) {
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT nombre FROM Productos", null)
        val productos = mutableListOf<String>()

        if (cursor.moveToFirst()) {
            do {
                productos.add(cursor.getString(cursor.getColumnIndexOrThrow("nombre")))
            } while (cursor.moveToNext())
        }
        cursor.close()

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, productos)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
    }

    private fun cargarEnfermedadesDesdeBD(spinner: Spinner) {
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT nombre FROM Enfermedades", null)
        val enfermedades = mutableListOf<String>()

        if (cursor.moveToFirst()) {
            do {
                enfermedades.add(cursor.getString(cursor.getColumnIndexOrThrow("nombre")))
            } while (cursor.moveToNext())
        }
        cursor.close()

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, enfermedades)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
    }

    private fun seleccionarImagen() {
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        startActivityForResult(intent, REQUEST_IMAGE_PICK)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            val imageUri: Uri? = data.data
            imageUri?.let {
                val inputStream: InputStream? = contentResolver.openInputStream(it)
                val bitmap = BitmapFactory.decodeStream(inputStream)
                imgAnimalDialogView?.setImageBitmap(bitmap)
                imgAnimalDialogView?.visibility = View.VISIBLE
                currentImageBase64 = encodeImageToBase64(bitmap)
            }
        }
    }

    private fun encodeImageToBase64(bitmap: Bitmap): String {
        val byteArrayOutputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream)
        val byteArray = byteArrayOutputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }

    private fun configurarDatePicker(editText: EditText) {
        editText.setOnClickListener {
            val calendar = Calendar.getInstance()
            val datePickerDialog = DatePickerDialog(
                this,
                { _, year, month, dayOfMonth ->
                    editText.setText(String.format("%02d/%02d/%04d", dayOfMonth, month + 1, year))
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            )
            datePickerDialog.show()
        }
    }

    private fun saveAnimal(dialogView: View, existingAnimal: Animal?) {
        val db = dbHelper.writableDatabase
        val nombre = dialogView.findViewById<EditText>(R.id.edit_nombre).text.toString()
        val codigo = dialogView.findViewById<EditText>(R.id.edit_codigo).text.toString()
        val raza = dialogView.findViewById<EditText>(R.id.edit_raza).text.toString()
        val pesoNacimiento = dialogView.findViewById<EditText>(R.id.edit_peso_nacimiento).text.toString().toDouble()
        val pesoDestete = dialogView.findViewById<EditText>(R.id.edit_peso_destete).text.toString().toDouble()
        val pesoActual = dialogView.findViewById<EditText>(R.id.edit_peso_actual).text.toString().toDouble()
        val fechaNacimiento = dialogView.findViewById<EditText>(R.id.edit_fecha_nacimiento).text.toString()
        val sexo = dialogView.findViewById<Spinner>(R.id.spinner_sexo).selectedItem.toString()
        val estado = dialogView.findViewById<EditText>(R.id.edit_estado).text.toString()
        val inseminacion = dialogView.findViewById<CheckBox>(R.id.checkbox_inseminacion).isChecked
        val observaciones = dialogView.findViewById<EditText>(R.id.edit_observaciones).text.toString()

        val contentValues = ContentValues().apply {
            put("nombre", nombre)
            put("codigo_idVaca", codigo)
            put("raza", raza)
            put("peso_nacimiento", pesoNacimiento)
            put("peso_destete", pesoDestete)
            put("peso_actual", pesoActual)
            put("fecha_nacimiento", fechaNacimiento)
            put("sexo", sexo)
            put("estado", estado)
            put("inseminacion", if (inseminacion) 1 else 0)
            put("observaciones", observaciones)
            put("imagen", currentImageBase64 ?: "")
        }

        if (existingAnimal == null) {
            db.insert("Animales", null, contentValues)
        } else {
            db.update("Animales", contentValues, "idAnimal = ?", arrayOf(existingAnimal.idAnimal.toString()))
        }

        loadAnimales()
        Toast.makeText(this, "Animal guardado", Toast.LENGTH_SHORT).show()
    }

    private fun eliminarAnimal(animal: Animal) {
        val db = dbHelper.writableDatabase
        db.delete("Animales", "idAnimal = ?", arrayOf(animal.idAnimal.toString()))
        loadAnimales()
        Toast.makeText(this, "Animal eliminado", Toast.LENGTH_SHORT).show()
    }
}
