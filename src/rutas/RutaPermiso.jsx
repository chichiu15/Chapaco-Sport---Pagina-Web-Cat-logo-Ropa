import {
  ShieldX,
} from 'lucide-react';

import CargandoPagina from '../componentes/comun/CargandoPagina';

import usarPermisosAdmin from '../hooks/usarPermisosAdmin';


function RutaPermiso({
  permiso,
  children,
}) {
  const {
    cargandoPermisos,
    tieneAccesoAdmin,
    tienePermiso,
    usuarioActivo,
    rolActivo,
    rolActual,
    errorPermisos,
  } =
    usarPermisosAdmin();


  if (
    cargandoPermisos
  ) {
    return (
      <CargandoPagina />
    );
  }


  if (
    !tieneAccesoAdmin
  ) {
    let mensaje =
      errorPermisos ||
      'Tu cuenta no tiene acceso administrativo.';


    if (
      usuarioActivo ===
      false
    ) {
      mensaje =
        'Tu usuario se encuentra bloqueado.';
    } else if (
      rolActual &&
      !rolActivo
    ) {
      mensaje =
        `El rol "${rolActual.nombre || 'asignado'}" se encuentra inactivo.`;
    }


    return (
      <div className="permisoDenegado">
        <ShieldX
          size={44}
        />

        <h1>
          Acceso bloqueado
        </h1>

        <p>
          {mensaje}
        </p>
      </div>
    );
  }


  if (
    permiso &&
    !tienePermiso(
      permiso
    )
  ) {
    return (
      <div className="permisoDenegado">
        <ShieldX
          size={44}
        />

        <h1>
          Sin permiso
        </h1>

        <p>
          Tu rol no tiene autorización
          para acceder a esta sección.
        </p>
      </div>
    );
  }


  return children;
}


export default RutaPermiso;