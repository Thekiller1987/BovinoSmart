// InseminacionAdapter.kt
package com.example.bovinosmart.inseminacion

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.database.BoVinoSmartDBHelper
import com.example.bovinosmart.animales.Animal

class InseminacionAdapter(
    private val context: Context,
    private val inseminacionList: MutableList<Inseminacion>,
    private val onEdit: (Inseminacion) -> Unit,
    private val onDelete: (Inseminacion) -> Unit
) : RecyclerView.Adapter<InseminacionAdapter.InseminacionViewHolder>() {

    private val dbHelper = BoVinoSmartDBHelper(context)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InseminacionViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_inseminacion, parent, false)
        return InseminacionViewHolder(view)
    }

    override fun onBindViewHolder(holder: InseminacionViewHolder, position: Int) {
        val inseminacion = inseminacionList[position]
        holder.bind(inseminacion)

        holder.itemView.setOnClickListener {
            onEdit(inseminacion)
        }

        holder.itemView.setOnLongClickListener {
            AlertDialog.Builder(context)
                .setTitle("Eliminar Inseminación")
                .setMessage("¿Deseas eliminar esta inseminación?")
                .setPositiveButton("Sí") { _, _ -> onDelete(inseminacion) }
                .setNegativeButton("No", null)
                .show()
            true
        }
    }

    override fun getItemCount(): Int {
        return inseminacionList.size
    }

    fun loadAllInseminaciones() {
        inseminacionList.clear()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Inseminaciones", null)

        while (cursor.moveToNext()) {
            val inseminacion = Inseminacion(
                idInseminacion = cursor.getInt(cursor.getColumnIndexOrThrow("idInseminacion")),
                idAnimal = cursor.getInt(cursor.getColumnIndexOrThrow("idAnimal")),
                fechaInseminacion = cursor.getString(cursor.getColumnIndexOrThrow("fecha_inseminacion")),
                tipoInseminacion = cursor.getString(cursor.getColumnIndexOrThrow("tipo_inseminacion")),
                resultado = cursor.getString(cursor.getColumnIndexOrThrow("resultado")),
                observaciones = cursor.getString(cursor.getColumnIndexOrThrow("observaciones"))
            )
            inseminacionList.add(inseminacion)
        }
        cursor.close()
        notifyDataSetChanged()
    }

    fun loadAllVacas(): List<Animal> {
        val vacasList = mutableListOf<Animal>()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM Animales WHERE sexo = 'vaca'", null)

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
            vacasList.add(animal)
        }
        cursor.close()
        return vacasList
    }

    fun insertInseminacion(inseminacion: Inseminacion) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("idAnimal", inseminacion.idAnimal)
            put("fecha_inseminacion", inseminacion.fechaInseminacion)
            put("tipo_inseminacion", inseminacion.tipoInseminacion)
            put("resultado", inseminacion.resultado)
            put("observaciones", inseminacion.observaciones)
        }
        db.insert("Inseminaciones", null, values)
        loadAllInseminaciones()
    }

    fun updateInseminacion(inseminacion: Inseminacion) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("idAnimal", inseminacion.idAnimal)
            put("fecha_inseminacion", inseminacion.fechaInseminacion)
            put("tipo_inseminacion", inseminacion.tipoInseminacion)
            put("resultado", inseminacion.resultado)
            put("observaciones", inseminacion.observaciones)
        }
        db.update("Inseminaciones", values, "idInseminacion = ?", arrayOf(inseminacion.idInseminacion.toString()))
        loadAllInseminaciones()
    }

    fun deleteInseminacion(inseminacion: Inseminacion) {
        val db = dbHelper.writableDatabase
        db.delete("Inseminaciones", "idInseminacion = ?", arrayOf(inseminacion.idInseminacion.toString()))
        loadAllInseminaciones()
    }

    class InseminacionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textViewFecha: TextView = itemView.findViewById(R.id.textViewFecha)
        private val textViewTipo: TextView = itemView.findViewById(R.id.textViewTipo)
        private val textViewResultado: TextView = itemView.findViewById(R.id.textViewResultado)

        fun bind(inseminacion: Inseminacion) {
            textViewFecha.text = "Fecha: ${inseminacion.fechaInseminacion}"
            textViewTipo.text = "Tipo: ${inseminacion.tipoInseminacion}"
            textViewResultado.text = "Resultado: ${inseminacion.resultado}"
        }
    }
}
