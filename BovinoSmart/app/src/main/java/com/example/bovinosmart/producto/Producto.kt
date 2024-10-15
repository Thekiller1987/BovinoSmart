package com.example.bovinosmart.producto

data class Producto(
        val id: Int,
        val nombre: String,
        val tipo: String,
        val dosisRecomendada: String,
        val frecuenciaAplicacion: String,
        val notas: String?,
        val esTratamiento: Boolean,
        val motivo: String?,
        val imagenBase64: String
)
