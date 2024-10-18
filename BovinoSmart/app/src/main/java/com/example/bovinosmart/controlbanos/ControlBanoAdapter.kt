// ControlBanoAdapter.kt
package com.example.bovinosmart.Banos

import ControlBano
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import com.example.bovinosmart.animales.Animal

class ControlBanoAdapter(
    private val controlBanosList: List<ControlBano>,
    private val animalesList: List<Animal>,
    private val onEdit: (ControlBano) -> Unit,
    private val onDelete: (ControlBano) -> Unit
) : RecyclerView.Adapter<ControlBanoAdapter.ControlBanoViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ControlBanoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_control_bano, parent, false)
        return ControlBanoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ControlBanoViewHolder, position: Int) {
        val controlBano = controlBanosList[position]
        holder.bind(controlBano, animalesList)
        holder.itemView.findViewById<View>(R.id.editButton).setOnClickListener { onEdit(controlBano) }
        holder.itemView.findViewById<View>(R.id.deleteButton).setOnClickListener { onDelete(controlBano) }
    }

    override fun getItemCount(): Int = controlBanosList.size

    class ControlBanoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textViewAnimal: TextView = itemView.findViewById(R.id.textViewAnimal)
        private val textViewFecha: TextView = itemView.findViewById(R.id.textViewFecha)
        private val textViewProductos: TextView = itemView.findViewById(R.id.textViewProductos)

        fun bind(controlBano: ControlBano, animalesList: List<Animal>) {
            val animal = animalesList.find { it.idAnimal == controlBano.idAnimal }
            textViewAnimal.text = animal?.nombre ?: "Animal no encontrado"
            textViewFecha.text = "Fecha: ${controlBano.fecha}"
            textViewProductos.text = "Productos: ${controlBano.productosUtilizados}"
        }
    }
}
