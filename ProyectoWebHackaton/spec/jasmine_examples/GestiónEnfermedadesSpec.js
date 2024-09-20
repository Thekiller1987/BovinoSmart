const { Enfermedad } = require('../../lib/jasmine_examples/Enfermedad');

const { GestionEnfermedades } = require('../../lib/jasmine_examples/GestiónEnfermedades');

describe("Gestión de Enfermedades", function() {
  let gestionEnfermedades;

  beforeEach(function() {
    gestionEnfermedades = new GestionEnfermedades(); // Instanciar la clase GestionEnfermedades antes de cada prueba
  });

  it("debería registrar una enfermedad con datos válidos", function() {
    const enfermedad = new Enfermedad("Mastitis", "Inflamación de las glándulas mamarias");
    const resultado = gestionEnfermedades.registrarEnfermedad(1, enfermedad);

    expect(resultado).toBe(true);  // Verificar que el resultado sea verdadero
    expect(gestionEnfermedades.obtenerEnfermedades(1).length).toBe(1);  // Verificar que hay una enfermedad registrada
    expect(gestionEnfermedades.obtenerEnfermedades(1)[0].enfermedad.nombre).toBe("Mastitis");
  });

  it("debería lanzar un error si no se proporciona un ID de animal", function() {
    const enfermedad = new Enfermedad("Mastitis", "Inflamación de las glándulas mamarias");

    expect(function() {
      gestionEnfermedades.registrarEnfermedad(null, enfermedad);
    }).toThrowError("El ID del animal es requerido.");
  });

  it("debería lanzar un error si la enfermedad no es una instancia válida", function() {
    expect(function() {
      gestionEnfermedades.registrarEnfermedad(1, {});
    }).toThrowError("La enfermedad debe ser una instancia válida de Enfermedad.");
  });

  it("debería lanzar un error si el nombre de la enfermedad está vacío", function() {
    expect(function() {
      new Enfermedad("", "Inflamación de las glándulas mamarias");
    }).toThrowError("Datos de enfermedad inválidos");
  });

  it("debería lanzar un error si la descripción de la enfermedad está vacía", function() {
    expect(function() {
      new Enfermedad("Mastitis", "");
    }).toThrowError("Datos de enfermedad inválidos");
  });

  it("debería devolver una lista vacía si no hay enfermedades registradas para un animal", function() {
    expect(gestionEnfermedades.obtenerEnfermedades(999).length).toBe(0);  // Verificar que la lista está vacía
  });

  it("debería devolver todas las enfermedades registradas para un animal", function() {
    const enfermedad1 = new Enfermedad("Mastitis", "Inflamación de las glándulas mamarias");
    const enfermedad2 = new Enfermedad("Brucelosis", "Enfermedad bacteriana contagiosa");

    gestionEnfermedades.registrarEnfermedad(1, enfermedad1);
    gestionEnfermedades.registrarEnfermedad(1, enfermedad2);

    const enfermedades = gestionEnfermedades.obtenerEnfermedades(1);
    expect(enfermedades.length).toBe(2);
    expect(enfermedades[0].enfermedad.nombre).toBe("Mastitis");
    expect(enfermedades[1].enfermedad.nombre).toBe("Brucelosis");
  });
});
