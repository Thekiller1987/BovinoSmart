class ValidadorGestionEnfermedades {
    static validarDatosRegistroEnfermedad(animalId, enfermedad) {
      // Validar que el ID del animal no sea nulo
      if (!animalId) {
        throw new Error("El ID del animal es requerido.");
      }
  
      // Validar que la enfermedad sea una instancia de la clase Enfermedad
      if (!(enfermedad instanceof Enfermedad)) {
        throw new Error("La enfermedad debe ser una instancia válida de Enfermedad.");
      }
    }
  }
  
  module.exports = { ValidadorGestionEnfermedades };
  