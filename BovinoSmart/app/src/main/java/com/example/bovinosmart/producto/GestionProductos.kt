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
import android.view.animation.AnimationUtils
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import java.io.ByteArrayOutputStream

class GestionProductos : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var addButton: ImageButton
    private lateinit var searchInput: EditText
    private lateinit var formContainer: CardView
    private lateinit var selectImageButton: Button
    private lateinit var imageView: ImageView

    private val productosList = mutableListOf<Producto>()
    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var db: SQLiteDatabase
    private var imageBase64: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_productos)

        // Inicialización de vistas
        dbHelper = BoVinoSmartDBHelper(this)
        db = dbHelper.writableDatabase

        recyclerView = findViewById(R.id.recyclerViewProductos)
        addButton = findViewById(R.id.addButtonProducto)
        searchInput = findViewById(R.id.searchInput)
        formContainer = findViewById(R.id.formContainer)
        selectImageButton = findViewById(R.id.selectImageButtonProducto)
        imageView = findViewById(R.id.imageViewProducto)

        // Verificación de permisos de almacenamiento
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE), REQUEST_STORAGE_PERMISSION)
        }

        // Cargar productos desde la base de datos
        loadProductosFromDatabase()

        // Configuración del RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        val adapter = ProductoAdapter(productosList) { producto ->
            showEditDialog(producto) // Llamada a la función showEditDialog
        }
        recyclerView.adapter = adapter

        // Botón para añadir producto
        addButton.setOnClickListener {
            clearForm()
            showFormWithAnimation()
            addButton.visibility = View.GONE
        }

        // Seleccionar imagen
        selectImageButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
            startActivityForResult(intent, REQUEST_IMAGE_PICK)
        }

        // Filtrado de productos
        searchInput.addTextChangedListener {
            filterProducts(it.toString(), adapter)
        }
    }

    // Método para cargar productos desde la base de datos
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
        recyclerView.adapter?.notifyDataSetChanged()
    }

    // Método para limpiar el formulario
    private fun clearForm() {
        imageBase64 = null
        findViewById<EditText>(R.id.nombreProducto).text.clear()
        findViewById<EditText>(R.id.tipoProducto).text.clear()
        findViewById<EditText>(R.id.dosisProducto).text.clear()
        findViewById<EditText>(R.id.frecuenciaProducto).text.clear()
        findViewById<EditText>(R.id.notasProducto).text.clear()
        findViewById<EditText>(R.id.motivoProducto).text.clear()
        findViewById<ImageView>(R.id.imageViewProducto).setImageDrawable(null)
    }

    // Método para mostrar el diálogo de edición
    private fun showEditDialog(producto: Producto) {
        val builder = AlertDialog.Builder(this)
        val dialogView = layoutInflater.inflate(R.layout.dialog_create_producto, null)
        builder.setView(dialogView)

        val nombreInput = dialogView.findViewById<EditText>(R.id.nombreProducto)
        val tipoInput = dialogView.findViewById<EditText>(R.id.tipoProducto)
        val dosisInput = dialogView.findViewById<EditText>(R.id.dosisProducto)
        val frecuenciaInput = dialogView.findViewById<EditText>(R.id.frecuenciaProducto)
        val motivoInput = dialogView.findViewById<EditText>(R.id.motivoProducto)
        val imageView = dialogView.findViewById<ImageView>(R.id.imageViewProducto)
        val esTratamientoCheckbox = dialogView.findViewById<CheckBox>(R.id.esTratamientoCheckbox)

        nombreInput.setText(producto.nombre)
        tipoInput.setText(producto.tipo)
        dosisInput.setText(producto.dosisRecomendada)
        frecuenciaInput.setText(producto.frecuenciaAplicacion)
        motivoInput.setText(producto.motivo)
        esTratamientoCheckbox.isChecked = producto.esTratamiento

        if (producto.imagenBase64.isNotEmpty()) {
            val byteArray = Base64.decode(producto.imagenBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
            imageView.setImageBitmap(bitmap)
        } else {
            imageView.setImageDrawable(null)
        }

        builder.setPositiveButton("Actualizar") { _, _ ->
            val nombre = nombreInput.text.toString()
            val tipo = tipoInput.text.toString()
            val dosisRecomendada = dosisInput.text.toString()
            val frecuenciaAplicacion = frecuenciaInput.text.toString()
            val motivo = motivoInput.text.toString()
            val esTratamiento = esTratamientoCheckbox.isChecked

            val values = ContentValues().apply {
                put("nombre", nombre)
                put("tipo", tipo)
                put("dosis_recomendada", dosisRecomendada)
                put("frecuencia_aplicacion", frecuenciaAplicacion)
                put("motivo", motivo)
                put("es_tratamiento", if (esTratamiento) 1 else 0)
                put("imagen", imageBase64 ?: producto.imagenBase64)
            }

            db.update("Productos", values, "idProductos = ?", arrayOf(producto.id.toString()))
            loadProductosFromDatabase()
        }

        builder.setNegativeButton("Eliminar") { _, _ ->
            db.delete("Productos", "idProductos = ?", arrayOf(producto.id.toString()))
            loadProductosFromDatabase()
        }

        builder.show()
    }

    // Método para guardar el producto
    fun saveProduct(view: View) {
        val nombre = findViewById<EditText>(R.id.nombreProducto).text.toString()
        val tipo = findViewById<EditText>(R.id.tipoProducto).text.toString()
        val dosisRecomendada = findViewById<EditText>(R.id.dosisProducto).text.toString()
        val frecuenciaAplicacion = findViewById<EditText>(R.id.frecuenciaProducto).text.toString()
        val notas = findViewById<EditText>(R.id.notasProducto).text.toString()
        val esTratamiento = findViewById<CheckBox>(R.id.esTratamientoCheckbox).isChecked
        val motivo = findViewById<EditText>(R.id.motivoProducto).text.toString()

        // Validar campos obligatorios
        if (nombre.isEmpty() || tipo.isEmpty()) {
            Toast.makeText(this, "Por favor, completa todos los campos obligatorios.", Toast.LENGTH_SHORT).show()
            return
        }

        if (imageBase64 == null) {
            Toast.makeText(this, "Por favor, selecciona una imagen.", Toast.LENGTH_SHORT).show()
            return
        }

        val values = ContentValues().apply {
            put("nombre", nombre)
            put("tipo", tipo)
            put("dosis_recomendada", dosisRecomendada)
            put("frecuencia_aplicacion", frecuenciaAplicacion)
            put("notas", notas)
            put("es_tratamiento", if (esTratamiento) 1 else 0)
            put("motivo", motivo)
            put("imagen", imageBase64)
        }

        val newRowId = db.insert("Productos", null, values)
        if (newRowId == -1L) {
            Toast.makeText(this, "Error al agregar el producto", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Producto agregado correctamente", Toast.LENGTH_SHORT).show()
            loadProductosFromDatabase()
            hideFormWithAnimation()
        }
    }

    // Método para manejar la selección de imágenes
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_PICK && resultCode == RESULT_OK && data != null) {
            val selectedImageUri: Uri? = data.data
            val imageView = findViewById<ImageView>(R.id.imageViewProducto)

            try {
                val inputStream = selectedImageUri?.let { contentResolver.openInputStream(it) }
                val bitmap = BitmapFactory.decodeStream(inputStream)

                val resizedBitmap = resizeBitmap(bitmap, 500, 500)
                imageView.setImageBitmap(resizedBitmap)

                val outputStream = ByteArrayOutputStream()
                resizedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
                val byteArray = outputStream.toByteArray()
                imageBase64 = Base64.encodeToString(byteArray, Base64.DEFAULT)

            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    // Método para redimensionar imágenes
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

    // Método para mostrar el formulario con animación
    private fun showFormWithAnimation() {
        val slideIn = AnimationUtils.loadAnimation(this, R.anim.slide_in_bottom)
        formContainer.startAnimation(slideIn)
        formContainer.visibility = View.VISIBLE
    }

    // Método para ocultar el formulario con animación
    private fun hideFormWithAnimation() {
        val slideOut = AnimationUtils.loadAnimation(this, R.anim.slide_out_bottom)
        formContainer.startAnimation(slideOut)
        formContainer.visibility = View.GONE
        addButton.visibility = View.VISIBLE
    }

    // Método para filtrar productos
    private fun filterProducts(query: String, adapter: ProductoAdapter) {
        val filteredList = productosList.filter {
            it.nombre.contains(query, ignoreCase = true)
        }
        adapter.updateList(filteredList)
    }

    companion object {
        const val REQUEST_IMAGE_PICK = 1
        const val REQUEST_STORAGE_PERMISSION = 100
    }
}
