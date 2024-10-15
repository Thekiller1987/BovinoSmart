package com.example.bovinosmart

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.bovinosmart.database.BoVinoSmartDBHelper

class LoginActivity : AppCompatActivity() {

    private var isRegister = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Inicializar la base de datos
        val dbHelper = BoVinoSmartDBHelper(this)
        val db = dbHelper.writableDatabase // Obtener la referencia de la base de datos

        // Referencias a los elementos de la UI
        val emailInput = findViewById<EditText>(R.id.emailInput)
        val passwordInput = findViewById<EditText>(R.id.passwordInput)
        val confirmPasswordInput = findViewById<EditText>(R.id.confirmPasswordInput)
        val loginOrRegisterButton = findViewById<Button>(R.id.loginOrRegisterButton)
        val toggleText = findViewById<TextView>(R.id.toggleText)

        // Botón de inicio de sesión o registro
        loginOrRegisterButton.setOnClickListener {
            if (isRegister) {
                // Lógica para crear una cuenta
                println("Creando cuenta...")

                // Aquí podrías insertar un usuario nuevo en la base de datos
                // val values = ContentValues().apply {
                //     put("nombre_usuario", emailInput.text.toString())
                //     put("contrasena", passwordInput.text.toString())
                // }
                // db.insert("Usuarios", null, values)
            } else {
                // Lógica para iniciar sesión
                println("Iniciando sesión...")

                // Ir a la pantalla de inicio (HomeScreenActivity)
                val intent = Intent(this, menu::class.java)
                startActivity(intent)
            }
        }

        // Cambiar entre iniciar sesión y registro
        toggleText.setOnClickListener {
            isRegister = !isRegister
            if (isRegister) {
                confirmPasswordInput.visibility = View.VISIBLE
                loginOrRegisterButton.text = "Crear Cuenta"
                toggleText.text = "¿Ya tienes cuenta? Iniciar Sesión"
            } else {
                confirmPasswordInput.visibility = View.GONE
                loginOrRegisterButton.text = "Iniciar Sesión"
                toggleText.text = "¿No tienes cuenta? Crear cuenta"
            }
        }
    }
}
