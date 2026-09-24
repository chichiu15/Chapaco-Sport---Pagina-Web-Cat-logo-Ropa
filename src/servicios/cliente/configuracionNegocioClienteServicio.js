import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../firebaseConfig';


// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

const documentoConfiguracionGeneral =
  doc(
    db,
    'configuracion_negocio',
    'general'
  );


// ======================================================
// DESCRIPCIÓN DEL FOOTER
// ======================================================

export const suscribirConfiguracionGeneralCliente = (
  callback
) => {
  return onSnapshot(
    documentoConfiguracionGeneral,

    (snapshot) => {
      if (
        !snapshot.exists()
      ) {
        callback({
          descripcion_footer:
            '',
        });

        return;
      }


      const datos =
        snapshot.data();


      callback({
        descripcion_footer:
          datos.descripcion_footer ||
          '',
      });
    },

    (error) => {
      console.error(
        'Error leyendo configuración general:',
        error
      );

      callback({
        descripcion_footer:
          '',
      });
    }
  );
};


// ======================================================
// REDES SOCIALES
// ======================================================

export const suscribirRedesSocialesCliente = (
  callback
) => {
  const consulta =
    query(
      collection(
        db,
        'redes_sociales'
      ),

      orderBy(
        'orden',
        'asc'
      )
    );


  return onSnapshot(
    consulta,

    (snapshot) => {
      const redes =
        snapshot.docs
          .map(
            (documento) => ({
              id:
                documento.id,

              ...documento.data(),
            })
          )
          .filter(
            (red) =>
              red.activo !==
              false
          );


      callback(
        redes
      );
    },

    (error) => {
      console.error(
        'Error leyendo redes sociales:',
        error
      );

      callback(
        []
      );
    }
  );
};


// ======================================================
// UBICACIONES
// ======================================================

export const suscribirUbicacionesCliente = (
  callback
) => {
  const consulta =
    query(
      collection(
        db,
        'ubicaciones'
      ),

      orderBy(
        'orden',
        'asc'
      )
    );


  return onSnapshot(
    consulta,

    (snapshot) => {
      const ubicaciones =
        snapshot.docs
          .map(
            (documento) => ({
              id:
                documento.id,

              ...documento.data(),
            })
          )
          .filter(
            (ubicacion) =>
              ubicacion.activo !==
              false
          );


      callback(
        ubicaciones
      );
    },

    (error) => {
      console.error(
        'Error leyendo ubicaciones:',
        error
      );

      callback(
        []
      );
    }
  );
};