import {
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../servicios/firebaseConfig';

// ======================================================
// GUÍA DE TALLAS - ADIDAS OVERSIZE
// ======================================================

export async function cargarGuiaAdidasOversize() {
  const referenciaProducto = doc(
    db,
    'productos',
    'adidasOversize001'
  );

  const guiaTallas = {
    titulo: 'Guía de tallas - Adidas Oversize',

    unidad: 'cm',

    columnas: [
      {
        clave: 'talla',
        etiqueta: 'TALLA',
      },
      {
        clave: 'largo',
        etiqueta: 'LARGO',
      },
      {
        clave: 'ancho',
        etiqueta: 'ANCHO',
      },
    ],

    filas: [
      {
        talla: 'M',
        largo: 77,
        ancho: 58,
      },
      {
        talla: 'L',
        largo: 81,
        ancho: 60,
      },
      {
        talla: 'XL',
        largo: 85,
        ancho: 63,
      },
    ],

    nota:
      'Las medidas pueden variar ligeramente según el modelo.',
  };

  try {
    await updateDoc(
      referenciaProducto,
      {
        guia_tallas: guiaTallas,
      }
    );

    console.log(
      '✅ Guía de tallas de Adidas Oversize cargada correctamente.'
    );

    return guiaTallas;
  } catch (error) {
    console.error(
      '❌ Error cargando guía de tallas:',
      error
    );

    throw error;
  }
}   