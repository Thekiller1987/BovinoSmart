const { Enfermedad } = require('./Enfermedad');

class GestionEnfermedades {
  constructor() {
    this.enfermedades = [];
  }

  registrarEnfermedad(animalId, enfermedad) {
    // Validar que el ID del animal no sea nulo y que la enfermedad sea válida
    if (!animalId) {
      throw new Error("El ID del animal es requerido.");
    }

    if (!(enfermedad instanceof Enfermedad)) {
      throw new Error("La enfermedad debe ser una instancia válida de Enfermedad.");
    }

    this.enfermedades.push({
      animalId: animalId,
      enfermedad: enfermedad,
      fechaRegistro: new Date(),
    });

    return true;
  }

  obtenerEnfermedades(animalId) {
    // Filtrar y devolver todas las enfermedades registradas para un animal
    return this.enfermedades.filter((registro) => registro.animalId === animalId);
  }
}

module.exports = { GestionEnfermedades };
