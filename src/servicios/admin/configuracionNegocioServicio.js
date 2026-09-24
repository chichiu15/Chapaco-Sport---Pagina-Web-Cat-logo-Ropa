import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import {
  db,
} from '../firebaseConfig';


// ======================================================
// REFERENCIAS
// ======================================================

const documentoConfiguracionGeneral =
  doc(
    db,
    'configuracion_negocio',
    'general'
  );

const coleccionRedesSociales =
  collection(
    db,
    'redes_sociales'
  );

const coleccionUbicaciones =
  collection(
    db,
    'ubicaciones'
  );

const coleccionWhatsapps =
  collection(
    db,
    'whatsapps'
  );


// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

export const suscribirConfiguracionGeneral = (
  callback
) => {
  return onSnapshot(
    documentoConfiguracionGeneral,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback({
          descripcion_footer: '',
        });

        return;
      }

      callback({
        descripcion_footer:
          snapshot.data()
            ?.descripcion_footer ||
          '',
      });
    }
  );
};


export const guardarDescripcionFooter = async (
  descripcion
) => {
  await setDoc(
    documentoConfiguracionGeneral,
    {
      descripcion_footer:
        String(
          descripcion || ''
        ).trim(),

      actualizado_en:
        serverTimestamp(),
    },
    {
      merge:
        true,
    }
  );

  return true;
};


// ======================================================
// REDES SOCIALES
// ======================================================

export const suscribirRedesSociales = (
  callback
) => {
  const consulta =
    query(
      coleccionRedesSociales,
      orderBy(
        'orden',
        'asc'
      )
    );

  return onSnapshot(
    consulta,
    (snapshot) => {
      callback(
        snapshot.docs.map(
          (documento) => ({
            id:
              documento.id,

            ...documento.data(),
          })
        )
      );
    }
  );
};


export const crearRedSocial = async (
  datos
) => {
  const referencia =
    await addDoc(
      coleccionRedesSociales,
      {
        tipo:
          String(
            datos.tipo || ''
          ).trim(),

        nombre:
          String(
            datos.nombre || ''
          ).trim(),

        url:
          String(
            datos.url || ''
          ).trim(),

        activo:
          datos.activo !==
          false,

        orden:
          Number(
            datos.orden
          ) || 0,

        actualizado_en:
          serverTimestamp(),
      }
    );

  return referencia.id;
};


export const editarRedSocial = async (
  id,
  datos
) => {
  await updateDoc(
    doc(
      db,
      'redes_sociales',
      id
    ),
    {
      tipo:
        String(
          datos.tipo || ''
        ).trim(),

      nombre:
        String(
          datos.nombre || ''
        ).trim(),

      url:
        String(
          datos.url || ''
        ).trim(),

      activo:
        datos.activo ===
        true,

      orden:
        Number(
          datos.orden
        ) || 0,

      actualizado_en:
        serverTimestamp(),
    }
  );

  return true;
};


export const eliminarRedSocial = async (
  id
) => {
  await deleteDoc(
    doc(
      db,
      'redes_sociales',
      id
    )
  );

  return true;
};


// ======================================================
// UBICACIONES
// ======================================================

export const suscribirUbicaciones = (
  callback
) => {
  const consulta =
    query(
      coleccionUbicaciones,
      orderBy(
        'orden',
        'asc'
      )
    );

  return onSnapshot(
    consulta,
    (snapshot) => {
      callback(
        snapshot.docs.map(
          (documento) => ({
            id:
              documento.id,

            ...documento.data(),
          })
        )
      );
    }
  );
};


const quitarPrincipalAnterior = async (
  idUbicacionActual = ''
) => {
  const snapshot =
    await getDocs(
      coleccionUbicaciones
    );

  const batch =
    writeBatch(
      db
    );

  let hayCambios =
    false;

  snapshot.docs.forEach(
    (documentoUbicacion) => {
      const datos =
        documentoUbicacion.data();

      if (
        documentoUbicacion.id !==
          idUbicacionActual &&
        datos.es_principal ===
          true
      ) {
        batch.update(
          documentoUbicacion.ref,
          {
            es_principal:
              false,

            url_iframe:
              '',

            actualizado_en:
              serverTimestamp(),
          }
        );

        hayCambios =
          true;
      }
    }
  );

  if (
    hayCambios
  ) {
    await batch.commit();
  }
};


