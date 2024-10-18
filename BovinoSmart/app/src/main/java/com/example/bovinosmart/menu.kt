package com.example.bovinosmart

import com.example.bovinosmart.animales.GestionAnimalesActivity
import com.example.bovinosmart.producto.GestionProductos
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.bovinosmart.Enfermedades.GestionEnfermedades
import com.example.bovinosmart.controlbanos.GestionControlBanosActivity

class menu : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_menu)

        // Aplicar WindowInsets para ajustar el diseño a los bordes de la pantalla
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            WindowInsetsCompat.CONSUMED // Este retorno es necesario para WindowInsetsCompat
        }

        // Configurar los botones
        val gestionAnimalesButton = findViewById<Button>(R.id.btnGestionAnimales)
        val gestionEnfermedadesButton = findViewById<Button>(R.id.btnGestionEnfermedades)
        val gestionProductosButton = findViewById<Button>(R.id.btnGestionProductos)
        val escanerQRButton = findViewById<Button>(R.id.btnEscanerQR)
        val pruebaFuncionalidadesButton = findViewById<Button>(R.id.btnPruebaFuncionalidades) // Nuevo botón

        // Configurar los clics de los botones para navegar o realizar acciones
        gestionAnimalesButton.setOnClickListener {
            // Acción para gestionar animales
            val intent = Intent(this, GestionAnimalesActivity::class.java)
            startActivity(intent)

        }

        gestionEnfermedadesButton.setOnClickListener {
            // Acción para gestionar enfermedades
            val intent = Intent(this, GestionEnfermedades::class.java)
            startActivity(intent)
        }

        gestionProductosButton.setOnClickListener {
            // Acción para gestionar productos
            val intent = Intent(this, GestionProductos::class.java)
            startActivity(intent)

        }


        // Configurar clic para el nuevo botón
        pruebaFuncionalidadesButton.setOnClickListener {
            // Aquí puedes añadir la acción que quieras realizar para probar nuevas funcionalidades
            val intent = Intent(this,GestionControlBanosActivity::class.java) // Crea esta actividad si es necesario
            startActivity(intent)

        escanerQRButton.setOnClickListener {
            // Acción para escanear QR
            }
        }
    }
}