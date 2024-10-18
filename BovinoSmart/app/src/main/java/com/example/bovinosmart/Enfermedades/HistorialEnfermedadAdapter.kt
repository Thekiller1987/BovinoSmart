// HistorialEnfermedadAdapter.kt
package com.example.bovinosmart.Enfermedades

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class HistorialEnfermedadAdapter(
    private val historialList: List<HistorialEnfermedad>
) : RecyclerView.Adapter<HistorialEnfermedadAdapter.HistorialViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistorialViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_historial_enfermedad, parent, false)
        return HistorialViewHolder(view)
    }

    override fun onBindViewHolder(holder: HistorialViewHolder, position: Int) {
        val historial = historialList[position]
        holder.bind(historial)
    }

    override fun getItemCount(): Int = historialList.size

    class HistorialViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textViewAnimal = itemView.findViewById<TextView>(R.id.textViewAnimal)
        private val textViewEnfermedad = itemView.findViewById<TextView>(R.id.textViewEnfermedad)
        private val textViewFecha = itemView.findViewById<TextView>(R.id.textViewFecha)

        fun bind(historial: HistorialEnfermedad) {
            textViewAnimal.text = "ID Animal: ${historial.idAnimal}"
            textViewEnfermedad.text = "ID Enfermedad: ${historial.idEnfermedad}"
            textViewFecha.text = "Fecha: ${historial.fecha}"
        }
    }
}
