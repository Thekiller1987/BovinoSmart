class ValidadorDatos {
    static validarNoVacio(valor, nombreCampo) {
      if (!valor || valor === "") {
        throw new Error(`El campo ${nombreCampo} no puede estar vacío.`);
      }
    }
  }
  