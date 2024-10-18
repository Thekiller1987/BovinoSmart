package com.example.bovinosmart.inseminacion

data class Inseminacion(
    val idInseminacion: Int,
    val idAnimal: Int,
    val fechaInseminacion: String,
    val tipoInseminacion: String,
    val resultado: String,
    val observaciones: String
)
