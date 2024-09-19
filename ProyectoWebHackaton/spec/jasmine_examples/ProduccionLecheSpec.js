const { ProduccionLeche } = require('../../lib/jasmine_examples/ProduccionLeche');
const { ValidadorProduccionLeche } = require('../../spec/helpers/jasmine_examples/ValidadorProduccionLeche');

describe("Producción de Leche", function() {
  let produccionLeche;

  beforeEach(function() {
    produccionLeche = new ProduccionLeche(); // Instanciar la clase ProduccionLeche antes de cada prueba
  });

  it("debería registrar una producción de leche con datos válidos", function() {
    const resultado = produccionLeche.registrarProduccion(1, 20, new Date());
    
    expect(resultado).toBe(true); // Verificar que el resultado sea verdadero
    expect(produccionLeche.obtenerProduccion(1).length).toBe(1); // Verificar que hay un registro de producción de leche
    expect(produccionLeche.obtenerProduccion(1)[0].cantidadLeche).toBe(20);
  });

  it("debería lanzar un error si no se proporciona un ID de animal", function() {
    expect(function() {
      produccionLeche.registrarProduccion(null, 20, new Date());
    }).toThrowError("El ID del animal es requerido.");
  });

  it("debería lanzar un error si la cantidad de leche no es válida", function() {
    expect(function() {
      produccionLeche.registrarProduccion(1, -5, new Date());
    }).toThrowError("La cantidad de leche debe ser un número positivo.");
  });

  it("debería lanzar un error si la fecha no es válida", function() {
    expect(function() {
      produccionLeche.registrarProduccion(1, 20, "fecha inválida");
    }).toThrowError("La fecha proporcionada no es válida.");
  });

  it("debería devolver una lista vacía si no hay producciones registradas para un animal", function() {
    expect(produccionLeche.obtenerProduccion(999).length).toBe(0); // Verificar que no hay producciones registradas para el ID del animal 999
  });

  it("debería devolver todas las producciones de leche registradas para un animal", function() {
    const fecha1 = new Date();
    const fecha2 = new Date();
    
    produccionLeche.registrarProduccion(1, 15, fecha1);
    produccionLeche.registrarProduccion(1, 30, fecha2);

    const producciones = produccionLeche.obtenerProduccion(1);
    expect(producciones.length).toBe(2); // Verificar que hay dos producciones registradas
    expect(producciones[0].cantidadLeche).toBe(15);
    expect(producciones[1].cantidadLeche).toBe(30);
  });
});
