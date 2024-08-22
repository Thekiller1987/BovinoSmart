package com.example.bovinosmart

import CrearAnimalActivity
import EditarAnimalActivity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
class MenuAnimalActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu_animal)

        val btnAgregarAnimal: Button = findViewById(R.id.btnAgregarAnimal)
        val btnEditarAnimal: Button = findViewById(R.id.btnEditarAnimal)

        btnAgregarAnimal.setOnClickListener {
            val intent = Intent(this, CrearAnimalActivity::class.java)
            startActivity(intent)
        }

        btnEditarAnimal.setOnClickListener {
            val intent = Intent(this, EditarAnimalActivity::class.java)
            startActivity(intent)
        }
    }
}