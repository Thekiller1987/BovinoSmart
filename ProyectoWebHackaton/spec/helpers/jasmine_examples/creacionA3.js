class ValidadorNumerico {
    static validarNumeroPositivo(valor, nombreCampo) {
      if (typeof valor !== "number" || valor <= 0) {
        throw new Error(`El campo ${nombreCampo} debe ser un número positivo.`);
      }
    }
  }
  