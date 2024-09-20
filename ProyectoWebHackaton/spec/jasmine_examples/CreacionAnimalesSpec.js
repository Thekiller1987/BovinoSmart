const Animal = require('../../lib/jasmine_examples/CreacionAnimales'); // Importar la clase Animal

describe("Función crearAnimal", function() {
  it("debería crear un animal con datos válidos", function() {
    const animal = new Animal("Vaca1", 200, "Holstein");
    expect(animal.nombre).toBe("Vaca1");
    expect(animal.peso).toBe(200);
    expect(animal.raza).toBe("Holstein");
    expect(animal.fechaCreacion).toBeDefined();
  });

  it("debería lanzar un error si faltan datos", function() {
    expect(function() {
      new Animal("", 200, "Holstein"); // Llamar el constructor de la clase
    }).toThrowError("El campo nombre no puede estar vacío.");
  });

  it("debería lanzar un error si el peso es inválido", function() {
    expect(function() {
      new Animal("Vaca1", -10, "Holstein"); // Llamar el constructor de la clase
    }).toThrowError("El campo peso debe ser un número positivo.");
  });
});
