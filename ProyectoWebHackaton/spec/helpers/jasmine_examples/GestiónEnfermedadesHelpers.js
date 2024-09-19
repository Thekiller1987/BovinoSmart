const { ValidadorGestionEnfermedades } = require('./ValidadorGestionEnfermedades');
const { Enfermedad } = require('../../../lib/jasmine_examples/Enfermedad');  // Ajusta la ruta para subir 3 niveles
// Asegúrate de que la clase Enfermedad esté bien definida

class GestionEnfermedades {
  constructor() {
    this.enfermedades = [];
  }

  registrarEnfermedad(animalId, enfermedad) {
    // Utilizar el helper para validar los datos antes de registrar la enfermedad
    ValidadorGestionEnfermedades.validarDatosRegistroEnfermedad(animalId, enfermedad);

    // Registrar la enfermedad si los datos son válidos
    this.enfermedades.push({
      animalId: animalId,
      enfermedad: enfermedad,
      fechaRegistro: new Date(),
    });

    return true;
  }

  obtenerEnfermedades(animalId) {
    // Filtrar y devolver todas las enfermedades registradas para el animal
    return this.enfermedades.filter((registro) => registro.animalId === animalId);
  }
}

module.exports = { GestionEnfermedades };
