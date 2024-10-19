package com.example.bovinosmart.ProduccionLeche

import android.app.AlertDialog
import android.content.ContentValues
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.animal.Animal
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import com.example.bovinosmart.produccion.ProduccionLeche

class GestionProduccionLecheActivity : AppCompatActivity() {

    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var produccionLecheAdapter: ProduccionLecheAdapter
    private val produccionLecheList = mutableListOf<ProduccionLeche>()
    private val animalesList = mutableListOf<Animal>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_produccion_leche)

        dbHelper = BoVinoSmartDBHelper(this)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewProduccionLeche)
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Configurar el adaptador
        produccionLecheAdapter = ProduccionLecheAdapter(produccionLecheList,
            onEdit = { produccionLeche -> showProduccionLecheDialog(produccionLeche) },
            onDelete = { produccionLeche -> deleteProduccionLeche(produccionLeche) }
        )
        recyclerView.adapter = produccionLecheAdapter

        // Cargar datos
        loadAnimales()
        loadProduccionLeche()

        // Botón para agregar nueva producción de leche
        val addButton: Button = findViewById(R.id.addButtonProduccionLeche)
        addButton.setOnClickListener {
            showProduccionLecheDialog()
        }
    }

    private fun loadAnimales() {
        animalesList.clear()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Animales", null)

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
    }

    private fun loadProduccionLeche() {
        produccionLecheList.clear()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Produccion_Leche", null)

        while (cursor.moveToNext()) {
            val produccionLeche = ProduccionLeche(
                id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal")),
                fecha = cursor.getString(cursor.getColumnIndexOrThrow("fecha")),
                cantidad = cursor.getDouble(cursor.getColumnIndexOrThrow("cantidad")),
                calidad = cursor.getInt(cursor.getColumnIndexOrThrow("calidad"))
            )
            produccionLecheList.add(produccionLeche)
        }
        cursor.close()
        produccionLecheAdapter.notifyDataSetChanged()
    }

    private fun showProduccionLecheDialog(produccionLeche: ProduccionLeche? = null) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_produccion_leche, null)
        val builder = AlertDialog.Builder(this)
            .setView(dialogView)
            .setTitle(if (produccionLeche == null) "Agregar Producción de Leche" else "Editar Producción de Leche")

        val fechaEditText: EditText = dialogView.findViewById(R.id.editTextFecha)
        val cantidadEditText: EditText = dialogView.findViewById(R.id.editTextCantidad)
        val calidadSpinner: Spinner = dialogView.findViewById(R.id.spinnerCalidad)
        val animalSpinner: Spinner = dialogView.findViewById(R.id.spinnerAnimal)

        // Configura los Spinner de calidad y animal
        ArrayAdapter.createFromResource(
            this,
            R.array.calidad_array, // Asegúrate de que exista un array de calidad en res/values/strings.xml
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            calidadSpinner.adapter = adapter
        }

        val animalAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, animalesList.map { it.nombre })
        animalAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        animalSpinner.adapter = animalAdapter

        // Configura los campos si es una edición
        produccionLeche?.let {
            fechaEditText.setText(it.fecha)
            cantidadEditText.setText(it.cantidad.toString())
            calidadSpinner.setSelection(it.calidad - 1)
            val animalIndex = animalesList.indexOfFirst { animal -> animal.idAnimal == it.idAnimal }
            if (animalIndex >= 0) animalSpinner.setSelection(animalIndex)
        }

        builder.setPositiveButton("Guardar") { _, _ ->
            val fecha = fechaEditText.text.toString()
            val cantidad = cantidadEditText.text.toString().toDoubleOrNull() ?: 0.0
            val calidad = calidadSpinner.selectedItemPosition + 1
            val idAnimal = animalesList[animalSpinner.selectedItemPosition].idAnimal

            if (produccionLeche == null) {
                insertProduccionLeche(idAnimal, fecha, cantidad, calidad)
            } else {
                updateProduccionLeche(produccionLeche.id, idAnimal, fecha, cantidad, calidad)
            }
            loadProduccionLeche()
        }

        builder.setNegativeButton("Cancelar", null)
        builder.create().show()
    }

    private fun insertProduccionLeche(idAnimal: Int, fecha: String, cantidad: Double, calidad: Int) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("idAnimal", idAnimal)
            put("fecha", fecha)
            put("cantidad", cantidad)
            put("calidad", calidad)
        }
        db.insert("Produccion_Leche", null, values)
    }

    private fun updateProduccionLeche(id: Int, idAnimal: Int, fecha: String, cantidad: Double, calidad: Int) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("idAnimal", idAnimal)
            put("fecha", fecha)
            put("cantidad", cantidad)
            put("calidad", calidad)
        }
        db.update("Produccion_Leche", values, "id = ?", arrayOf(id.toString()))
    }

    private fun deleteProduccionLeche(produccionLeche: ProduccionLeche) {
        val db = dbHelper.writableDatabase
        db.delete("Produccion_Leche", "id = ?", arrayOf(produccionLeche.id.toString()))
        loadProduccionLeche()
    }
}
