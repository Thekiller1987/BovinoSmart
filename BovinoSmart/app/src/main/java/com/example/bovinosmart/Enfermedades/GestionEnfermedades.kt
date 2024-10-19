package com.example.bovinosmart.Enfermedades

import Enfermedad
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
import androidx.recyclerview.widget.GridLayoutManager
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
    private lateinit var adapter: EnfermedadAdapter

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
        recyclerView.layoutManager = GridLayoutManager(this, 2)
        adapter = EnfermedadAdapter(enfermedadesList, { enfermedad ->
            showEditDialog(enfermedad)
        }, { enfermedad ->
            deleteEnfermedad(enfermedad)
        })
        recyclerView.adapter = adapter

        // Agregar nueva enfermedad
        addButton.setOnClickListener {
            showCreateDialog()
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
                val sintomas = cursor.getString(cursor.getColumnIndexOrThrow("sintomas"))
                val modoTransmision = cursor.getString(cursor.getColumnIndexOrThrow("modotrasmision"))
                val imagenBase64 = cursor.getString(cursor.getColumnIndexOrThrow("imagen"))
                enfermedadesList.add(Enfermedad(id, nombre, descripcion, sintomas, modoTransmision, imagenBase64))
            } while (cursor.moveToNext())
        }
        cursor.close()
    }

    private fun showCreateDialog() {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_enfermedad, null)
        builder.setView(dialogView)
        val alertDialog = builder.create()

        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreEnfermedad)
        val descripcionInput = dialogView?.findViewById<EditText>(R.id.descripcionEnfermedad)
        val sintomasInput = dialogView?.findViewById<EditText>(R.id.sintomasEnfermedad)
        val modoTransmisionInput = dialogView?.findViewById<EditText>(R.id.modoTransmisionEnfermedad)
        val imageView = dialogView?.findViewById<ImageView>(R.id.imageViewEnfermedad)
        val guardarButton = dialogView?.findViewById<Button>(R.id.guardarButton)

        dialogView?.findViewById<Button>(R.id.eliminarButton)?.visibility = View.GONE

        imageView?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        guardarButton?.setOnClickListener {
            val nombre = nombreInput?.text.toString()
            val descripcion = descripcionInput?.text.toString()
            val sintomas = sintomasInput?.text.toString()
            val modoTransmision = modoTransmisionInput?.text.toString()

            if (nombre.isBlank() || descripcion.isBlank() || sintomas.isBlank() || modoTransmision.isBlank()) {
                Toast.makeText(this, "Por favor, completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("descripcion", descripcion)
                put("sintomas", sintomas)
                put("modotrasmision", modoTransmision)
                put("imagen", imageBase64 ?: "")
            }

            val newRowId = db.insert("Enfermedades", null, values)

            if (newRowId == -1L) {
                Toast.makeText(this, "Error al guardar la enfermedad", Toast.LENGTH_SHORT).show()
            } else {
                loadEnfermedadesFromDatabase()
                adapter.notifyDataSetChanged()
                Toast.makeText(this, "Enfermedad guardada con éxito", Toast.LENGTH_SHORT).show()
                alertDialog.dismiss()
            }
        }

        alertDialog.show()
    }

    private fun showEditDialog(enfermedad: Enfermedad) {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_enfermedad, null)
        builder.setView(dialogView)
        val alertDialog = builder.create()

        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreEnfermedad)
        val descripcionInput = dialogView?.findViewById<EditText>(R.id.descripcionEnfermedad)
        val sintomasInput = dialogView?.findViewById<EditText>(R.id.sintomasEnfermedad)
        val modoTransmisionInput = dialogView?.findViewById<EditText>(R.id.modoTransmisionEnfermedad)
        val imageView = dialogView?.findViewById<ImageView>(R.id.imageViewEnfermedad)
        val guardarButton = dialogView?.findViewById<Button>(R.id.guardarButton)
        val eliminarButton = dialogView?.findViewById<Button>(R.id.eliminarButton)

        nombreInput?.setText(enfermedad.nombre)
        descripcionInput?.setText(enfermedad.descripcion)
        sintomasInput?.setText(enfermedad.sintomas)
        modoTransmisionInput?.setText(enfermedad.modoTransmision)

        if (enfermedad.imagenBase64.isNotEmpty()) {
            val byteArray = Base64.decode(enfermedad.imagenBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
            imageView?.setImageBitmap(bitmap)
        }

        imageView?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        guardarButton?.setOnClickListener {
            val nombre = nombreInput?.text.toString()
            val descripcion = descripcionInput?.text.toString()
            val sintomas = sintomasInput?.text.toString()
            val modoTransmision = modoTransmisionInput?.text.toString()

            if (nombre.isBlank() || descripcion.isBlank() || sintomas.isBlank() || modoTransmision.isBlank()) {
                Toast.makeText(this, "Por favor, completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("descripcion", descripcion)
                put("sintomas", sintomas)
                put("modotrasmision", modoTransmision)
                put("imagen", imageBase64 ?: enfermedad.imagenBase64)
            }

            db.update("Enfermedades", values, "idEnfermedades = ?", arrayOf(enfermedad.id.toString()))
            loadEnfermedadesFromDatabase()
            adapter.notifyDataSetChanged()
            alertDialog.dismiss()
        }

        eliminarButton?.setOnClickListener {
            deleteEnfermedad(enfermedad)
            alertDialog.dismiss()
        }

        alertDialog.show()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            val selectedImageUri: Uri? = data.data
            val imageView = dialogView?.findViewById<ImageView>(R.id.imageViewEnfermedad)

            try {
                selectedImageUri?.let {
                    val inputStream = contentResolver.openInputStream(it)
                    val bitmap = BitmapFactory.decodeStream(inputStream)

                    // Redimensionar la imagen para evitar que sea demasiado grande
                    val resizedBitmap = resizeBitmap(bitmap, 500, 500)
                    imageView?.setImageBitmap(resizedBitmap)

                    // Codificar la imagen redimensionada a Base64
                    val outputStream = ByteArrayOutputStream()
                    resizedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
                    val byteArray = outputStream.toByteArray()
                    imageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT)

                    inputStream?.close()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this, "Error al seleccionar la imagen", Toast.LENGTH_SHORT).show()
            }
        }
    }

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

    private fun deleteEnfermedad(enfermedad: Enfermedad) {
        val rowsDeleted = db.delete("Enfermedades", "idEnfermedades = ?", arrayOf(enfermedad.id.toString()))
        if (rowsDeleted > 0) {
            Toast.makeText(this, "Enfermedad eliminada", Toast.LENGTH_SHORT).show()
            loadEnfermedadesFromDatabase()
            adapter.notifyDataSetChanged()
        } else {
            Toast.makeText(this, "Error al eliminar la enfermedad", Toast.LENGTH_SHORT).show()
        }
    }

    companion object {
        const val REQUEST_IMAGE_PICK = 1
    }
}
