import { doc, setDoc } from "firebase/firestore";
import { db } from "../../servicios/firebaseConfig";
import { datosCatalogoPrueba } from "./catalogoPrueba";

export const cargarCatalogoFirestore = async () => {
  try {
    console.log("=================================");
    console.log("INICIANDO CARGA DE DATOS");
    console.log("=================================");

    // ==========================================================
    // CATEGORIAS
    // ==========================================================

    console.log("Cargando categorías...");

    for (const [categoriaId, categoria] of Object.entries(
      datosCatalogoPrueba.categorias
    )) {
      await setDoc(
        doc(db, "categorias", categoriaId),
        categoria
      );

      console.log(`Categoría cargada: ${categoria.nombre}`);
    }

    // ==========================================================
    // MARCAS
    // ==========================================================

    console.log("Cargando marcas...");

    for (const [marcaId, marca] of Object.entries(
      datosCatalogoPrueba.marcas
    )) {
      await setDoc(
        doc(db, "marcas", marcaId),
        marca
      );

      console.log(`Marca cargada: ${marca.nombre}`);
    }

    // ==========================================================
    // PRODUCTOS
    // ==========================================================

    console.log("Cargando productos...");

    for (const [productoId, producto] of Object.entries(
      datosCatalogoPrueba.productos
    )) {
      await setDoc(
        doc(db, "productos", productoId),
        producto
      );

      console.log(`Producto cargado: ${producto.nombre}`);
    }

    console.log("=================================");
    console.log("CARGA COMPLETADA CORRECTAMENTE");
    console.log("=================================");

    return {
      ok: true,
      mensaje: "Datos cargados correctamente"
    };
  } catch (error) {
    console.error("Error cargando datos en Firestore:", error);

    return {
      ok: false,
      mensaje: error.message
    };
  }
};