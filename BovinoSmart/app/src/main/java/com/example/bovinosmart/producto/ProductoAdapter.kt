package com.example.bovinosmart.producto

import android.graphics.BitmapFactory
import android.util.Base64
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.bovinosmart.R

class ProductoAdapter(
    private var productos: List<Producto>,
    private val onItemClick: (Producto) -> Unit
) : RecyclerView.Adapter<ProductoAdapter.ProductoViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_producto, parent, false)
        return ProductoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductoViewHolder, position: Int) {
        val producto = productos[position]
        holder.bind(producto)
        holder.itemView.setOnClickListener { onItemClick(producto) }
    }

    override fun getItemCount(): Int = productos.size

    fun updateList(newList: List<Producto>) {
        productos = newList
        notifyDataSetChanged()
    }

    class ProductoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nombreTextView: TextView = itemView.findViewById(R.id.textViewNombreProducto)
        private val tipoTextView: TextView = itemView.findViewById(R.id.textViewTipoProducto)
        private val imagenView: ImageView = itemView.findViewById(R.id.imageViewProductoItem)

        fun bind(producto: Producto) {
            nombreTextView.text = producto.nombre
            tipoTextView.text = producto.tipo

            if (producto.imagenBase64.isNotEmpty()) {
                val byteArray = Base64.decode(producto.imagenBase64, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray.size)
                imagenView.setImageBitmap(bitmap)
            } else {
                imagenView.setImageResource(android.R.color.darker_gray) // Placeholder
            }
        }
    }
}