export const crearUbicacion = async (
  datos
) => {
  const esPrincipal =
    datos.es_principal ===
    true;

  if (
    esPrincipal
  ) {
    await quitarPrincipalAnterior();
  }

  const referencia =
    await addDoc(
      coleccionUbicaciones,
      {
        nombre:
          String(
            datos.nombre || ''
          ).trim(),

        direccion:
          String(
            datos.direccion || ''
          ).trim(),

        url_mapa:
          String(
            datos.url_mapa || ''
          ).trim(),

        es_principal:
          esPrincipal,

        url_iframe:
          esPrincipal
            ? String(
                datos.url_iframe ||
                ''
              ).trim()
            : '',

        activo:
          datos.activo !==
          false,

        orden:
          Number(
            datos.orden
          ) || 0,

        actualizado_en:
          serverTimestamp(),
      }
    );

  return referencia.id;
};


export const editarUbicacion = async (
  id,
  datos
) => {
  const esPrincipal =
    datos.es_principal ===
    true;

  if (
    esPrincipal
  ) {
    await quitarPrincipalAnterior(
      id
    );
  }

  await updateDoc(
    doc(
      db,
      'ubicaciones',
      id
    ),
    {
      nombre:
        String(
          datos.nombre || ''
        ).trim(),

      direccion:
        String(
          datos.direccion || ''
        ).trim(),

      url_mapa:
        String(
          datos.url_mapa || ''
        ).trim(),

      es_principal:
        esPrincipal,

      url_iframe:
        esPrincipal
          ? String(
              datos.url_iframe ||
              ''
            ).trim()
          : '',

      activo:
        datos.activo ===
        true,

      orden:
        Number(
          datos.orden
        ) || 0,

      actualizado_en:
        serverTimestamp(),
    }
  );

  return true;
};


export const eliminarUbicacion = async (
  id
) => {
  await deleteDoc(
    doc(
      db,
      'ubicaciones',
      id
    )
  );

  return true;
};


// ======================================================
// WHATSAPP / OPERADORES
// ======================================================

export const suscribirWhatsapps = (
  callback
) => {
  const consulta =
    query(
      coleccionWhatsapps,
      orderBy(
        'orden',
        'asc'
      )
    );

  return onSnapshot(
    consulta,
    (snapshot) => {
      callback(
        snapshot.docs.map(
          (documento) => ({
            id:
              documento.id,

            ...documento.data(),
          })
        )
      );
    }
  );
};


export const crearWhatsapp = async (
  datos
) => {
  const referencia =
    await addDoc(
      coleccionWhatsapps,
      {
        nombre:
          String(
            datos.nombre || ''
          ).trim(),

        etiqueta:
          String(
            datos.etiqueta || ''
          ).trim(),

        numero:
          String(
            datos.numero || ''
          )
            .replace(
              /\D/g,
              ''
            )
            .trim(),

        activo:
          datos.activo !==
          false,

        orden:
          Number(
            datos.orden
          ) || 0,

        actualizado_en:
          serverTimestamp(),
      }
    );

  return referencia.id;
};


export const editarWhatsapp = async (
  id,
  datos
) => {
  await updateDoc(
    doc(
      db,
      'whatsapps',
      id
    ),
    {
      nombre:
        String(
          datos.nombre || ''
        ).trim(),

      etiqueta:
        String(
          datos.etiqueta || ''
        ).trim(),

      numero:
        String(
          datos.numero || ''
        )
          .replace(
            /\D/g,
            ''
          )
          .trim(),

      activo:
        datos.activo ===
        true,

      orden:
        Number(
          datos.orden
        ) || 0,

      actualizado_en:
        serverTimestamp(),
    }
  );

  return true;
};


export const eliminarWhatsapp = async (
  id
) => {
  await deleteDoc(
    doc(
      db,
      'whatsapps',
      id
    )
  );

  return true;
};