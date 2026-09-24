import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Edit3,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import Swal from 'sweetalert2';

import {
  crearRol,
  editarRol,
  eliminarRol,
  GRUPOS_PERMISOS,
  normalizarPermisosRol,
  PERMISOS_INICIALES,
  suscribirRoles,
} from '../../servicios/admin/rolesServicio';

import usarPermisosAdmin from '../../hooks/usarPermisosAdmin';

import '../../estilos/adminestilos.css';
import './AdminEstilos.css';


const estadoInicial = {
  id:
    '',

  nombre:
    '',

  estado:
    true,

  permisos: {
    ...PERMISOS_INICIALES,
  },
};


function GestionRoles() {
  const [
    roles,
    setRoles,
  ] =
    useState([]);

  const [
    formulario,
    setFormulario,
  ] =
    useState(
      estadoInicial
    );

  const [
    modoEdicion,
    setModoEdicion,
  ] =
    useState(false);

  const [
    procesando,
    setProcesando,
  ] =
    useState(false);

  const [
    busqueda,
    setBusqueda,
  ] =
    useState('');

  const [
    error,
    setError,
  ] =
    useState('');


  const {
    rolActual,
  } =
    usarPermisosAdmin();


  useEffect(() => {
    const desuscribir =
      suscribirRoles(
        (datos) => {
          setRoles(
            datos
          );
        }
      );


    return () =>
      desuscribir();
  }, []);


  const rolesFiltrados =
    useMemo(
      () => {
        const texto =
          busqueda
            .trim()
            .toLowerCase();


        if (
          !texto
        ) {
          return roles;
        }


        return roles.filter(
          (rol) =>
            rol.nombre
              ?.toLowerCase()
              .includes(
                texto
              )
        );
      },
      [
        roles,
        busqueda,
      ]
    );


  const limpiarFormulario =
    () => {
      setFormulario({
        ...estadoInicial,

        permisos: {
          ...PERMISOS_INICIALES,
        },
      });

      setModoEdicion(
        false
      );

      setError(
        ''
      );
    };


  const seleccionarRol =
    (rol) => {
      setFormulario({
        id:
          rol.id,

        nombre:
          rol.nombre ||
          '',

        /*
          Los roles viejos sin estado
          se consideran activos.
        */
        estado:
          rol.estado !==
          false,

        permisos:
          normalizarPermisosRol(
            rol
          ),
      });

      setModoEdicion(
        true
      );

      setError(
        ''
      );

      window.scrollTo({
        top:
          0,

        behavior:
          'smooth',
      });
    };


  const cambiarPermiso =
    (
      clave,
      activo
    ) => {
      setFormulario(
        (actual) => ({
          ...actual,

          permisos: {
            ...actual.permisos,

            [clave]:
              activo,
          },
        })
      );
    };


  const manejarEstado =
    (activo) => {
      /*
        Evita desactivar accidentalmente
        el rol con el que estamos conectados.
      */
      if (
        modoEdicion &&
        formulario.id ===
          rolActual?.id &&
        activo ===
          false
      ) {
        Swal.fire({
          title:
            'No puedes desactivar tu propio rol',

          text:
            'Asigna tu usuario a otro rol antes de desactivar este.',

          icon:
            'warning',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });

        return;
      }


      setFormulario(
        (actual) => ({
          ...actual,

          estado:
            activo,
        })
      );
    };


  const manejarGuardar =
    async (
      evento
    ) => {
      evento.preventDefault();

      setError(
        ''
      );


      if (
        !formulario.nombre.trim()
      ) {
        setError(
          'El nombre del rol es obligatorio.'
        );

        return;
      }


      if (
        modoEdicion &&
        formulario.id ===
          rolActual?.id &&
        formulario.permisos
          .roles_gestionar !==
          true
      ) {
        await Swal.fire({
          title:
            'Permiso obligatorio',

          text:
            'No puedes quitar a tu propio rol el permiso para gestionar roles.',

          icon:
            'warning',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });

        return;
      }


      const confirmacion =
        await Swal.fire({
          title:
            modoEdicion
              ? '¿Guardar rol?'
              : '¿Crear rol?',

          text:
            formulario.nombre.trim(),

          icon:
            'question',

          showCancelButton:
            true,

          confirmButtonText:
            modoEdicion
              ? 'Guardar cambios'
              : 'Crear rol',

          cancelButtonText:
            'Cancelar',

          confirmButtonColor:
            '#e4292f',

          cancelButtonColor:
            '#333333',

          background:
            '#1a1a1a',

          color:
            '#ffffff',

          reverseButtons:
            true,
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      try {
        setProcesando(
          true
        );


        if (
          modoEdicion
        ) {
          await editarRol(
            formulario.id,
            formulario
          );
        } else {
          await crearRol(
            formulario
          );
        }


        await Swal.fire({
          title:
            modoEdicion
              ? 'Rol actualizado'
              : 'Rol creado',

          icon:
            'success',

          timer:
            1400,

          showConfirmButton:
            false,

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });


        limpiarFormulario();
      } catch (
        err
      ) {
        console.error(
          err
        );

        setError(
          err.message ||
          'No se pudo guardar el rol.'
        );
      } finally {
        setProcesando(
          false
        );
      }
    };


  const manejarEliminar =
    async (
      rol
    ) => {
      if (
        rol.id ===
        rolActual?.id
      ) {
        await Swal.fire({
          title:
            'No puedes eliminar tu propio rol',

          text:
            'Primero debes asignar tu usuario a otro rol.',

          icon:
            'warning',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });

        return;
      }


      const confirmacion =
        await Swal.fire({
          title:
            '¿Eliminar rol?',

          html: `
            <p style="color:#bbb;">
              Se intentará eliminar
              <strong style="color:#fff;">
                ${rol.nombre}
              </strong>.
            </p>

            <p style="
              color:#888;
              font-size:13px;
              margin-top:8px;
            ">
              Si todavía tiene usuarios asignados,
              el sistema no permitirá eliminarlo.
            </p>
          `,

          icon:
            'warning',

          showCancelButton:
            true,

          confirmButtonText:
            'Eliminar',

          cancelButtonText:
            'Cancelar',

          confirmButtonColor:
            '#e4292f',

          cancelButtonColor:
            '#333333',

          background:
            '#1a1a1a',

          color:
            '#ffffff',

          reverseButtons:
            true,
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      try {
        await eliminarRol(
          rol.id
        );


        if (
          formulario.id ===
          rol.id
        ) {
          limpiarFormulario();
        }


        await Swal.fire({
          title:
            'Rol eliminado',

          icon:
            'success',

          timer:
            1300,

          showConfirmButton:
            false,

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });
      } catch (
        err
      ) {
        await Swal.fire({
          title:
            'No se pudo eliminar',

          text:
            err.message,

          icon:
            'error',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });
      }
    };


  return (
    <div
      className="contenedor"
      style={{
        padding:
          '2rem 0',
      }}
    >
      <div className="gestionRoles__cabecera">
        <div>
          <h1 className="admin-header-title">
            Roles y permisos
          </h1>

          <p className="gestionRoles__descripcion">
            Define qué puede hacer cada tipo
            de usuario dentro del panel.
          </p>
        </div>

        {modoEdicion && (
          <button
            type="button"
            className="gestionRoles__nuevo"
            onClick={
              limpiarFormulario
            }
          >
            <Plus
              size={16}
            />

            NUEVO ROL
          </button>
        )}
      </div>


      {error && (
        <div className="alerta alerta--error">
          {error}
        </div>
      )}


      <div className="admin-grid">
        <div>
          <div className="admin-toolbar">
            <div
              className="grupo-input admin-search"
              style={{
                marginBottom:
                  0,
              }}
            >
              <label>
                Buscar rol
              </label>

              <input
                type="search"
                placeholder="Nombre del rol..."
                value={
                  busqueda
                }
                onChange={
                  (evento) =>
                    setBusqueda(
                      evento.target.value
                    )
                }
              />
            </div>
          </div>


          <div className="gestionRoles__lista">
            {rolesFiltrados.map(
              (rol) => {
                const permisos =
                  normalizarPermisosRol(
                    rol
                  );


                const cantidadPermisos =
                  Object.values(
                    permisos
                  ).filter(
                    Boolean
                  ).length;


                const activo =
                  rol.estado !==
                  false;


                return (
                  <article
                    key={
                      rol.id
                    }
                    className={
                      `gestionRoles__tarjeta ${
                        formulario.id ===
                        rol.id
                          ? 'gestionRoles__tarjeta--seleccionada'
                          : ''
                      }`
                    }
                  >
                    <div className="gestionRoles__tarjetaIcono">
                      <ShieldCheck
                        size={22}
                      />
                    </div>


                    <div className="gestionRoles__tarjetaInfo">
                      <div className="gestionRoles__nombreFila">
                        <strong>
                          {rol.nombre ||
                            'Sin nombre'}
                        </strong>

                        <span
                          className={
                            `badge-estado ${
                              activo
                                ? 'badge-activo'
                                : 'badge-inactivo'
                            }`
                          }
                        >
                          {activo
                            ? 'ACTIVO'
                            : 'INACTIVO'}
                        </span>
                      </div>

                      <span>
                        {cantidadPermisos}{' '}
                        {cantidadPermisos ===
                        1
                          ? 'permiso habilitado'
                          : 'permisos habilitados'}
                      </span>
                    </div>


                    <div className="gestionRoles__acciones">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() =>
                          seleccionarRol(
                            rol
                          )
                        }
                        title="Editar rol"
                      >
                        <Edit3
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        className="btn-icon btn-icon--delete"
                        onClick={() =>
                          manejarEliminar(
                            rol
                          )
                        }
                        title="Eliminar rol"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>
                    </div>
                  </article>
                );
              }
            )}


            {rolesFiltrados.length ===
              0 && (
              <div className="admin-productos-vacio">
                No se encontraron roles.
              </div>
            )}
          </div>
        </div>


        <aside className="admin-form-panel gestionRoles__formulario">
          <h3>
            {modoEdicion
              ? 'Editar rol'
              : 'Nuevo rol'}
          </h3>


          <form
            onSubmit={
              manejarGuardar
            }
          >
            <div className="grupo-input">
              <label>
                Nombre del rol
              </label>

              <input
                required
                type="text"
                placeholder="Ej. Vendedor"
                value={
                  formulario.nombre
                }
                onChange={
                  (evento) =>
                    setFormulario(
                      (actual) => ({
                        ...actual,

                        nombre:
                          evento.target.value,
                      })
                    )
                }
              />
            </div>


            <div className="gestionRoles__estado">
              <div>
                <strong>
                  Rol activo
                </strong>

                <span>
                  Al desactivarlo todos sus
                  usuarios perderán acceso.
                </span>
              </div>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formulario.estado
                  }
                  onChange={
                    (evento) =>
                      manejarEstado(
                        evento.target.checked
                      )
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            <div className="gestionRoles__permisos">
              {GRUPOS_PERMISOS.map(
                (grupo) => (
                  <section
                    key={
                      grupo.titulo
                    }
                    className="gestionRoles__grupo"
                  >
                    <div className="gestionRoles__grupoCabecera">
                      <strong>
                        {grupo.titulo}
                      </strong>

                      <span>
                        {grupo.descripcion}
                      </span>
                    </div>


                    {grupo.permisos.map(
                      (
                        permiso
                      ) => (
                        <div
                          key={
                            permiso.clave
                          }
                          className="gestionRoles__permiso"
                        >
                          <div>
                            <strong>
                              {permiso.nombre}
                            </strong>

                            <span>
                              {permiso.descripcion}
                            </span>
                          </div>

                          <label className="switch-status">
                            <input
                              type="checkbox"
                              checked={
                                formulario
                                  .permisos[
                                  permiso
                                    .clave
                                ] ===
                                true
                              }
                              onChange={
                                (
                                  evento
                                ) =>
                                  cambiarPermiso(
                                    permiso.clave,
                                    evento
                                      .target
                                      .checked
                                  )
                              }
                            />

                            <span className="slider-status" />
                          </label>
                        </div>
                      )
                    )}
                  </section>
                )
              )}
            </div>


            <div className="gestionRoles__botones">
              <button
                type="submit"
                disabled={
                  procesando
                }
                className="btn--block"
              >
                {procesando
                  ? 'GUARDANDO...'
                  : modoEdicion
                    ? 'GUARDAR CAMBIOS'
                    : 'CREAR ROL'}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  onClick={
                    limpiarFormulario
                  }
                  className="gestionRoles__cancelar"
                >
                  CANCELAR
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}


export default GestionRoles;