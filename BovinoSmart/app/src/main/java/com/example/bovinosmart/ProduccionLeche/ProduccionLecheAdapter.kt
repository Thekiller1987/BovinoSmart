package com.example.bovinosmart.ProduccionLeche

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.produccion.ProduccionLeche

class ProduccionLecheAdapter(
    private val produccionLecheList: List<ProduccionLeche>,
    private val onEdit: (ProduccionLeche) -> Unit,
    private val onDelete: (ProduccionLeche) -> Unit
) : RecyclerView.Adapter<ProduccionLecheAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_produccion_leche, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val produccionLeche = produccionLecheList[position]
        holder.bind(produccionLeche, onEdit, onDelete)
    }

    override fun getItemCount(): Int = produccionLecheList.size

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val fechaTextView: TextView = itemView.findViewById(R.id.fechaTextView)
        private val cantidadTextView: TextView = itemView.findViewById(R.id.cantidadTextView)
        private val calidadTextView: TextView = itemView.findViewById(R.id.calidadTextView)

        fun bind(produccionLeche: ProduccionLeche, onEdit: (ProduccionLeche) -> Unit, onDelete: (ProduccionLeche) -> Unit) {
            fechaTextView.text = "Fecha: ${produccionLeche.fecha}"
            cantidadTextView.text = "Cantidad: ${produccionLeche.cantidad}"
            calidadTextView.text = "Calidad: ${produccionLeche.calidad}"

            itemView.setOnClickListener { onEdit(produccionLeche) }
            itemView.setOnLongClickListener {
                onDelete(produccionLeche)
                true
            }
        }
    }
}
