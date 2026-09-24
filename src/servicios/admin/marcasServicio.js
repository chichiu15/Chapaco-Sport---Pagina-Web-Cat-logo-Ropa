import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import {
  db
} from '../firebaseConfig';


const coleccion =
  collection(
    db,
    'marcas'
  );


// ======================================================
// GENERAR ID DE MARCA
// ======================================================

export const generarIdMarca = (
  nombre = ''
) => {
  return String(nombre)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};


// ======================================================
// ESCUCHAR MARCAS EN TIEMPO REAL
// ======================================================

export const suscribirMarcas = (
  callback
) => {
  return onSnapshot(
    coleccion,
    (snapshot) => {
      callback(
        snapshot.docs.map(
          (documento) => ({
            id: documento.id,
            ...documento.data()
          })
        )
      );
    }
  );
};


// ======================================================
// CREAR MARCA
// ======================================================

export const crearMarca = async (
  datos
) => {
  const idGenerado =
    generarIdMarca(
      datos.nombre
    );

  if (!idGenerado) {
    throw new Error(
      'No se pudo generar el ID de la marca.'
    );
  }

  const docRef = doc(
    db,
    'marcas',
    idGenerado
  );

  await setDoc(
    docRef,
    {
      nombre:
        String(
          datos.nombre || ''
        ).trim(),

      estado:
        datos.estado ?? true,

      logo:
        datos.logo || '',

      logoRuta:
        datos.logoRuta || ''
    }
  );

  return idGenerado;
};


// ======================================================
// EDITAR MARCA
// ======================================================

export const editarMarca = async (
  id,
  datos
) => {
  const docRef = doc(
    db,
    'marcas',
    id
  );

  await updateDoc(
    docRef,
    {
      nombre:
        String(
          datos.nombre || ''
        ).trim(),

      estado:
        datos.estado ?? true,

      logo:
        datos.logo || '',

      logoRuta:
        datos.logoRuta || ''
    }
  );
};


// ======================================================
// ELIMINAR MARCA
// ======================================================

export const eliminarMarca = async (
  id
) => {
  const docRef = doc(
    db,
    'marcas',
    id
  );

  await deleteDoc(
    docRef
  );
};