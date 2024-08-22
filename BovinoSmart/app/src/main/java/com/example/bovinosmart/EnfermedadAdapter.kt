package com.example.bovinosmart

import Enfermedad
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView


class EnfermedadAdapter(
    private val enfermedades: List<Enfermedad>,
    private val onClick: (Enfermedad) -> Unit
) : RecyclerView.Adapter<EnfermedadAdapter.EnfermedadViewHolder>() {

    inner class EnfermedadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nombreTextView: TextView = itemView.findViewById(R.id.textview_nombre_enfermedad)
        private val descripcionTextView: TextView = itemView.findViewById(R.id.textview_descripcion_enfermedad)

        fun bind(enfermedad: Enfermedad) {
            nombreTextView.text = enfermedad.nombre
            descripcionTextView.text = enfermedad.descripcion
            itemView.setOnClickListener { onClick(enfermedad) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EnfermedadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_enfermedad, parent, false)
        return EnfermedadViewHolder(view)
    }

    override fun onBindViewHolder(holder: EnfermedadViewHolder, position: Int) {
        holder.bind(enfermedades[position])
    }

    override fun getItemCount(): Int = enfermedades.size
}
