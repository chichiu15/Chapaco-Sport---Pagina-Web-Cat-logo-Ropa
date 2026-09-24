import {
  useState,
} from 'react';

import {
  Images,
  LayoutGrid,
  LogOut,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  Tags,
  Users,
  X,
  Menu,
  BadgePercent,
} from 'lucide-react';

import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  cerrarSesion,
} from '../../servicios/admin/authServicio';

import {
  URL_LOGO,
} from '../../utilidades/Constantes';

import usarPermisosAdmin from '../../hooks/usarPermisosAdmin';


function BarraLateralAdmin() {
  const [
    menuAbierto,
    setMenuAbierto,
  ] =
    useState(false);

  const navegar =
    useNavigate();


  const {
    usuarioAdmin,
    rolActual,
    tieneAccesoAdmin,
    tienePermiso,
  } =
    usarPermisosAdmin();


  const usuarioNombre =
    usuarioAdmin?.nombre ||
    usuarioAdmin?.correo
      ?.split('@')[
        0
      ] ||
    'Usuario';


  const manejarCerrarSesion =
    async () => {
      try {
        await cerrarSesion();

        navegar(
          '/admin'
        );
      } catch (
        error
      ) {
        console.error(
          'Error al cerrar sesión:',
          error
        );
      }
    };


  const cerrarMenuMovil =
    () => {
      setMenuAbierto(
        false
      );
    };


  const enlaces = [
    {
      ruta:
        '/admin/panel',

      nombre:
        'Productos',

      permiso:
        'productos_ver',

      Icono:
        Package,
    },

    {
      ruta:
        '/admin/marcas',

      nombre:
        'Marcas',

      permiso:
        'marcas_gestionar',

      Icono:
        Tags,
    },

    {
      ruta:
        '/admin/categorias',

      nombre:
        'Categorías',

      permiso:
        'categorias_gestionar',

      Icono:
        LayoutGrid,
    },

    {
      ruta:
        '/admin/usuarios',

      nombre:
        'Usuarios',

      permiso:
        'usuarios_gestionar',

      Icono:
        Users,
    },

    {
      ruta:
        '/admin/roles',

      nombre:
        'Roles y permisos',

      permiso:
        'roles_gestionar',

      Icono:
        ShieldCheck,
    },

    {
      ruta:
        '/admin/anuncios',

      nombre:
        'Barra Anuncios',

      permiso:
        'anuncios_gestionar',

      Icono:
        Megaphone,
    },

    {
      ruta:
        '/admin/carrusel',

      nombre:
        'Carrusel',

      permiso:
        'carrusel_gestionar',

      Icono:
        Images,
    },

    {
      ruta:
        '/admin/promociones',

      nombre:
        'Promociones',

      permiso:
        'promociones_gestionar',

      Icono:
        BadgePercent,
    },

    {
      ruta:
        '/admin/configuracion-negocio',

      nombre:
        'Configuración negocio',

      permiso:
        'configuracion_negocio_gestionar',

      Icono:
        Settings,
    },
  ];


  return (
    <>
      <button
        type="button"
        className="adminSidebar__hamburguesa"
        onClick={() =>
          setMenuAbierto(
            (actual) =>
              !actual
          )
        }
        aria-label={
          menuAbierto
            ? 'Cerrar menú'
            : 'Abrir menú'
        }
      >
        {menuAbierto ? (
          <X
            size={24}
          />
        ) : (
          <Menu
            size={24}
          />
        )}
      </button>


      {menuAbierto && (
        <div
          className="adminSidebar__overlay"
          onClick={
            cerrarMenuMovil
          }
        />
      )}


      <aside
        className={
          `adminSidebar ${
            menuAbierto
              ? 'adminSidebar--abierto'
              : ''
          }`
        }
      >
        <div className="adminSidebar__brand">
          <img
            src={
              URL_LOGO
            }
            alt="Chapaco Sport"
            className="adminSidebar__logoImg"
          />

          <div className="adminSidebar__brandText">
            <span className="adminSidebar__sub">
              PANEL ADMIN
            </span>
          </div>
        </div>


        <nav className="adminSidebar__nav">
          {tieneAccesoAdmin &&
            enlaces
              .filter(
                (enlace) =>
                  tienePermiso(
                    enlace.permiso
                  )
              )
              .map(
                ({
                  ruta,
                  nombre,
                  Icono,
                }) => (
                  <NavLink
                    key={
                      ruta
                    }
                    to={
                      ruta
                    }
                    onClick={
                      cerrarMenuMovil
                    }
                    className={
                      ({
                        isActive,
                      }) =>
                        `adminSidebar__link ${
                          isActive
                            ? 'adminSidebar__link--activo'
                            : ''
                        }`
                    }
                  >
                    <Icono
                      size={20}
                    />

                    <span>
                      {nombre}
                    </span>
                  </NavLink>
                )
              )}
        </nav>


        <div className="adminSidebar__footer">
          <div className="adminSidebar__usuarioRow">
            <div className="adminSidebar__usuarioInfoCompacto">
              <div className="adminSidebar__avatar">
                {usuarioNombre
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="adminSidebar__usuarioInfo">
                <span
                  className="adminSidebar__usuarioNombre"
                  title={
                    usuarioNombre
                  }
                >
                  {usuarioNombre}
                </span>

                {rolActual && (
                  <span className="adminSidebar__usuarioRol">
                    {rolActual.nombre ||
                      'Sin rol'}
                  </span>
                )}
              </div>
            </div>


            <button
              type="button"
              onClick={
                manejarCerrarSesion
              }
              className="adminSidebar__btnLogoutIcono"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut
                size={20}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


export default BarraLateralAdmin;
