import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import { db } from '../firebaseConfig';

const coleccion = collection(
  db,
  'categorias'
);


// ======================================================
// ESCUCHAR CATEGORÍAS EN TIEMPO REAL
// ======================================================

export const suscribirCategorias = (
  callback
) => {
  return onSnapshot(
    coleccion,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    }
  );
};


// ======================================================
// CREAR CATEGORÍA
// ======================================================

export const crearCategoria = async (
  datos
) => {
  const idGenerado = datos.nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');

  const docRef = doc(
    db,
    'categorias',
    idGenerado
  );

  await setDoc(docRef, {
    nombre: datos.nombre,
    descripcion:
      datos.descripcion || '',
    estado: datos.estado,

    guia_tallas_url:
      datos.guia_tallas_url || '',

    guia_tallas_ruta:
      datos.guia_tallas_ruta || ''
  });

  return idGenerado;
};


// ======================================================
// EDITAR CATEGORÍA
// ======================================================

export const editarCategoria = async (
  id,
  datos
) => {
  const docRef = doc(
    db,
    'categorias',
    id
  );

  await updateDoc(docRef, {
    nombre: datos.nombre,
    descripcion:
      datos.descripcion || '',
    estado: datos.estado,

    guia_tallas_url:
      datos.guia_tallas_url || '',

    guia_tallas_ruta:
      datos.guia_tallas_ruta || ''
  });
};


// ======================================================
// ELIMINAR CATEGORÍA
// ======================================================

export const eliminarCategoria = async (
  id
) => {
  const docRef = doc(
    db,
    'categorias',
    id
  );

  await deleteDoc(docRef);
};