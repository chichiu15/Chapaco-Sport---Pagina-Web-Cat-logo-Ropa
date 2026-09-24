import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';


const coleccionAnuncios = collection(
  db,
  'anuncios_barra'
);


// ======================================================
// ESCUCHAR ANUNCIOS EN TIEMPO REAL
// ======================================================

export const suscribirAnunciosBarra = (
  callback,
  callbackError
) => {

  const consulta = query(
    coleccionAnuncios,
    orderBy('orden', 'asc')
  );

  return onSnapshot(
    consulta,

    (snapshot) => {

      const anuncios = snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...documento.data(),
        })
      );

      callback(anuncios);

    },

    (error) => {

      console.error(
        'Error escuchando anuncios:',
        error
      );

      if (callbackError) {
        callbackError(error);
      }

    }
  );
};


// ======================================================
// CREAR ANUNCIO
// ======================================================

export const crearAnuncioBarra = async (
  datos
) => {

  return await addDoc(
    coleccionAnuncios,
    {
      texto: datos.texto,
      activo: datos.activo,
      orden: datos.orden,
    }
  );
};


// ======================================================
// EDITAR ANUNCIO
// ======================================================

export const editarAnuncioBarra = async (
  id,
  datos
) => {

  const referencia = doc(
    db,
    'anuncios_barra',
    id
  );

  await updateDoc(
    referencia,
    {
      texto: datos.texto,
      activo: datos.activo,
      orden: datos.orden,
    }
  );
};


// ======================================================
// ELIMINAR ANUNCIO
// ======================================================

export const eliminarAnuncioBarra = async (
  id
) => {

  const referencia = doc(
    db,
    'anuncios_barra',
    id
  );

  await deleteDoc(referencia);
};


// ======================================================
// CAMBIAR ESTADO ACTIVO / INACTIVO
// ======================================================

export const cambiarEstadoAnuncio = async (
  id,
  activo
) => {

  const referencia = doc(
    db,
    'anuncios_barra',
    id
  );

  await updateDoc(
    referencia,
    {
      activo,
    }
  );
};


// ======================================================
// REORDENAR TODOS LOS ANUNCIOS
// ======================================================

export const guardarOrdenAnuncios = async (
  anunciosOrdenados
) => {

  const batch = writeBatch(db);

  anunciosOrdenados.forEach(
    (anuncio, indice) => {

      const referencia = doc(
        db,
        'anuncios_barra',
        anuncio.id
      );

      batch.update(
        referencia,
        {
          orden: indice + 1,
        }
      );

    }
  );

  await batch.commit();
};