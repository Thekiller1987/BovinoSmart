package com.example.bovinosmart.Enfermedades


import android.content.ContentValues
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import java.io.ByteArrayOutputStream

class GestionEnfermedades : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var addButton: ImageButton

    private val enfermedadesList = mutableListOf<Enfermedad>()
    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var db: SQLiteDatabase
    private var imageBase64: String? = null
    private var dialogView: View? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_enfermedades)

        // Inicializar la base de datos
        dbHelper = BoVinoSmartDBHelper(this)
        db = dbHelper.writableDatabase

        recyclerView = findViewById(R.id.recyclerViewEnfermedades)
        addButton = findViewById(R.id.addButton)

        // Cargar enfermedades desde la base de datos SQLite
        loadEnfermedadesFromDatabase()

        // Configurar RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        val adapter = EnfermedadAdapter(enfermedadesList) { enfermedad ->
            showEditDialog(enfermedad)
        }
        recyclerView.adapter = adapter

        // Agregar nueva enfermedad
        addButton.setOnClickListener {
            showCreateDialog(adapter)
        }
    }

    private fun loadEnfermedadesFromDatabase() {
        enfermedadesList.clear()

        val cursor = db.query("Enfermedades", null, null, null, null, null, null)
        if (cursor.moveToFirst()) {
            do {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("idEnfermedades"))
                val nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
                val descripcion = cursor.getString(cursor.getColumnIndexOrThrow("descripcion"))
                val imagenBase64 = cursor.getString(cursor.getColumnIndexOrThrow("imagen"))
                enfermedadesList.add(Enfermedad(id, nombre, descripcion, imagenBase64))
            } while (cursor.moveToNext())
        }
        cursor.close()
    }

    private fun showCreateDialog(adapter: EnfermedadAdapter) {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_enfermedad, null)
        builder.setView(dialogView)

        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreEnfermedad)
        val descripcionInput = dialogView?.findViewById<EditText>(R.id.descripcionEnfermedad)
        val selectImageButton = dialogView?.findViewById<Button>(R.id.selectImageButton)
        val imageView = dialogView?.findViewById<ImageView>(R.id.imageView)

        // Lógica para seleccionar una imagen
        selectImageButton?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        builder.setPositiveButton("Guardar") { _, _ ->
            val nombre = nombreInput?.text.toString()
            val descripcion = descripcionInput?.text.toString()

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("descripcion", descripcion)
                put("imagen", imageBase64 ?: "") // Guardar la imagen codificada en Base64
            }

            db.insert("Enfermedades", null, values)
            loadEnfermedadesFromDatabase()
            adapter.notifyDataSetChanged()
        }
        builder.setNegativeButton("Cancelar", null)
        builder.show()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            val selectedImageUri: Uri? = data.data
            val imageView = dialogView?.findViewById<ImageView>(R.id.imageView)

            try {
                val inputStream = selectedImageUri?.let { contentResolver.openInputStream(it) }
                val bitmap = BitmapFactory.decodeStream(inputStream)

                // Redimensionar la imagen para evitar que sea demasiado grande
                val resizedBitmap = resizeBitmap(bitmap, 500, 500) // Ajustar tamaño máximo a 500x500 píxeles
                imageView?.setImageBitmap(resizedBitmap)

                // Codificar la imagen redimensionada a Base64
                val outputStream = ByteArrayOutputStream()
                resizedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream) // Usar 85% de calidad
                val byteArray = outputStream.toByteArray()
                imageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT)

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Función para redimensionar la imagen
    private fun resizeBitmap(bitmap: Bitmap, maxWidth: Int, maxHeight: Int): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        val ratioBitmap = width.toFloat() / height.toFloat()
        val ratioMax = maxWidth.toFloat() / maxHeight.toFloat()

        var finalWidth = maxWidth
        var finalHeight = maxHeight
        if (ratioMax > 1) {
            finalWidth = (maxHeight * ratioBitmap).toInt()
        } else {
            finalHeight = (maxWidth / ratioBitmap).toInt()
        }

        return Bitmap.createScaledBitmap(bitmap, finalWidth, finalHeight, true)
    }

    companion object {
        const val REQUEST_IMAGE_PICK = 1
    }

    private fun showEditDialog(enfermedad: Enfermedad) {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_enfermedad, null)
        builder.setView(dialogView)

        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreEnfermedad)
        val descripcionInput = dialogView?.findViewById<EditText>(R.id.descripcionEnfermedad)
        val imageView = dialogView?.findViewById<ImageView>(R.id.imageView)

        // Mostrar los datos actuales de la enfermedad
        nombreInput?.setText(enfermedad.nombre)
        descripcionInput?.setText(enfermedad.descripcion)

        // Mostrar la imagen si existe
        if (enfermedad.imagenBase64.isNotEmpty()) {
            val byteArray = Base64.decode(enfermedad.imagenBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
            imageView?.setImageBitmap(bitmap)
        }

        val selectImageButton = dialogView?.findViewById<Button>(R.id.selectImageButton)
        selectImageButton?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        builder.setPositiveButton("Actualizar") { _, _ ->
            val nombre = nombreInput?.text.toString()
            val descripcion = descripcionInput?.text.toString()

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("descripcion", descripcion)
                put("imagen", imageBase64 ?: enfermedad.imagenBase64) // Actualiza la imagen solo si se ha seleccionado una nueva
            }

            db.update("Enfermedades", values, "idEnfermedades = ?", arrayOf(enfermedad.id.toString()))
            loadEnfermedadesFromDatabase()
            recyclerView.adapter?.notifyDataSetChanged()
        }

        builder.setNegativeButton("Eliminar") { _, _ ->
            db.delete("Enfermedades", "idEnfermedades = ?", arrayOf(enfermedad.id.toString()))
            loadEnfermedadesFromDatabase()
            recyclerView.adapter?.notifyDataSetChanged()
        }
        builder.show()
    }
}
