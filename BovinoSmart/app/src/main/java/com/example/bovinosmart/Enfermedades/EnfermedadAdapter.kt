package com.example.bovinosmart.Enfermedades

import Enfermedad
import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class EnfermedadAdapter(
    private var enfermedades: List<Enfermedad>, // Lista de enfermedades
    private val onEdit: (Enfermedad) -> Unit, // Función para manejar la edición
    private val onDelete: (Enfermedad) -> Unit // Función para manejar la eliminación
) : RecyclerView.Adapter<EnfermedadAdapter.EnfermedadViewHolder>() {

    // ViewHolder para la vista de cada enfermedad
    inner class EnfermedadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreEnfermedad)
        val imagenImageView: ImageView = itemView.findViewById(R.id.imagenEnfermedad)

        // Función para enlazar la enfermedad con los componentes de la vista
        fun bind(enfermedad: Enfermedad) {
            nombreTextView.text = enfermedad.nombre

            // Verifica si la imagen está disponible en Base64
            if (enfermedad.imagenBase64.isNotEmpty()) {
                // Decodifica la imagen Base64 y la establece en el ImageView
                val imageBytes = Base64.decode(enfermedad.imagenBase64, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                imagenImageView.setImageBitmap(bitmap)
            } else {
                // Si no hay imagen, muestra un fondo gris o una imagen por defecto
                imagenImageView.setImageResource(R.drawable.ic_upload)
            }

            // Clic en el nombre o en la imagen para editar
            nombreTextView.setOnClickListener {
                onEdit(enfermedad) // Ejecuta la función de edición
            }

            imagenImageView.setOnClickListener {
                onEdit(enfermedad) // Ejecuta la función de edición
            }

            // Clic largo en el nombre o en la imagen para eliminar
            nombreTextView.setOnLongClickListener {
                onDelete(enfermedad) // Ejecuta la función de eliminación
                true
            }

            imagenImageView.setOnLongClickListener {
                onDelete(enfermedad) // Ejecuta la función de eliminación
                true
            }

            // Clic en todo el itemView para editar
            itemView.setOnClickListener {
                onEdit(enfermedad) // Ejecuta la función de edición
            }

            // Clic largo en todo el itemView para eliminar
            itemView.setOnLongClickListener {
                onDelete(enfermedad) // Ejecuta la función de eliminación
                true
            }
        }
    }

    // Inflar la vista de cada elemento del RecyclerView
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EnfermedadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_enfermedad, parent, false)
        return EnfermedadViewHolder(view)
    }

    // Vincular los datos de la enfermedad con cada ViewHolder
    override fun onBindViewHolder(holder: EnfermedadViewHolder, position: Int) {
        holder.bind(enfermedades[position])
    }

    // Retornar el número total de elementos
    override fun getItemCount() = enfermedades.size

    // Función para actualizar la lista de enfermedades y notificar los cambios
    fun updateList(newEnfermedades: List<Enfermedad>) {
        enfermedades = newEnfermedades
        notifyDataSetChanged()
    }
}
