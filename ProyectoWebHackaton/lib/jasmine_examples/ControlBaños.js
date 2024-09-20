const { ValidadorControlBaños } = require('../../spec/helpers/jasmine_examples/ValidadorControlBaños'); // Asegúrate de que la ruta sea correcta

class ControlBaños {
  constructor() {
    this.registrosBaños = [];
  }

  registrarBaño(animalId, producto, fecha) {
    // Validar los datos utilizando el helper
    ValidadorControlBaños.validarDatosRegistroBaño(animalId, producto, fecha);

    // Agregar el registro del baño
    const baño = {
      animalId,
      producto,
      fecha: fecha || new Date(),
    };

    this.registrosBaños.push(baño);
    return true;
  }

  obtenerBaños(animalId) {
    // Devolver los baños del animal con el ID proporcionado
    return this.registrosBaños.filter((baño) => baño.animalId === animalId);
  }
}

module.exports = { ControlBaños };
