import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function obtenerDiapositivasCarrusel() {
  const snapshot = await getDocs(collection(db, 'carrusel'));

  return snapshot.docs
    .map((documento) => {
      const datos = documento.data();
      return {
        id: documento.id,
        activo: Boolean(datos.activo),
        orden: datos.orden ?? 0,
        sintesis: datos.sintesis,
        ganchoUno: datos.ganchoUno,
        ganchoDos: datos.ganchoDos,
        descripcion: datos.descripcion,
        enlaceBoton: datos.enlaceBoton,
        tipoEnlace: datos.tipoEnlace,
        enlace: datos.enlace,
        imagenFondo: datos.imagenFondo,
      };
    })
    .filter((diapositiva) => diapositiva.activo)
    .sort((a, b) => a.orden - b.orden);
}