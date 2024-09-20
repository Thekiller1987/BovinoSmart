class Enfermedad {
  constructor(nombre, descripcion) {
    // Validar que el nombre y la descripción no estén vacíos
    if (!nombre || !descripcion) {
      throw new Error("Datos de enfermedad inválidos");
    }
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaRegistro = new Date();
  }
}

module.exports = { Enfermedad };
