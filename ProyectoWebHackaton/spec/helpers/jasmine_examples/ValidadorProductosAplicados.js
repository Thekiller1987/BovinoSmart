class ValidadorProductosAplicados {
    static validarDatosProducto(animalId, nombreProducto, fechaAplicacion) {
      // Validar que el ID del animal no sea nulo
      if (!animalId) {
        throw new Error("El ID del animal es requerido.");
      }
  
      // Validar que el nombre del producto no sea una cadena vacía
      if (!nombreProducto || nombreProducto === "") {
        throw new Error("El nombre del producto es requerido.");
      }
  
      // Validar que la fecha de aplicación sea válida (opcional)
      if (fechaAplicacion && !(fechaAplicacion instanceof Date)) {
        throw new Error("La fecha proporcionada no es válida.");
      }
    }
  }
  
  module.exports = { ValidadorProductosAplicados };
  