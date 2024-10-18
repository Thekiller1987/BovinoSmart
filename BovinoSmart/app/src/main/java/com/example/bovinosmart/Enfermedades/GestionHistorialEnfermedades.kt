// GestionHistorialEnfermedades.kt
package com.example.bovinosmart.Enfermedades

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

class GestionHistorialEnfermedades : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var addButton: Button
    private lateinit var dbHelper: BoVinoSmartDBHelper
    private val historialList = mutableListOf<HistorialEnfermedad>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_historial_enfermedades)

        recyclerView = findViewById(R.id.recyclerViewHistorial)
        addButton = findViewById(R.id.addButtonHistorial)

        dbHelper = BoVinoSmartDBHelper(this)

        // Configurar RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = HistorialEnfermedadAdapter(historialList)

        // Cargar historial desde la base de datos
        loadHistorialEnfermedades()

        // Configurar el botón para agregar nuevo historial
        addButton.setOnClickListener {
            showCreateHistorialDialog()
        }
    }

    private fun loadHistorialEnfermedades() {
        historialList.clear()

        val db = dbHelper.readableDatabase
        val cursor = db.query("Historial_Enfermedades", null, null, null, null, null, null)

        if (cursor.moveToFirst()) {
            do {
                val id = cursor.getInt(cursor.getColumnIndexOrThrow("idHistoEnfermedades"))
                val idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal"))
                val idEnfermedad = cursor.getInt(cursor.getColumnIndexOrThrow("idEnfermedades"))
                val fecha = cursor.getString(cursor.getColumnIndexOrThrow("fecha"))

                historialList.add(HistorialEnfermedad(id, idAnimal, idEnfermedad, fecha))
            } while (cursor.moveToNext())
        }
        cursor.close()

        recyclerView.adapter?.notifyDataSetChanged()
    }

    private fun showCreateHistorialDialog() {
        val builder = AlertDialog.Builder(this)
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_historial_enfermedades, null)
        builder.setView(dialogView)

        val spinnerAnimal = dialogView.findViewById<Spinner>(R.id.spinnerAnimal)
        val spinnerEnfermedad = dialogView.findViewById<Spinner>(R.id.spinnerEnfermedad)
        val datePickerFecha = dialogView.findViewById<DatePicker>(R.id.datePickerFecha)

        // Cargar los datos en los spinners
        loadAnimalsIntoSpinner(spinnerAnimal)
        loadEnfermedadesIntoSpinner(spinnerEnfermedad)

        // Configurar el botón "Guardar" del diálogo
        builder.setPositiveButton("Guardar") { _, _ ->
            val selectedAnimalId = spinnerAnimal.selectedItemId.toInt()
            val selectedEnfermedadId = spinnerEnfermedad.selectedItemId.toInt()
            val day = datePickerFecha.dayOfMonth
            val month = datePickerFecha.month
            val year = datePickerFecha.year
            val fecha = "$year-${month + 1}-$day"

            // Insertar el nuevo historial en la base de datos
            insertHistorialEnfermedad(selectedAnimalId, selectedEnfermedadId, fecha)

            // Recargar el historial para reflejar los cambios
            loadHistorialEnfermedades()
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

    private fun loadEnfermedadesIntoSpinner(spinner: Spinner) {
        val enfermedadList = ArrayList<String>()
        val db = dbHelper.readableDatabase
        val cursor = db.query("Enfermedades", arrayOf("idEnfermedades", "nombre"), null, null, null, null, null)

        if (cursor.moveToFirst()) {
            do {
                val idEnfermedad = cursor.getInt(cursor.getColumnIndexOrThrow("idEnfermedades"))
                val nombreEnfermedad = cursor.getString(cursor.getColumnIndexOrThrow("nombre"))
                enfermedadList.add("ID $idEnfermedad: $nombreEnfermedad")
            } while (cursor.moveToNext())
        }
        cursor.close()

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, enfermedadList)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinner.adapter = adapter
    }

    private fun insertHistorialEnfermedad(idAnimal: Int, idEnfermedad: Int, fecha: String) {
        val values = ContentValues().apply {
            put("idAnimal", idAnimal)
            put("idEnfermedades", idEnfermedad)
            put("fecha", fecha)
        }

        val newRowId = dbHelper.writableDatabase.insert("Historial_Enfermedades", null, values)

        if (newRowId == -1L) {
            Toast.makeText(this, "Error al guardar el historial", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Historial guardado con éxito", Toast.LENGTH_SHORT).show()
        }
    }
}
