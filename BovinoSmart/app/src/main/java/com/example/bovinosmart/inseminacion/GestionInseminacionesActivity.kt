package com.example.bovinosmart.inseminacion

import android.os.Bundle
import android.view.LayoutInflater
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class GestionInseminacionesActivity : AppCompatActivity() {

    private lateinit var inseminacionAdapter: InseminacionAdapter
    private val inseminacionList = mutableListOf<Inseminacion>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_gestion_inseminacion)

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewInseminacion)
        recyclerView.layoutManager = LinearLayoutManager(this)

        inseminacionAdapter = InseminacionAdapter(
            this,
            inseminacionList,
            onEdit = { inseminacion -> showInseminacionDialog(inseminacion) },
            onDelete = { inseminacion -> deleteInseminacion(inseminacion) }
        )
        recyclerView.adapter = inseminacionAdapter

        inseminacionAdapter.loadAllInseminaciones()

        val addButton: Button = findViewById(R.id.addButtonInseminacion)
        addButton.setOnClickListener {
            showInseminacionDialog()
        }
    }

    private fun showInseminacionDialog(inseminacion: Inseminacion? = null) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_inseminacion, null)
        val builder = AlertDialog.Builder(this)
            .setView(dialogView)
            .setTitle(if (inseminacion == null) "Agregar Inseminación" else "Editar Inseminación")

        val fechaEditText: EditText = dialogView.findViewById(R.id.editTextFechaInseminacion)
        val tipoEditText: EditText = dialogView.findViewById(R.id.editTextTipoInseminacion)
        val resultadoEditText: EditText = dialogView.findViewById(R.id.editTextResultadoInseminacion)
        val observacionesEditText: EditText = dialogView.findViewById(R.id.editTextObservacionesInseminacion)
        val spinnerAnimal: Spinner = dialogView.findViewById(R.id.spinnerAnimal)

        val vacasList = inseminacionAdapter.loadAllVacas()
        val animalAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, vacasList.map { it.nombre })
        spinnerAnimal.adapter = animalAdapter

        inseminacion?.let {
            fechaEditText.setText(it.fechaInseminacion)
            tipoEditText.setText(it.tipoInseminacion)
            resultadoEditText.setText(it.resultado)
            observacionesEditText.setText(it.observaciones)
            spinnerAnimal.setSelection(vacasList.indexOfFirst { vaca -> vaca.idAnimal == it.idAnimal })
        }

        builder.setPositiveButton("Guardar") { _, _ ->
            val fecha = fechaEditText.text.toString()
            val tipo = tipoEditText.text.toString()
            val resultado = resultadoEditText.text.toString()
            val observaciones = observacionesEditText.text.toString()
            val idAnimal = vacasList[spinnerAnimal.selectedItemPosition].idAnimal

            if (inseminacion == null) {
                val newInseminacion = Inseminacion(0, idAnimal, fecha, tipo, resultado, observaciones)
                inseminacionAdapter.insertInseminacion(newInseminacion)
            } else {
                val updatedInseminacion = Inseminacion(inseminacion.idInseminacion, idAnimal, fecha, tipo, resultado, observaciones)
                inseminacionAdapter.updateInseminacion(updatedInseminacion)
            }
        }
        builder.setNegativeButton("Cancelar", null)
        builder.create().show()
    }

    private fun deleteInseminacion(inseminacion: Inseminacion) {
        inseminacionAdapter.deleteInseminacion(inseminacion)
    }
}
