package com.example.bovinosmart

import android.os.Bundle
import android.widget.Button
import android.widget.ListView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class BanosActivity : AppCompatActivity() {

    private lateinit var btnAddBath: Button
    private lateinit var lvBaths: ListView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_banos)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Inicializar las vistas
        btnAddBath = findViewById(R.id.btn_add_bath)
        lvBaths = findViewById(R.id.lv_baths)

        btnAddBath.setOnClickListener {
            // Implementa la lógica para añadir un nuevo baño
        }

        // Implementa la lógica para mostrar los baños en la ListView
    }
}
