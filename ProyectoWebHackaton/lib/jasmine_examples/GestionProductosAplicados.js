const { ValidadorProductosAplicados } = require('../../spec/helpers/jasmine_examples/ValidadorProductosAplicados'); // Importar el helper

class GestionProductosAplicados {
  constructor() {
    this.registrosProductos = [];
  }

  registrarProducto(animalId, nombreProducto, fechaAplicacion) {
    // Validar los datos utilizando el helper
    ValidadorProductosAplicados.validarDatosProducto(animalId, nombreProducto, fechaAplicacion);

    // Agregar el registro del producto aplicado
    const producto = {
      animalId,
      nombreProducto,
      fechaAplicacion: fechaAplicacion || new Date(),
    };

    this.registrosProductos.push(producto);
    return true;
  }

  obtenerProductosAplicados(animalId) {
    // Devolver los productos aplicados del animal con el ID proporcionado
    return this.registrosProductos.filter((registro) => registro.animalId === animalId);
  }
}

module.exports = { GestionProductosAplicados };
