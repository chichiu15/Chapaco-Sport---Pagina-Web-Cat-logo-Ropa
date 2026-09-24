import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { ordenarVariantes } from '../../utilidades/tallas';

import {
  eliminarArchivoPorUrl,
  eliminarImagenesStorage,
  subirImagenesProducto,
} from './storageServicio';


const coleccionProductos =
  collection(
    db,
    'productos'
  );


// ======================================================
// PREPARAR DATOS DEL PRODUCTO
// ======================================================

const prepararDatosProducto = (
  datosProducto,
  imagenesForzadas = null
) => {

  const imagenes =
    imagenesForzadas !== null
      ? imagenesForzadas
      : Array.isArray(
          datosProducto.imagenes
        )
        ? datosProducto.imagenes
        : [];


  return {
    categoria_id:
      datosProducto.categoria_id,

    descripcion_corta:
      datosProducto.descripcion_corta ||
      '',

    es_nuevo:
      Boolean(
        datosProducto.es_nuevo
      ),

    estado:
      datosProducto.estado ===
      'inactivo'
        ? 'inactivo'
        : 'activo',

    /*
      Conservamos el formato existente:

      imagenes: [
        "https://...",
        "https://..."
      ]

      Así no rompemos el cliente.
    */
    imagenes,

    marca_id:
      datosProducto.marca_id,

    nombre:
      datosProducto.nombre,

    precio:
      Number(
        datosProducto.precio
      ),

    subcolecciones: {
      variantes:
        datosProducto
          .subcolecciones
          ?.variantes ||
        {},
    },
  };
};


// ======================================================
// LISTAR TODOS LOS PRODUCTOS
// ======================================================

export const obtenerProductos =
  async () => {

    const snapshot =
      await getDocs(
        coleccionProductos
      );


    return snapshot.docs.map(
      (documento) => ({
        id:
          documento.id,

        ...documento.data(),
      })
    );
  };


// ======================================================
// OBTENER PRODUCTO POR ID
// ======================================================

export const obtenerProductoPorId =
  async (
    id
  ) => {

    const referencia =
      doc(
        db,
        'productos',
        id
      );


    const snapshot =
      await getDoc(
        referencia
      );


    if (
      !snapshot.exists()
    ) {
      return null;
    }


    return {
      id:
        snapshot.id,

      ...snapshot.data(),
    };
  };


// ======================================================
// OBTENER VARIANTES
// ======================================================

export const obtenerVariantesProducto =
  async (
    productoId
  ) => {

    const producto =
      await obtenerProductoPorId(
        productoId
      );


    if (!producto) {
      return [];
    }


    const variantes =
      producto
        .subcolecciones
        ?.variantes ||
      {};


    return ordenarVariantes(Object.entries(
      variantes
    ).map(
      ([
        id,
        variante
      ]) => ({
        id,

        ...variante,
      })
    ));
  };


// ======================================================
// CREAR PRODUCTO SIN IMÁGENES
// ======================================================

export const crearProducto =
  async (
    datosProducto
  ) => {

    const referenciaProducto =
      doc(
        coleccionProductos
      );


    const productoCompleto =
      prepararDatosProducto(
        datosProducto
      );


    await setDoc(
      referenciaProducto,
      productoCompleto
    );


    return {
      ok:
        true,

      id:
        referenciaProducto.id,

      producto: {
        id:
          referenciaProducto.id,

        ...productoCompleto,
      },
    };
  };


// ======================================================
// ACTUALIZAR PRODUCTO
// ======================================================

export const actualizarProducto =
  async (
    productoId,
    datosProducto
  ) => {

    const referencia =
      doc(
        db,
        'productos',
        productoId
      );


    const productoCompleto =
      prepararDatosProducto(
        datosProducto
      );


    await updateDoc(
      referencia,
      productoCompleto
    );


    return {
      ok:
        true,

      id:
        productoId,

      producto: {
        id:
          productoId,

        ...productoCompleto,
      },
    };
  };


// ======================================================
// CREAR PRODUCTO + SUBIR IMÁGENES
// ======================================================

