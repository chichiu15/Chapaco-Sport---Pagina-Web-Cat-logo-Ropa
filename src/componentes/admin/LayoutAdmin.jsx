import {
  Outlet,
} from 'react-router-dom';

import BarraLateralAdmin from './BarraLateralAdmin';

import usarPermisosAdmin from '../../hooks/usarPermisosAdmin';


function LayoutAdmin() {
  const {
    cargandoPermisos,
    tieneAccesoAdmin,
    usuarioActivo,
    rolActivo,
    rolActual,
    errorPermisos,
  } =
    usarPermisosAdmin();


  return (
    <div className="adminLayout">
      <BarraLateralAdmin />

      <main className="adminLayout__contenido">
        {cargandoPermisos ? (
          <div className="permisoDenegado">
            <p>
              Verificando permisos...
            </p>
          </div>
        ) : !tieneAccesoAdmin ? (
          <div className="permisoDenegado">
            <h1>
              Acceso administrativo bloqueado
            </h1>

            <p>
              {usuarioActivo === false
                ? 'Tu usuario se encuentra bloqueado.'
                : rolActual && !rolActivo
                  ? `El rol "${rolActual.nombre || 'asignado'}" se encuentra inactivo.`
                  : errorPermisos ||
                    'No tienes un rol administrativo válido.'}
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}


export default LayoutAdmin;