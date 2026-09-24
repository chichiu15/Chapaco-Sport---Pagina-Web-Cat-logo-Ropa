import {
  useMemo,
} from 'react';

import {
  usarCatalogo,
} from './usarCatalogo';


export function usarProductosAleatorios(
  cantidad = 4
) {
  const {
    productos:
      todosLosProductos,

    cargando,

    error,
  } =
    usarCatalogo();


  /*
    Se recalcula solamente cuando realmente
    cambia el listado recibido de Firestore
    o cambia la cantidad solicitada.

    No se mezcla otra vez por cada render.
  */
  const productos =
    useMemo(() => {
      if (
        todosLosProductos.length ===
        0
      ) {
        return [];
      }


      const copia = [
        ...todosLosProductos,
      ];


      /*
        Fisher-Yates.

        Mejor que:
        sort(() => Math.random() - 0.5)

        porque no depende de un comparador
        inválido e impredecible.
      */
      for (
        let indice =
          copia.length - 1;

        indice > 0;

        indice -= 1
      ) {
        const aleatorio =
          Math.floor(
            Math.random() *
              (
                indice +
                1
              )
          );


        [
          copia[indice],
          copia[aleatorio],
        ] = [
          copia[aleatorio],
          copia[indice],
        ];
      }


      return copia.slice(
        0,
        cantidad
      );
    }, [
      todosLosProductos,
      cantidad,
    ]);


  return {
    productos,

    cargando,

    error,
  };
}