export const crearProductoConImagenes =
  async (
    datosProducto,
    archivosImagenes
  ) => {

    /*
      Generamos primero el documento para
      disponer del ID definitivo.

      Todas las imágenes quedan debajo de:

      productos/{productoId}/...
    */

    const referenciaProducto =
      doc(
        coleccionProductos
      );


    const productoId =
      referenciaProducto.id;


    let imagenesSubidas =
      [];


    try {

      imagenesSubidas =
        await subirImagenesProducto(
          productoId,
          archivosImagenes
        );


      /*
        Firestore sigue guardando únicamente
        las URLs para mantener compatibilidad
        con toda la tienda.
      */

      const urlsImagenes =
        imagenesSubidas.map(
          (imagen) =>
            imagen.url
        );


      const productoCompleto =
        prepararDatosProducto(
          datosProducto,
          urlsImagenes
        );


      await setDoc(
        referenciaProducto,
        productoCompleto
      );


      return {
        ok:
          true,

        id:
          productoId,

        producto: {
          id:
            productoId,

          ...productoCompleto,
        },
      };


    } catch (error) {

      console.error(
        'Error creando producto:',
        error
      );


      /*
        Si Storage funcionó pero Firestore
        falló, eliminamos todas las imágenes
        recién creadas.

        Así no dejamos archivos huérfanos.
      */

      if (
        imagenesSubidas.length >
        0
      ) {

        const rutas =
          imagenesSubidas
            .map(
              (imagen) =>
                imagen.ruta
            )
            .filter(
              Boolean
            );


        try {

          await eliminarImagenesStorage(
            rutas
          );

        } catch (
          errorEliminando
        ) {

          console.error(
            'Error limpiando imágenes después de fallar la creación:',
            errorEliminando
          );

        }
      }


      throw error;
    }
  };


// ======================================================
// ELIMINAR PRODUCTO + SUS IMÁGENES
// ======================================================

export const eliminarProducto =
  async (
    productoId
  ) => {

    if (!productoId) {
      throw new Error(
        'No se recibió el ID del producto.'
      );
    }


    const referencia =
      doc(
        db,
        'productos',
        productoId
      );


    /*
      IMPORTANTE:

      Leemos el producto ANTES de eliminarlo.

      Necesitamos conservar las URLs de
      las imágenes para poder eliminarlas
      después de Storage.
    */

    const snapshot =
      await getDoc(
        referencia
      );


    if (
      !snapshot.exists()
    ) {

      throw new Error(
        'El producto no existe.'
      );

    }


    const producto =
      snapshot.data();


    const imagenes =
      Array.isArray(
        producto.imagenes
      )
        ? producto.imagenes.filter(
            Boolean
          )
        : [];


    /*
      Primero eliminamos Firestore.

      Así el producto deja de aparecer
      inmediatamente en el sistema.
    */

    await deleteDoc(
      referencia
    );


    /*
      Después eliminamos todas las fotografías
      relacionadas con el producto.

      Las URLs de Firebase permiten obtener
      directamente la referencia del objeto
      mediante eliminarArchivoPorUrl().
    */

    if (
      imagenes.length >
      0
    ) {

      const resultados =
        await Promise.allSettled(
          imagenes.map(
            (url) =>
              eliminarArchivoPorUrl(
                url
              )
          )
        );


      /*
        Si alguna imagen concreta no pudo
        eliminarse, mostramos información
        en consola sin hacer aparecer otra vez
        un producto que ya fue eliminado.
      */

      resultados.forEach(
        (
          resultado,
          indice
        ) => {

          if (
            resultado.status ===
            'rejected'
          ) {

            console.warn(
              `No se pudo eliminar la imagen ${indice + 1} del producto ${productoId}:`,
              resultado.reason
            );

          }

        }
      );
    }


    return true;
  };


// ======================================================
// ESCUCHAR PRODUCTOS PARA SELECTORES ADMINISTRATIVOS
// ======================================================

export const suscribirProductosAdmin = (
  callback,
  onError
) => onSnapshot(
  coleccionProductos,
  (snapshot) => callback(snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }))),
  onError
);
