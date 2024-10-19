package com.example.bovinosmart.producto

import android.Manifest
import android.content.ContentValues
import android.content.Intent
import android.content.pm.PackageManager
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
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import java.io.ByteArrayOutputStream

class GestionProductos : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var addButton: ImageButton
    private val productosList = mutableListOf<Producto>()
    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var db: SQLiteDatabase
    private var imageBase64: String? = null
    private lateinit var adapter: ProductoAdapter
    private var dialogView: View? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_productos)

        // Inicialización de vistas
        dbHelper = BoVinoSmartDBHelper(this)
        db = dbHelper.writableDatabase

        recyclerView = findViewById(R.id.recyclerViewProductos)
        addButton = findViewById(R.id.addButtonProducto)

        // Inicializar el adaptador antes de cargar los datos
        adapter = ProductoAdapter(productosList) { producto ->
            showEditDialog(producto)
        }
        recyclerView.adapter = adapter

        // Configurar el RecyclerView con GridLayoutManager para dos columnas
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        // Cargar productos desde la base de datos
        loadProductosFromDatabase()

        // Botón para añadir producto
        addButton.setOnClickListener {
            showCreateDialog()
        }

        // Verificación de permisos de almacenamiento
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), REQUEST_STORAGE_PERMISSION)
        }
    }

    private fun loadProductosFromDatabase() {
        productosList.clear()
        val cursor = db.query("Productos", null, null, null, null, null, null)
        if (cursor.moveToFirst()) {
            do {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("idProductos"))
                val nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
                val tipo = cursor.getString(cursor.getColumnIndexOrThrow("tipo"))
                val dosisRecomendada = cursor.getString(cursor.getColumnIndexOrThrow("dosis_recomendada"))
                val frecuenciaAplicacion = cursor.getString(cursor.getColumnIndexOrThrow("frecuencia_aplicacion"))
                val notas = cursor.getString(cursor.getColumnIndexOrThrow("notas"))
                val esTratamiento = cursor.getInt(cursor.getColumnIndexOrThrow("es_tratamiento")) == 1
                val motivo = cursor.getString(cursor.getColumnIndexOrThrow("motivo"))
                val imagenBase64 = cursor.getString(cursor.getColumnIndexOrThrow("imagen")) ?: ""

                productosList.add(
                    Producto(id, nombre, tipo, dosisRecomendada, frecuenciaAplicacion, notas, esTratamiento, motivo, imagenBase64)
                )
            } while (cursor.moveToNext())
        }
        cursor.close()
        adapter.notifyDataSetChanged()
    }

    private fun showCreateDialog() {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_producto, null)
        builder.setView(dialogView)
        val alertDialog = builder.create()

        // Inicializar los componentes del diálogo
        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreProducto)
        val tipoInput = dialogView?.findViewById<EditText>(R.id.tipoProducto)
        val dosisInput = dialogView?.findViewById<EditText>(R.id.dosisProducto)
        val frecuenciaInput = dialogView?.findViewById<EditText>(R.id.frecuenciaProducto)
        val motivoInput = dialogView?.findViewById<EditText>(R.id.motivoProducto)
        val imageViewDialog = dialogView?.findViewById<ImageView>(R.id.imageViewProducto)
        val esTratamientoCheckbox = dialogView?.findViewById<CheckBox>(R.id.esTratamientoCheckbox)
        val guardarButton = dialogView?.findViewById<Button>(R.id.guardarProductoButton)

        // Seleccionar imagen
        imageViewDialog?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        // Guardar el nuevo producto
        guardarButton?.setOnClickListener {
            val nombre = nombreInput?.text.toString()
            val tipo = tipoInput?.text.toString()
            val dosis = dosisInput?.text.toString()
            val frecuencia = frecuenciaInput?.text.toString()
            val motivo = motivoInput?.text.toString()
            val esTratamiento = esTratamientoCheckbox?.isChecked ?: false

            if (nombre.isBlank() || tipo.isBlank() || dosis.isBlank() || frecuencia.isBlank() || motivo.isBlank()) {
                Toast.makeText(this, "Por favor, completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("tipo", tipo)
                put("dosis_recomendada", dosis)
                put("frecuencia_aplicacion", frecuencia)
                put("motivo", motivo)
                put("es_tratamiento", esTratamiento)
                put("imagen", imageBase64 ?: "")
            }

            val newRowId = db.insert("Productos", null, values)
            if (newRowId == -1L) {
                Toast.makeText(this, "Error al guardar el producto", Toast.LENGTH_SHORT).show()
            } else {
                loadProductosFromDatabase()
                alertDialog.dismiss()
                Toast.makeText(this, "Producto guardado con éxito", Toast.LENGTH_SHORT).show()
            }
        }

        alertDialog.show()
    }

    private fun showEditDialog(producto: Producto) {
        val builder = AlertDialog.Builder(this)
        dialogView = layoutInflater.inflate(R.layout.dialog_create_producto, null)
        builder.setView(dialogView)
        val alertDialog = builder.create()

        val nombreInput = dialogView?.findViewById<EditText>(R.id.nombreProducto)
        val tipoInput = dialogView?.findViewById<EditText>(R.id.tipoProducto)
        val dosisInput = dialogView?.findViewById<EditText>(R.id.dosisProducto)
        val frecuenciaInput = dialogView?.findViewById<EditText>(R.id.frecuenciaProducto)
        val motivoInput = dialogView?.findViewById<EditText>(R.id.motivoProducto)
        val imageViewDialog = dialogView?.findViewById<ImageView>(R.id.imageViewProducto)
        val esTratamientoCheckbox = dialogView?.findViewById<CheckBox>(R.id.esTratamientoCheckbox)
        val guardarButton = dialogView?.findViewById<Button>(R.id.guardarProductoButton)

        // Rellenar los campos con los datos del producto seleccionado
        nombreInput?.setText(producto.nombre)
        tipoInput?.setText(producto.tipo)
        dosisInput?.setText(producto.dosisRecomendada)
        frecuenciaInput?.setText(producto.frecuenciaAplicacion)
        motivoInput?.setText(producto.motivo)
        esTratamientoCheckbox?.isChecked = producto.esTratamiento

        if (producto.imagenBase64.isNotEmpty()) {
            val byteArray = Base64.decode(producto.imagenBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
            imageViewDialog?.setImageBitmap(bitmap)
        } else {
            imageViewDialog?.setImageDrawable(null)
        }

        imageViewDialog?.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        // Cambiar el texto del botón a "Editar"
        guardarButton?.text = "Editar"
        guardarButton?.setOnClickListener {
            val nombre = nombreInput?.text.toString()
            val tipo = tipoInput?.text.toString()
            val dosis = dosisInput?.text.toString()
            val frecuencia = frecuenciaInput?.text.toString()
            val motivo = motivoInput?.text.toString()
            val esTratamiento = esTratamientoCheckbox?.isChecked ?: false

            if (nombre.isBlank() || tipo.isBlank() || dosis.isBlank() || frecuencia.isBlank() || motivo.isBlank()) {
                Toast.makeText(this, "Por favor, completa todos los campos", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("tipo", tipo)
                put("dosis_recomendada", dosis)
                put("frecuencia_aplicacion", frecuencia)
                put("motivo", motivo)
                put("es_tratamiento", esTratamiento)
                put("imagen", imageBase64 ?: producto.imagenBase64)
            }

            // Actualizar en la base de datos
            db.update("Productos", values, "idProductos = ?", arrayOf(producto.id.toString()))
            loadProductosFromDatabase()
            alertDialog.dismiss()
            Toast.makeText(this, "Producto actualizado con éxito", Toast.LENGTH_SHORT).show()
        }

        // Botón "Eliminar" creado programáticamente y solo visible en este diálogo
        val eliminarButton = Button(this).apply {
            text = "Eliminar"
            setOnClickListener {
                db.delete("Productos", "idProductos = ?", arrayOf(producto.id.toString()))
                loadProductosFromDatabase()
                alertDialog.dismiss()
                Toast.makeText(this@GestionProductos, "Producto eliminado con éxito", Toast.LENGTH_SHORT).show()
            }
        }

        // Agregar el botón "Eliminar" al layout del diálogo
        (dialogView?.findViewById<LinearLayout>(R.id.formContainer))?.addView(eliminarButton)

        alertDialog.show()
    }


    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            val selectedImageUri: Uri? = data.data
            val imageView = dialogView?.findViewById<ImageView>(R.id.imageViewProducto)

            try {
                selectedImageUri?.let {
                    val inputStream = contentResolver.openInputStream(it)
                    val bitmap = BitmapFactory.decodeStream(inputStream)

                    val resizedBitmap = resizeBitmap(bitmap, 500, 500)
                    imageView?.setImageBitmap(resizedBitmap)

                    val outputStream = ByteArrayOutputStream()
                    resizedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
                    val byteArray = outputStream.toByteArray()
                    imageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT)

                    inputStream?.close()
                }
            } catch (e: Exception) {
                e.printStackTrace()
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

    companion object {
        const val REQUEST_IMAGE_PICK = 1
        const val REQUEST_STORAGE_PERMISSION = 100
    }
}
