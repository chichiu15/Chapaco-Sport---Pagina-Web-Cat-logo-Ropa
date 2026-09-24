import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { elegirAleatorios } from '../../utilidades/elegirAleatorios';
import { ordenarVariantes } from '../../utilidades/tallas';

async function obtenerMapaDeMarcas() {
  const snapshot = await getDocs(
    collection(db, 'marcas')
  );

  const mapa = {};

  snapshot.forEach((documento) => {
    mapa[documento.id] =
      documento.data().nombre;
  });

  return mapa;
}

function obtenerVariantes(producto) {
  const mapaVariantes =
    producto.subcolecciones?.variantes;

  if (
    !mapaVariantes ||
    typeof mapaVariantes !== 'object'
  ) {
    return [];
  }

  return ordenarVariantes(Object.entries(mapaVariantes).map(
    ([id, variante]) => ({
      id,
      ...variante,
    })
  ));
}

function obtenerMejorOferta(
  producto,
  precioBase
) {
  const variantes =
    obtenerVariantes(producto);

  let mejorOferta = null;

  variantes.forEach((variante) => {
    if (
      variante.en_oferta !== true ||
      variante.disponible !== true
    ) {
      return;
    }

    const precioOferta = Number(
      variante.precio_oferta
    );

    if (
      !Number.isFinite(precioOferta) ||
      precioOferta <= 0
    ) {
      return;
    }

    if (
      !mejorOferta ||
      precioOferta <
        mejorOferta.precioOferta
    ) {
      mejorOferta = {
        precioOferta,

        porcentajeDescuento:
          Number(precioBase) > 0
            ? Math.round(
                100 -
                  (precioOferta /
                    Number(precioBase)) *
                    100
              )
            : 0,
      };
    }
  });

  return mejorOferta;
}

export async function obtenerProductosAleatorios(
  cantidad = 4
) {
  const referencia = collection(
    db,
    'productos'
  );

  const consulta = query(
    referencia,
    where('estado', '==', 'activo')
  );

  const snapshot =
    await getDocs(consulta);

  const mapaMarcas =
    await obtenerMapaDeMarcas();

  const productos = snapshot.docs.map(
    (documento) => {
      const datos =
        documento.data();

      const precioBase =
        Number(datos.precio) || 0;

      const oferta =
        obtenerMejorOferta(
          datos,
          precioBase
        );

      return {
        id: documento.id,

        nombre:
          datos.nombre || '',

        precio: precioBase,

        imagen:
          datos.imagenes?.[0] ?? '',

        esNuevo: Boolean(
          datos.es_nuevo
        ),

        etiqueta:
          mapaMarcas[
            datos.marca_id
          ]?.toUpperCase() ??
          datos.marca_id?.toUpperCase() ??
          '',

        oferta,
      };
    }
  );

  return elegirAleatorios(
    productos,
    cantidad
  );
}
