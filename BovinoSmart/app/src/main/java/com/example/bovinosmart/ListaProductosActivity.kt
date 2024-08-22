package com.example.bovinosmart

import CrearProductoActivity
import ProductoRepository
import ProductosAdapter
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ListView
import androidx.appcompat.app.AppCompatActivity

class ListaProductosActivity : AppCompatActivity() {
    private lateinit var productoRepo: ProductoRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_productos)

        productoRepo = ProductoRepository(this)

        val botonAgregar = findViewById<Button>(R.id.btn_add_producto)
        val listaProductos = findViewById<ListView>(R.id.lv_productos)

        botonAgregar.setOnClickListener {
            val intent = Intent(this, CrearProductoActivity::class.java)
            startActivity(intent)
        }

        // Cargar y mostrar la lista de productos
        val productos = productoRepo.getAll()
        val adapter = ProductosAdapter(this, productos)
        listaProductos.adapter = adapter
    }
}
