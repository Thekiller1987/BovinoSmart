// GestionControlBanosActivity.kt
package com.example.bovinosmart.controlbanos

import ControlBano
import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.ContentValues
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.Banos.ControlBanoAdapter
import com.example.bovinosmart.R
import com.example.bovinosmart.animal.Animal
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import com.example.bovinosmart.producto.Producto
import java.util.*

class GestionControlBanosActivity : AppCompatActivity() {

    private lateinit var dbHelper: BoVinoSmartDBHelper
    private lateinit var controlBanosAdapter: ControlBanoAdapter
    private val controlBanosList = mutableListOf<ControlBano>()
    private val productosList = mutableListOf<Producto>()
    private val animalesList = mutableListOf<Animal>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_control_banos)

        dbHelper = BoVinoSmartDBHelper(this)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewControlBanos)
        recyclerView.layoutManager = LinearLayoutManager(this)

        // Inicializar el adaptador
        controlBanosAdapter = ControlBanoAdapter(
            controlBanosList,
            animalesList,
            onEdit = { controlBano ->
                // Lógica para editar el control de baño
                showEditControlBanoDialog(controlBano)
            },
            onDelete = { controlBano ->
                // Lógica para eliminar el control de baño
                deleteControlBano(controlBano)
            }
        )

        recyclerView.adapter = controlBanosAdapter

        // Cargar datos
        loadProductos()
        loadAnimales()
        loadControlBanos()

        // Configurar botón para agregar un nuevo control de baño
        val addButton: Button = findViewById(R.id.addButtonControlBanos)
        addButton.setOnClickListener {
            showAddControlBanoDialog()
        }
    }

    private fun showAddControlBanoDialog() {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_control_banos, null)
        val builder = AlertDialog.Builder(this)
            .setView(dialogView)
            .setTitle("Agregar Control de Baño")

        val fechaEditText: EditText = dialogView.findViewById(R.id.fechaBanoEditText)
        val productoSpinner: Spinner = dialogView.findViewById(R.id.productoSpinner)
        val animalSpinner: Spinner = dialogView.findViewById(R.id.animalSpinner)

        // Configurar Spinners
        val productoAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, productosList.map { it.nombre })
        productoSpinner.adapter = productoAdapter

        val animalAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, animalesList.map { it.nombre })
        animalSpinner.adapter = animalAdapter

        // Configurar DatePicker
        fechaEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            DatePickerDialog(this, { _, year, month, dayOfMonth ->
                fechaEditText.setText("$dayOfMonth/${month + 1}/$year")
            }, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)).show()
        }

        builder.setPositiveButton("Guardar") { _, _ ->
            val idProducto = productosList[productoSpinner.selectedItemPosition].id
            val idAnimal = animalesList[animalSpinner.selectedItemPosition].idAnimal
            val fecha = fechaEditText.text.toString()
            val productosUtilizados = productosList[productoSpinner.selectedItemPosition].nombre

            saveControlBano(fecha, idProducto, idAnimal, productosUtilizados)
        }

        builder.setNegativeButton("Cancelar", null)
        builder.create().show()
    }

    private fun saveControlBano(fecha: String, idProducto: Int, idAnimal: Int, productosUtilizados: String) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("idAnimal", idAnimal)
            put("fecha", fecha)
            put("idProducto", idProducto)
            put("productos_utilizados", productosUtilizados)
        }

        db.insert("Control_Banos", null, values)
        loadControlBanos()
    }

    private fun loadProductos() {
        productosList.clear()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Productos", null)

        while (cursor.moveToNext()) {
            val producto = Producto(
                id = cursor.getInt(cursor.getColumnIndexOrThrow("idProductos")),
                nombre = cursor.getString(cursor.getColumnIndexOrThrow("nombre")),
                tipo = cursor.getString(cursor.getColumnIndexOrThrow("tipo")),
                dosisRecomendada = cursor.getString(cursor.getColumnIndexOrThrow("dosis_recomendada")),
                frecuenciaAplicacion = cursor.getString(cursor.getColumnIndexOrThrow("frecuencia_aplicacion")),
                notas = cursor.getString(cursor.getColumnIndexOrThrow("notas")),
                esTratamiento = cursor.getInt(cursor.getColumnIndexOrThrow("es_tratamiento")) == 1,
                motivo = cursor.getString(cursor.getColumnIndexOrThrow("motivo")),
                imagenBase64 = cursor.getString(cursor.getColumnIndexOrThrow("imagen"))
            )
            productosList.add(producto)
        }
        cursor.close()
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

    private fun loadControlBanos() {
        controlBanosList.clear()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Control_Banos", null)

        while (cursor.moveToNext()) {
            val controlBano = ControlBano(
                id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal")),
                fecha = cursor.getString(cursor.getColumnIndexOrThrow("fecha")),
                idProducto = cursor.getInt(cursor.getColumnIndexOrThrow("idProducto")),
                productosUtilizados = cursor.getString(cursor.getColumnIndexOrThrow("productos_utilizados"))
            )
            controlBanosList.add(controlBano)
        }
        cursor.close()
        controlBanosAdapter.notifyDataSetChanged()
    }

    private fun deleteControlBano(controlBano: ControlBano) {
        val db = dbHelper.writableDatabase
        db.delete("Control_Banos", "id = ?", arrayOf(controlBano.id.toString()))
        loadControlBanos()
    }

    private fun showEditControlBanoDialog(controlBano: ControlBano) {
        // Implementa la lógica para editar un control de baño
    }
}
