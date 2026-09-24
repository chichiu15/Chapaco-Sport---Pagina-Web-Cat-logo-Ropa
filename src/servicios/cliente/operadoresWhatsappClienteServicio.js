import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../firebaseConfig';


export const suscribirOperadoresWhatsappCliente = (
  callback
) => {
  const consulta =
    query(
      collection(
        db,
        'whatsapps'
      ),
      orderBy(
        'orden',
        'asc'
      )
    );


  return onSnapshot(
    consulta,
    (snapshot) => {
      const operadores =
        snapshot.docs
          .map(
            (documento) => ({
              id:
                documento.id,

              ...documento.data(),
            })
          )
          .filter(
            (operador) =>
              operador.activo ===
              true
          );

      callback(
        operadores
      );
    },

    (error) => {
      console.error(
        'Error leyendo operadores de WhatsApp:',
        error
      );

      callback(
        []
      );
    }
  );
};