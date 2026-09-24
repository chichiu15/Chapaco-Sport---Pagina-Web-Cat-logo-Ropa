import {
  useContext,
} from 'react';

import {
  ContextoCatalogoPublico,
} from '../contextos/ContextoCatalogoPublico';


export function usarCatalogo() {
  const contexto =
    useContext(
      ContextoCatalogoPublico
    );


  if (!contexto) {
    throw new Error(
      'usarCatalogo debe utilizarse dentro de ProveedorCatalogoPublico.'
    );
  }


  return contexto;
}