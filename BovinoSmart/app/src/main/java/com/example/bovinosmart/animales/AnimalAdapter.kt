package com.example.bovinosmart.animales

import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class AnimalAdapter(
    private var animales: List<Animal>, // Lista de animales
    private val onEdit: (Animal) -> Unit, // Función para manejar la edición
    private val onDelete: (Animal) -> Unit // Función para manejar la eliminación
) : RecyclerView.Adapter<AnimalAdapter.AnimalViewHolder>() {

    // ViewHolder para la vista de cada animal
    inner class AnimalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.textViewNombreAnimal)
        val imagenImageView: ImageView = itemView.findViewById(R.id.imageViewAnimalItem)

        // Función para enlazar el animal con los componentes de la vista
        fun bind(animal: Animal) {
            nombreTextView.text = animal.nombre

            // Verifica si la imagen está disponible en Base64
            if (animal.imagen.isNotEmpty()) {
                // Decodifica la imagen Base64 y la establece en el ImageView
                val imageBytes = Base64.decode(animal.imagen, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                imagenImageView.setImageBitmap(bitmap)
            } else {
                // Si no hay imagen, muestra un fondo gris o una imagen por defecto
                imagenImageView.setImageResource(R.drawable.ic_upload)
            }

            // Clic en el nombre o en la imagen para editar
            nombreTextView.setOnClickListener {
                onEdit(animal) // Ejecuta la función de edición
            }

            imagenImageView.setOnClickListener {
                onEdit(animal) // Ejecuta la función de edición
            }

            // Clic largo en el nombre o en la imagen para eliminar
            nombreTextView.setOnLongClickListener {
                onDelete(animal) // Ejecuta la función de eliminación
                true
            }

            imagenImageView.setOnLongClickListener {
                onDelete(animal) // Ejecuta la función de eliminación
                true
            }

            // Clic en todo el itemView para editar
            itemView.setOnClickListener {
                onEdit(animal) // Ejecuta la función de edición
            }

            // Clic largo en todo el itemView para eliminar
            itemView.setOnLongClickListener {
                onDelete(animal) // Ejecuta la función de eliminación
                true
            }
        }
    }

    // Inflar la vista de cada elemento del RecyclerView
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AnimalViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_animal, parent, false)
        return AnimalViewHolder(view)
    }

    // Vincular los datos del animal con cada ViewHolder
    override fun onBindViewHolder(holder: AnimalViewHolder, position: Int) {
        holder.bind(animales[position])
    }

    // Retornar el número total de elementos
    override fun getItemCount() = animales.size

    // Función para actualizar la lista de animales y notificar los cambios
    fun updateList(newAnimales: List<Animal>) {
        animales = newAnimales
        notifyDataSetChanged()
    }
}
