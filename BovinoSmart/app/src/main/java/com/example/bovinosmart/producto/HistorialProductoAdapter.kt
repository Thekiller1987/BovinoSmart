// HistorialProductoAdapter.kt
package com.example.bovinosmart.Productos

import HistorialProducto
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class HistorialProductoAdapter(
    private val historialProductosList: List<HistorialProducto>
) : RecyclerView.Adapter<HistorialProductoAdapter.HistorialProductoViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HistorialProductoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_historial_producto, parent, false)
        return HistorialProductoViewHolder(view)
    }

    override fun onBindViewHolder(holder: HistorialProductoViewHolder, position: Int) {
        val historialProducto = historialProductosList[position]
        holder.bind(historialProducto)
    }

    override fun getItemCount(): Int {
        return historialProductosList.size
    }

    class HistorialProductoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textViewAnimal: TextView = itemView.findViewById(R.id.textViewAnimal)
        private val textViewProducto: TextView = itemView.findViewById(R.id.textViewProducto)
        private val textViewDosis: TextView = itemView.findViewById(R.id.textViewDosis)
        private val textViewFecha: TextView = itemView.findViewById(R.id.textViewFecha)
        private val textViewTratamiento: TextView = itemView.findViewById(R.id.textViewTratamiento)

        fun bind(historialProducto: HistorialProducto) {
            textViewAnimal.text = "ID Animal: ${historialProducto.idAnimal}"
            textViewProducto.text = "ID Producto: ${historialProducto.idProducto}"
            textViewDosis.text = "Dosis: ${historialProducto.dosis}"
            textViewFecha.text = "Fecha: ${historialProducto.fecha}"
            textViewTratamiento.text = if (historialProducto.esTratamiento) "Es tratamiento" else "No es tratamiento"
        }
    }
}
