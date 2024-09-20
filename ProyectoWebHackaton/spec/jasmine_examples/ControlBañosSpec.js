const { ControlBaños } = require('../../lib/jasmine_examples/ControlBaños');
const { ValidadorControlBaños } = require('../helpers/jasmine_examples/ValidadorControlBaños');

describe("Control de Baños", function() {
  let controlBaños;

  beforeEach(function() {
    controlBaños = new ControlBaños(); // Instanciar la clase ControlBaños antes de cada prueba
  });

  it("debería registrar un baño con datos válidos", function() {
    const resultado = controlBaños.registrarBaño(1, "Producto A", new Date());
    
    expect(resultado).toBe(true); // Verificar que el resultado sea verdadero
    expect(controlBaños.obtenerBaños(1).length).toBe(1); // Verificar que hay un baño registrado
    expect(controlBaños.obtenerBaños(1)[0].producto).toBe("Producto A");
  });

  it("debería lanzar un error si no se proporciona un ID de animal", function() {
    expect(function() {
      controlBaños.registrarBaño(null, "Producto A", new Date());
    }).toThrowError("El ID del animal es requerido.");
  });

  it("debería lanzar un error si no se proporciona un producto", function() {
    expect(function() {
      controlBaños.registrarBaño(1, "", new Date());
    }).toThrowError("El producto utilizado es requerido.");
  });

  it("debería lanzar un error si la fecha no es válida", function() {
    expect(function() {
      controlBaños.registrarBaño(1, "Producto A", "fecha inválida");
    }).toThrowError("La fecha proporcionada no es válida.");
  });

  it("debería devolver una lista vacía si no hay baños registrados para un animal", function() {
    expect(controlBaños.obtenerBaños(999).length).toBe(0); // Verificar que no hay baños registrados para el ID del animal 999
  });

  it("debería devolver todos los baños registrados para un animal", function() {
    const fecha1 = new Date();
    const fecha2 = new Date();
    
    controlBaños.registrarBaño(1, "Producto A", fecha1);
    controlBaños.registrarBaño(1, "Producto B", fecha2);

    const baños = controlBaños.obtenerBaños(1);
    expect(baños.length).toBe(2); // Verificar que hay dos baños registrados
    expect(baños[0].producto).toBe("Producto A");
    expect(baños[1].producto).toBe("Producto B");
  });
});
