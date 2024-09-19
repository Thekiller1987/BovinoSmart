class ValidadorProduccionLeche {
    static validarDatosProduccion(animalId, cantidadLeche, fecha) {
      // Validar que el ID del animal no sea nulo
      if (!animalId) {
        throw new Error("El ID del animal es requerido.");
      }
  
      // Validar que la cantidad de leche sea un número positivo
      if (cantidadLeche <= 0 || isNaN(cantidadLeche)) {
        throw new Error("La cantidad de leche debe ser un número positivo.");
      }
  
      // Validar que la fecha sea válida (opcional)
      if (fecha && !(fecha instanceof Date)) {
        throw new Error("La fecha proporcionada no es válida.");
      }
    }
  }
  
  module.exports = { ValidadorProduccionLeche };
  