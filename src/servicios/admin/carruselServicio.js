import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import {
  db
} from '../firebaseConfig';

import {
  eliminarArchivoPorUrl,
  eliminarImagenStorage,
  subirImagenCarrusel,
} from './storageServicio';


const coleccionCarrusel =
  collection(
    db,
    'carrusel'
  );


// ======================================================
// LISTAR CARRUSEL EN TIEMPO REAL
// ======================================================

export const suscribirCarruselAdmin = (
  callback,
  callbackError
) => {
  const consulta = query(
    coleccionCarrusel,
    orderBy(
      'orden',
      'asc'
    )
  );

  return onSnapshot(
    consulta,

    (snapshot) => {
      const datos =
        snapshot.docs.map(
          (documento) => ({
            id:
              documento.id,

            ...documento.data(),
          })
        );

      callback(
        datos
      );
    },

    (error) => {
      console.error(
        'Error leyendo carrusel:',
        error
      );

      if (callbackError) {
        callbackError(
          error
        );
      }
    }
  );
};


// ======================================================
// CREAR DIAPOSITIVA
// ======================================================

export const crearDiapositivaCarrusel =
  async (
    datos,
    archivoImagen
  ) => {
    /*
      Creamos primero la referencia
      para obtener un ID estable.
    */

    const referencia =
      doc(
        coleccionCarrusel
      );

    const id =
      referencia.id;


    let imagenFondo = '';

    let imagenFondoRuta = '';


    if (archivoImagen) {
      const resultadoImagen =
        await subirImagenCarrusel(
          id,
          archivoImagen
        );

      imagenFondo =
        resultadoImagen.url;

      imagenFondoRuta =
        resultadoImagen.ruta;
    }


    const diapositiva = {
      activo:
        Boolean(
          datos.activo
        ),

      descripcion:
        datos.descripcion.trim(),

      enlace:
        datos.enlace.trim(),

      enlaceBoton:
        datos.enlaceBoton.trim(),

      ganchoDos:
        datos.ganchoDos.trim(),

      ganchoUno:
        datos.ganchoUno.trim(),

      imagenFondo,

      imagenFondoRuta,

      orden:
        Number(
          datos.orden
        ),

      sintesis:
        datos.sintesis.trim(),

      tipoEnlace:
        datos.tipoEnlace,
    };


    try {
      await setDoc(
        referencia,
        diapositiva
      );

    } catch (errorFirestore) {
      /*
        Si la imagen se subió correctamente
        pero Firestore falla, limpiamos Storage
        para no dejar un archivo huérfano.
      */

      if (imagenFondoRuta) {
        try {
          await eliminarImagenStorage(
            imagenFondoRuta
          );
        } catch (
          errorLimpiando
        ) {
          console.warn(
            'No se pudo limpiar la imagen del carrusel después del error:',
            errorLimpiando
          );
        }
      }

      throw errorFirestore;
    }


    return {
      id,
      ...diapositiva,
    };
  };


// ======================================================
// EDITAR DIAPOSITIVA
// ======================================================

export const editarDiapositivaCarrusel =
  async (
    id,
    datos,
    archivoNuevo,
    imagenAnterior,
    rutaAnterior = ''
  ) => {
    let imagenFondo =
      imagenAnterior || '';

    let imagenFondoRuta =
      rutaAnterior || '';


    /*
      Si el administrador NO cambia
      la imagen, mantenemos exactamente
      la URL y ruta anteriores.
    */

    if (archivoNuevo) {
      /*
        Si ya existe imagenFondoRuta,
        subirImagenCarrusel sobrescribe
        EXACTAMENTE esa misma ruta.

        No genera un archivo adicional.
      */

      const resultadoImagen =
        await subirImagenCarrusel(
          id,
          archivoNuevo,
          rutaAnterior
        );

      imagenFondo =
        resultadoImagen.url;

      imagenFondoRuta =
        resultadoImagen.ruta;
    }


    const referencia =
      doc(
        db,
        'carrusel',
        id
      );


    await updateDoc(
      referencia,
      {
        activo:
          Boolean(
            datos.activo
          ),

        descripcion:
          datos.descripcion.trim(),

        enlace:
          datos.enlace.trim(),

        enlaceBoton:
          datos.enlaceBoton.trim(),

        ganchoDos:
          datos.ganchoDos.trim(),

        ganchoUno:
          datos.ganchoUno.trim(),

        imagenFondo,

        imagenFondoRuta,

        orden:
          Number(
            datos.orden
          ),

        sintesis:
          datos.sintesis.trim(),

        tipoEnlace:
          datos.tipoEnlace,
      }
    );


    /*
      MIGRACIÓN DE DIAPOSITIVAS ANTIGUAS

      Las diapositivas viejas solamente tienen:

      imagenFondo: URL

      pero no:
      imagenFondoRuta

      Si cambiamos la imagen de una diapositiva
      antigua, la nueva imagen se guarda en una
      ruta fija.

      Después de actualizar Firestore eliminamos
      el archivo antiguo usando su URL.
    */

    if (
      archivoNuevo &&
      !rutaAnterior &&
      imagenAnterior &&
      imagenAnterior !==
        imagenFondo
    ) {
      try {
        await eliminarArchivoPorUrl(
          imagenAnterior
        );
      } catch (error) {
        console.warn(
          'La diapositiva se actualizó, pero no se pudo eliminar la imagen antigua:',
          error
        );
      }
    }
  };


// ======================================================
// CAMBIAR ESTADO
// ======================================================

export const cambiarEstadoCarrusel =
  async (
    id,
    activo
  ) => {
    await updateDoc(
      doc(
        db,
        'carrusel',
        id
      ),
      {
        activo,
      }
    );
  };


// ======================================================
// ELIMINAR DIAPOSITIVA
// ======================================================

export const eliminarDiapositivaCarrusel =
  async (
    diapositiva
  ) => {
    /*
      Primero eliminamos el documento
      de Firestore.
    */

    await deleteDoc(
      doc(
        db,
        'carrusel',
        diapositiva.id
      )
    );


    /*
      NUEVO SISTEMA

      Si tenemos imagenFondoRuta,
      borramos directamente la ruta
      exacta de Storage.
    */

    if (
      diapositiva.imagenFondoRuta
    ) {
      try {
        await eliminarImagenStorage(
          diapositiva.imagenFondoRuta
        );
      } catch (error) {
        console.warn(
          'La diapositiva se eliminó, pero no se pudo borrar su imagen de Storage:',
          error
        );
      }

      return;
    }


    /*
      COMPATIBILIDAD CON DATOS ANTIGUOS

      Las diapositivas creadas antes
      del nuevo sistema quizá solamente
      tengan imagenFondo (URL).
    */

    if (
      diapositiva.imagenFondo
    ) {
      try {
        await eliminarArchivoPorUrl(
          diapositiva.imagenFondo
        );
      } catch (error) {
        console.warn(
          'La diapositiva se eliminó, pero no se pudo borrar su imagen antigua de Storage:',
          error
        );
      }
    }
  };


// ======================================================
// REORDENAR
// ======================================================

export const guardarOrdenCarrusel =
  async (
    diapositivas
  ) => {
    const lote =
      writeBatch(
        db
      );


    diapositivas.forEach(
      (
        diapositiva,
        indice
      ) => {
        const referencia =
          doc(
            db,
            'carrusel',
            diapositiva.id
          );


        lote.update(
          referencia,
          {
            orden:
              indice + 1,
          }
        );
      }
    );


    await lote.commit();
  };