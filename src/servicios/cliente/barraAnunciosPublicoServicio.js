import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import {
  db,
} from '../firebaseConfig';


export function suscribirAnunciosBarra(
  callback,
  onError
) {
  const consulta =
    query(
      collection(
        db,
        'anuncios_barra'
      ),

      orderBy(
        'orden',
        'asc'
      )
    );


  return onSnapshot(
    consulta,

    (snapshot) => {
      const anuncios =
        snapshot.docs
          .map(
            (documento) => ({
              id:
                documento.id,

              ...documento.data(),
            })
          )
          .filter(
            (anuncio) =>
              anuncio.activo ===
              true
          )
          .map(
            (anuncio) =>
              anuncio.texto
          )
          .filter(Boolean);


      callback(
        anuncios
      );
    },

    (error) => {
      console.error(
        'Error escuchando barra de anuncios:',
        error
      );


      if (onError) {
        onError(
          error
        );
      }
    }
  );
}