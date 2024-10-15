package com.example.bovinosmart.animales

data class Animal(
    val idAnimal: Int = 0,
    val nombre: String,
    val sexo: String,
    val imagen: String, // Base64 de la imagen
    val codigoIdVaca: String,
    val fechaNacimiento: String,
    val raza: String,
    val observaciones: String,
    val pesoNacimiento: Double,
    val pesoDestete: Double,
    val pesoActual: Double,
    val estado: String,
    val inseminacion: Boolean
)
