// Define los helpers dentro del mismo archivo o impórtalos desde otro archivo si están en uno separado.
class ValidadorDatos {
    static validarNoVacio(valor, nombreCampo) {
      if (!valor || valor === "") {
        throw new Error(`El campo ${nombreCampo} no puede estar vacío.`);
      }
    }
  }
  
  class ValidadorNumerico {
    static validarNumeroPositivo(valor, nombreCampo) {
      if (typeof valor !== "number" || valor <= 0) {
        throw new Error(`El campo ${nombreCampo} debe ser un número positivo.`);
      }
    }
  }
  
  class Animal {
    constructor(nombre, peso, raza) {
      ValidadorAnimal.validarDatosAnimal(nombre, peso, raza);
      this.nombre = nombre;
      this.peso = peso;
      this.raza = raza;
      this.fechaCreacion = new Date();
    }
  }
  
  class ValidadorAnimal {
    static validarDatosAnimal(nombre, peso, raza) {
      ValidadorDatos.validarNoVacio(nombre, "nombre");
      ValidadorDatos.validarNoVacio(raza, "raza");
      ValidadorNumerico.validarNumeroPositivo(peso, "peso");
    }
  }
  
  module.exports = Animal; // Exportar la clase Animal
  