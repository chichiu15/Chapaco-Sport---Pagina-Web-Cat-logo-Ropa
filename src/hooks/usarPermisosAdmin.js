import {
  useContext,
} from 'react';

import {
  ContextoPermisosAdmin,
} from '../contextos/ContextoPermisosAdmin';


function usarPermisosAdmin() {
  const contexto =
    useContext(
      ContextoPermisosAdmin
    );


  if (
    !contexto
  ) {
    throw new Error(
      'usarPermisosAdmin debe utilizarse dentro de ProveedorPermisosAdmin.'
    );
  }


  return contexto;
}


export default usarPermisosAdmin;