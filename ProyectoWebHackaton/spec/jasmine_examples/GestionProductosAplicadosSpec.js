const { GestionProductosAplicados } = require('../../lib/jasmine_examples/GestionProductosAplicados');
const { ValidadorProductosAplicados } = require('../../spec/helpers/jasmine_examples/ValidadorProductosAplicados');

describe("Gestión de Productos Aplicados", function() {
  let gestionProductosAplicados;

  beforeEach(function() {
    gestionProductosAplicados = new GestionProductosAplicados(); // Instanciar la clase GestiónProductosAplicados antes de cada prueba
  });

  it("debería registrar un producto aplicado con datos válidos", function() {
    const resultado = gestionProductosAplicados.registrarProducto(1, "Producto A", new Date());
    
    expect(resultado).toBe(true); // Verificar que el resultado sea verdadero
    expect(gestionProductosAplicados.obtenerProductosAplicados(1).length).toBe(1); // Verificar que hay un producto aplicado registrado
    expect(gestionProductosAplicados.obtenerProductosAplicados(1)[0].nombreProducto).toBe("Producto A");
  });

  it("debería lanzar un error si no se proporciona un ID de animal", function() {
    expect(function() {
      gestionProductosAplicados.registrarProducto(null, "Producto A", new Date());
    }).toThrowError("El ID del animal es requerido.");
  });

  it("debería lanzar un error si no se proporciona un nombre de producto", function() {
    expect(function() {
      gestionProductosAplicados.registrarProducto(1, "", new Date());
    }).toThrowError("El nombre del producto es requerido.");
  });

  it("debería lanzar un error si la fecha no es válida", function() {
    expect(function() {
      gestionProductosAplicados.registrarProducto(1, "Producto A", "fecha inválida");
    }).toThrowError("La fecha proporcionada no es válida.");
  });

  it("debería devolver una lista vacía si no hay productos aplicados registrados para un animal", function() {
    expect(gestionProductosAplicados.obtenerProductosAplicados(999).length).toBe(0); // Verificar que no hay productos aplicados registrados para el ID del animal 999
  });

  it("debería devolver todos los productos aplicados registrados para un animal", function() {
    const fecha1 = new Date();
    const fecha2 = new Date();
    
    gestionProductosAplicados.registrarProducto(1, "Producto A", fecha1);
    gestionProductosAplicados.registrarProducto(1, "Producto B", fecha2);

    const productos = gestionProductosAplicados.obtenerProductosAplicados(1);
    expect(productos.length).toBe(2); // Verificar que hay dos productos aplicados registrados
    expect(productos[0].nombreProducto).toBe("Producto A");
    expect(productos[1].nombreProducto).toBe("Producto B");
  });
});
