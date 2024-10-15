package com.example.bovinosmart.Enfermedades


import android.graphics.BitmapFactory
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R
import android.util.Base64

class EnfermedadAdapter(
    private val enfermedades: List<Enfermedad>,
    private val onClick: (Enfermedad) -> Unit
) : RecyclerView.Adapter<EnfermedadAdapter.EnfermedadViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EnfermedadViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_enfermedad, parent, false)
        return EnfermedadViewHolder(view)
    }

    override fun onBindViewHolder(holder: EnfermedadViewHolder, position: Int) {
        val enfermedad = enfermedades[position]
        holder.bind(enfermedad, onClick)
    }

    override fun getItemCount(): Int = enfermedades.size

    class EnfermedadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nombreEnfermedad = itemView.findViewById<TextView>(R.id.nombreEnfermedad)
        private val imagenEnfermedad = itemView.findViewById<ImageView>(R.id.imagenEnfermedad)

        fun bind(enfermedad: Enfermedad, onClick: (Enfermedad) -> Unit) {
            nombreEnfermedad.text = enfermedad.nombre

            if (enfermedad.imagenBase64.isNotEmpty()) {
                val decodedImage = Base64.decode(enfermedad.imagenBase64, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(decodedImage, 0, decodedImage.size)
                imagenEnfermedad.setImageBitmap(bitmap)
            }

            // Evento de clic para editar
            itemView.setOnClickListener {
                onClick(enfermedad)
            }
        }
    }
}
