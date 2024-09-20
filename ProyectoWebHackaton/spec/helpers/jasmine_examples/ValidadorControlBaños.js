class ValidadorControlBaños {
    static validarDatosRegistroBaño(animalId, producto, fecha) {
      // Validar que el ID del animal no sea nulo
      if (!animalId) {
        throw new Error("El ID del animal es requerido.");
      }
  
      // Validar que el producto no sea una cadena vacía
      if (!producto || producto === "") {
        throw new Error("El producto utilizado es requerido.");
      }
  
      // Validar que la fecha sea válida (opcional)
      if (fecha && !(fecha instanceof Date)) {
        throw new Error("La fecha proporcionada no es válida.");
      }
    }
  }
  
  module.exports = { ValidadorControlBaños };
  