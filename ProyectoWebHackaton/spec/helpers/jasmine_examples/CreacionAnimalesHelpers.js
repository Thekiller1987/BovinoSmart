class ValidadorAnimal {
    static validarDatosAnimal(nombre, peso, raza) {
      ValidadorDatos.validarNoVacio(nombre, "nombre");
      ValidadorDatos.validarNoVacio(raza, "raza");
      ValidadorNumerico.validarNumeroPositivo(peso, "peso");
    }
  }
  