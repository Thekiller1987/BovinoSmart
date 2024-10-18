// GestionHistorialProductos.kt
package com.example.bovinosmart.Productos

import HistorialProducto
import android.app.AlertDialog
import android.content.ContentValues
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.DatePicker
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper

class GestionHistorialProductos : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var addButton: Button
    private lateinit var dbHelper: BoVinoSmartDBHelper
    private val historialProductosList = mutableListOf<HistorialProducto>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_historial_productos)

        recyclerView = findViewById(R.id.recyclerViewHistorialProductos)
        addButton = findViewById(R.id.addButtonHistorialProducto)

        dbHelper = BoVinoSmartDBHelper(this)

        // Configurar RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = HistorialProductoAdapter(historialProductosList)

        // Cargar historial de productos desde la base de datos
        loadHistorialProductos()

        // Configurar el botón para agregar nuevo historial de productos
        addButton.setOnClickListener {
            showCreateHistorialProductoDialog()
        }
    }

    private fun loadHistorialProductos() {
        historialProductosList.clear()

        val db = dbHelper.readableDatabase
        val cursor = db.query("Historial_Productos", null, null, null, null, null, null)

        if (cursor.moveToFirst()) {
            do {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("idHistoProducto"))
                val idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal"))
                val idProducto = cursor.getInt(cursor.getColumnIndexOrThrow("idProductos"))
                val dosis = cursor.getString(cursor.getColumnIndexOrThrow("dosis"))
                val fecha = cursor.getString(cursor.getColumnIndexOrThrow("fecha"))
                val esTratamiento = cursor.getInt(cursor.getColumnIndexOrThrow("es_tratamiento")) == 1

                historialProductosList.add(HistorialProducto(id, idAnimal, idProducto, dosis, fecha, esTratamiento))
            } while (cursor.moveToNext())
        }
        cursor.close()

        recyclerView.adapter?.notifyDataSetChanged()
    }

    private fun showCreateHistorialProductoDialog() {
        val builder = AlertDialog.Builder(this)
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_historial_productos, null)
        builder.setView(dialogView)

        val spinnerAnimal = dialogView.findViewById<Spinner>(R.id.spinnerAnimal)
        val spinnerProducto = dialogView.findViewById<Spinner>(R.id.spinnerProducto)
        val datePickerFecha = dialogView.findViewById<DatePicker>(R.id.datePickerFecha)
        val dosisInput = dialogView.findViewById<android.widget.EditText>(R.id.inputDosis)
        val tratamientoSwitch = dialogView.findViewById<android.widget.Switch>(R.id.switchTratamiento)

        // Cargar los datos en los spinners
        loadAnimalsIntoSpinner(spinnerAnimal)
        loadProductosIntoSpinner(spinnerProducto)

        // Configurar el botón "Guardar" del diálogo
        builder.setPositiveButton("Guardar") { _, _ ->
            val selectedAnimalId = spinnerAnimal.selectedItemId.toInt()
            val selectedProductoId = spinnerProducto.selectedItemId.toInt()
            val dosis = dosisInput.text.toString()
            val esTratamiento = tratamientoSwitch.isChecked
            val day = datePickerFecha.dayOfMonth
            val month = datePickerFecha.month
            val year = datePickerFecha.year
            val fecha = "$year-${month + 1}-$day"

            // Insertar el nuevo historial en la base de datos
            insertHistorialProducto(selectedAnimalId, selectedProductoId, dosis, fecha, esTratamiento)

            // Recargar el historial para reflejar los cambios
            loadHistorialProductos()
        }

        builder.setNegativeButton("Cancelar", null)
        builder.show()
    }

    private fun loadAnimalsIntoSpinner(spinner: Spinner) {
        val animalList = ArrayList<String>()
        val db = dbHelper.readableDatabase
        val cursor = db.query("Animales", arrayOf("idAnimal", "nombre"), null, null, null, null, null)

        if (cursor.moveToFirst()) {
            do {
                val idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal"))
                val nombreAnimal = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
                animalList.add("ID $idAnimal: $nombreAnimal")
            } while (cursor.moveToNext())
        }
        cursor.close()

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, animalList)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
    }

    private fun loadProductosIntoSpinner(spinner: Spinner) {
        val productoList = ArrayList<String>()
        val db = dbHelper.readableDatabase
        val cursor = db.query("Productos", arrayOf("idProductos", "nombre"), null, null, null, null, null)

        if (cursor.moveToFirst()) {
            do {
                val idProducto = cursor.getInt(cursor.getColumnIndexOrThrow("idProductos"))
                val nombreProducto = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
                productoList.add("ID $idProducto: $nombreProducto")
            } while (cursor.moveToNext())
        }
        cursor.close()

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, productoList)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
    }

    private fun insertHistorialProducto(idAnimal: Int, idProducto: Int, dosis: String, fecha: String, esTratamiento: Boolean) {
        val values = ContentValues().apply {
            put("idAnimal", idAnimal)
            put("idProductos", idProducto)
            put("dosis", dosis)
            put("fecha", fecha)
            put("es_tratamiento", if (esTratamiento) 1 else 0)
        }

        val newRowId = dbHelper.writableDatabase.insert("Historial_Productos", null, values)

        if (newRowId == -1L) {
            Toast.makeText(this, "Error al guardar el historial de productos", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Historial de productos guardado con éxito", Toast.LENGTH_SHORT).show()
        }
    }
}
