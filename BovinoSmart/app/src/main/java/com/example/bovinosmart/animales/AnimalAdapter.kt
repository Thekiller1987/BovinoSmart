package com.example.bovinosmart.animales

import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class AnimalAdapter(
    private val animales: List<Animal>, // Lista de animales
    private val onEdit: (Animal) -> Unit, // Función para manejar la edición
    private val onDelete: (Animal) -> Unit // Función para manejar la eliminación
) : RecyclerView.Adapter<AnimalAdapter.AnimalViewHolder>() {

    // Clase interna para el ViewHolder
    inner class AnimalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.textViewNombreAnimal)
        val sexoTextView: TextView = itemView.findViewById(R.id.textViewSexoAnimal)
        val imagenImageView: ImageView = itemView.findViewById(R.id.imageViewAnimalItem)
        val editButton: ImageButton = itemView.findViewById(R.id.editButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        // Función para enlazar el animal con los componentes de la vista
        fun bind(animal: Animal) {
            nombreTextView.text = animal.nombre
            sexoTextView.text = animal.sexo
            // Decodificar la imagen Base64 y establecerla en el ImageView
            val imageBytes = Base64.decode(animal.imagen, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            imagenImageView.setImageBitmap(bitmap)

            // Configurar los botones de editar y eliminar
            editButton.setOnClickListener {
                onEdit(animal) // Ejecutar la función de edición cuando se pulsa el botón de editar
            }

            deleteButton.setOnClickListener {
                onDelete(animal) // Ejecutar la función de eliminación cuando se pulsa el botón de eliminar
            }
        }
    }

    // Inflar la vista para cada elemento del RecyclerView
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
}
