import {
  lazy,
  Suspense,
  useEffect,
} from 'react';

import {
  Routes,
  Route,
} from 'react-router-dom';

import CargandoPagina from '../componentes/comun/CargandoPagina';

import RutaPrivada from './RutaPrivada';

import RutaPermiso from './RutaPermiso';

import LayoutAdmin from '../componentes/admin/LayoutAdmin';

import ProveedorPermisosAdmin from '../contextos/ContextoPermisosAdmin';


const IniciarSesion =
  lazy(
    () =>
      import(
        '../paginas/admin/IniciarSesion'
      )
  );

const GestionCategorias =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionCategorias'
      )
  );

const GestionMarcas =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionMarcas'
      )
  );

const GestionUsuarios =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionUsuarios'
      )
  );

const GestionProductos =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionProductos'
      )
  );

const GestionRoles =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionRoles'
      )
  );

const GestionAnunciosBarra =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionAnunciosBarra'
      )
  );

const GestionCarrusel =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionCarrusel'
      )
  );

const GestionConfiguracionNegocio =
  lazy(
    () =>
      import(
        '../paginas/admin/GestionConfiguracionNegocio'
      )
  );

const GestionPromociones =
  lazy(() => import('../paginas/admin/GestionPromociones'));

const FormularioProducto =
  lazy(
    () =>
      import(
        '../componentes/admin/FormularioProducto'
      )
  );


const cargar = (
  componente
) => (
  <Suspense
    fallback={
      <CargandoPagina />
    }
  >
    {componente}
  </Suspense>
);


// ======================================================
// BLOQUEAR INDEXACIÓN DEL ÁREA ADMINISTRATIVA
// ======================================================

function BloqueoIndexacionAdmin() {
  useEffect(() => {
    let metaRobots =
      document.querySelector(
        'meta[name="robots"]'
      );


    const metaExistia =
      Boolean(
        metaRobots
      );


    const contenidoAnterior =
      metaRobots?.getAttribute(
        'content'
      ) || null;


    if (
      !metaRobots
    ) {
      metaRobots =
        document.createElement(
          'meta'
        );

      metaRobots.setAttribute(
        'name',
        'robots'
      );

      document.head.appendChild(
        metaRobots
      );
    }


    metaRobots.setAttribute(
      'content',
      'noindex, nofollow, noarchive'
    );


    return () => {
      if (
        !metaExistia
      ) {
        metaRobots.remove();

        return;
      }


      if (
        contenidoAnterior !==
        null
      ) {
        metaRobots.setAttribute(
          'content',
          contenidoAnterior
        );
      } else {
        metaRobots.removeAttribute(
          'content'
        );
      }
    };
  }, []);


  return null;
}


function RutasAdmin() {
  return (
    <>
      <BloqueoIndexacionAdmin />

      <Routes>

        {/* LOGIN */}

        <Route
          index
          element={
            cargar(
              <IniciarSesion />
            )
          }
        />


        {/* ADMIN AUTENTICADO */}

        <Route
          element={
            <RutaPrivada>
              <ProveedorPermisosAdmin>
                <LayoutAdmin />
              </ProveedorPermisosAdmin>
            </RutaPrivada>
          }
        >

          {/* PRODUCTOS */}

          <Route
            path="panel"
            element={
              <RutaPermiso permiso="productos_ver">
                {cargar(
                  <GestionProductos />
                )}
              </RutaPermiso>
            }
          />


          <Route
            path="productos/nuevo"
            element={
              <RutaPermiso permiso="productos_crear">
                {cargar(
                  <FormularioProducto />
                )}
              </RutaPermiso>
            }
          />


          <Route
            path="productos/editar/:idProducto"
            element={
              <RutaPermiso permiso="productos_editar">
                {cargar(
                  <FormularioProducto />
                )}
              </RutaPermiso>
            }
          />


          {/* CATEGORÍAS */}

          <Route
            path="categorias"
            element={
              <RutaPermiso permiso="categorias_gestionar">
                {cargar(
                  <GestionCategorias />
                )}
              </RutaPermiso>
            }
          />


          {/* MARCAS */}

          <Route
            path="marcas"
            element={
              <RutaPermiso permiso="marcas_gestionar">
                {cargar(
                  <GestionMarcas />
                )}
              </RutaPermiso>
            }
          />


          {/* USUARIOS */}

          <Route
            path="usuarios"
            element={
              <RutaPermiso permiso="usuarios_gestionar">
                {cargar(
                  <GestionUsuarios />
                )}
              </RutaPermiso>
            }
          />


          {/* ROLES */}

          <Route
            path="roles"
            element={
              <RutaPermiso permiso="roles_gestionar">
                {cargar(
                  <GestionRoles />
                )}
              </RutaPermiso>
            }
          />


          {/* ANUNCIOS */}

          <Route
            path="anuncios"
            element={
              <RutaPermiso permiso="anuncios_gestionar">
                {cargar(
                  <GestionAnunciosBarra />
                )}
              </RutaPermiso>
            }
          />


          {/* CARRUSEL */}

          <Route
            path="carrusel"
            element={
              <RutaPermiso permiso="carrusel_gestionar">
                {cargar(
                  <GestionCarrusel />
                )}
              </RutaPermiso>
            }
          />


          {/* CONFIGURACIÓN DEL NEGOCIO */}

          <Route
            path="promociones"
            element={
              <RutaPermiso permiso="promociones_gestionar">
                {cargar(<GestionPromociones />)}
              </RutaPermiso>
            }
          />

          <Route
            path="configuracion-negocio"
            element={
              <RutaPermiso permiso="configuracion_negocio_gestionar">
                {cargar(
                  <GestionConfiguracionNegocio />
                )}
              </RutaPermiso>
            }
          />

        </Route>
      </Routes>
    </>
  );
}


export default RutasAdmin;
