package com.example.bovinosmart.animal

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
    private var animales: List<Animal>,
    private val onEdit: (Animal) -> Unit,
    private val onDelete: (Animal) -> Unit
) : RecyclerView.Adapter<AnimalAdapter.AnimalViewHolder>() {

    inner class AnimalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textNombre: TextView = itemView.findViewById(R.id.animal_name)
        val textRaza: TextView = itemView.findViewById(R.id.animal_raza)
        val imageAnimal: ImageView = itemView.findViewById(R.id.animal_image)

        fun bind(animal: Animal) {
            textNombre.text = animal.nombre
            textRaza.text = "Raza: ${animal.raza}"

            // Decodificar la imagen desde Base64
            if (animal.imagen.isNotEmpty()) {
                val decodedBytes = Base64.decode(animal.imagen, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
                imageAnimal.setImageBitmap(bitmap)
            } else {
                // Imagen por defecto si no hay imagen
                imageAnimal.setImageResource(R.drawable.ic_upload) // Cambia por tu imagen predeterminada
            }

            // Implementar clics para editar y eliminar
            itemView.setOnClickListener { onEdit(animal) }
            itemView.setOnLongClickListener {
                onDelete(animal)
                true
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AnimalViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_animal, parent, false)
        return AnimalViewHolder(view)
    }

    override fun onBindViewHolder(holder: AnimalViewHolder, position: Int) {
        holder.bind(animales[position])
    }

    override fun getItemCount() = animales.size

    fun updateList(newAnimales: List<Animal>) {
        animales = newAnimales
        notifyDataSetChanged()
    }
}
