const { ValidadorProduccionLeche } = require('../../spec/helpers/jasmine_examples/ValidadorProduccionLeche'); // Importar el helper

class ProduccionLeche {
  constructor() {
    this.registrosProduccion = [];
  }

  registrarProduccion(animalId, cantidadLeche, fecha) {
    // Validar los datos utilizando el helper
    ValidadorProduccionLeche.validarDatosProduccion(animalId, cantidadLeche, fecha);

    // Agregar el registro de la producción de leche
    const registro = {
      animalId,
      cantidadLeche,
      fecha: fecha || new Date(),
    };

    this.registrosProduccion.push(registro);
    return true;
  }

  obtenerProduccion(animalId) {
    // Devolver las producciones de leche del animal con el ID proporcionado
    return this.registrosProduccion.filter((registro) => registro.animalId === animalId);
  }
}

module.exports = { ProduccionLeche };
