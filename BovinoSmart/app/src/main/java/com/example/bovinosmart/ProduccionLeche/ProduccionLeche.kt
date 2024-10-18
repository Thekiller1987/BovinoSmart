// ProduccionLeche.kt
package com.example.bovinosmart.produccion

data class ProduccionLeche(
    val id: Int,
    val idAnimal: Int,
    val fecha: String,
    val cantidad: Double,
    val calidad: Int
)
