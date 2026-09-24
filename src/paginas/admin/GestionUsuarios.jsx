import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Swal from 'sweetalert2';

import {
  crearUsuario,
  editarUsuario,
  suscribirUsuarios,
} from '../../servicios/admin/usuariosServicio';

import {
  suscribirRoles,
} from '../../servicios/admin/rolesServicio';

import '../../estilos/adminestilos.css';


const estadoInicial = {
  id:
    '',

  nombre:
    '',

  correo:
    '',

  contraseña:
    '',

  rol:
    '',

  estado:
    true,
};


function GestionUsuarios() {
  const [
    usuarios,
    setUsuarios,
  ] =
    useState([]);

  const [
    roles,
    setRoles,
  ] =
    useState([]);

  const [
    busqueda,
    setBusqueda,
  ] =
    useState('');

  const [
    filtroEstado,
    setFiltroEstado,
  ] =
    useState(
      'Todos'
    );

  const [
    error,
    setError,
  ] =
    useState('');

  const [
    formData,
    setFormData,
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


  useEffect(() => {
    const unsubUsuarios =
      suscribirUsuarios(
        (datos) =>
          setUsuarios(
            datos
          )
      );


    const unsubRoles =
      suscribirRoles(
        (datos) => {
          setRoles(
            datos
          );


          setFormData(
            (actual) => {
              /*
                Si ya está editando, no le
                cambiamos el rol seleccionado.
              */
              if (
                actual.rol
              ) {
                return actual;
              }


              const primerActivo =
                datos.find(
                  (rol) =>
                    rol.estado !==
                    false
                );


              return {
                ...actual,

                rol:
                  primerActivo?.id ||
                  '',
              };
            }
          );
        }
      );


    return () => {
      unsubUsuarios();
      unsubRoles();
    };
  }, []);


  const rolesActivos =
    useMemo(
      () =>
        roles.filter(
          (rol) =>
            rol.estado !==
            false
        ),
      [
        roles,
      ]
    );


  const limpiarFormulario =
    () => {
      setFormData({
        ...estadoInicial,

        rol:
          rolesActivos[
            0
          ]?.id ||
          '',
      });

      setModoEdicion(
        false
      );

      setError(
        ''
      );
    };


  const manejarSubmit =
    async (
      evento
    ) => {
      evento.preventDefault();

      setError(
        ''
      );


      if (
        !formData.rol
      ) {
        setError(
          'Debes seleccionar un rol activo.'
        );

        return;
      }


      const rolSeleccionado =
        roles.find(
          (rol) =>
            rol.id ===
            formData.rol
        );


      if (
        !modoEdicion &&
        rolSeleccionado?.estado ===
          false
      ) {
        setError(
          'No puedes asignar un rol inactivo a un usuario nuevo.'
        );

        return;
      }


      try {
        setProcesando(
          true
        );


        if (
          modoEdicion
        ) {
          await editarUsuario(
            formData.id,
            formData
          );
        } else {
          await crearUsuario(
            formData
          );
        }


        await Swal.fire({
          title:
            modoEdicion
              ? 'Usuario actualizado'
              : 'Usuario creado',

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
        setError(
          err.message ||
          'Hubo un error.'
        );
      } finally {
        setProcesando(
          false
        );
      }
    };


  const editar =
    (usuario) => {
      setFormData({
        id:
          usuario.id,

        nombre:
          usuario.nombre ||
          '',

        correo:
          usuario.correo ||
          '',

        contraseña:
          '',

        rol:
          usuario.rol ||
          '',

        estado:
          usuario.estado ===
          true,
      });

      setModoEdicion(
        true
      );
    };


  const filtrados =
    usuarios.filter(
      (usuario) => {
        const texto =
          busqueda.toLowerCase();


        const coincideBusqueda =
          usuario.nombre
            ?.toLowerCase()
            .includes(
              texto
            ) ||
          usuario.correo
            ?.toLowerCase()
            .includes(
              texto
            );


        const esActivo =
          usuario.estado ===
          true;


        if (
          filtroEstado ===
          'Activos'
        ) {
          return (
            coincideBusqueda &&
            esActivo
          );
        }


        if (
          filtroEstado ===
          'Inactivos'
        ) {
          return (
            coincideBusqueda &&
            !esActivo
          );
        }


        return coincideBusqueda;
      }
    );


  return (
    <div
      className="contenedor"
      style={{
        padding:
          '2rem 0',
      }}
    >
      <h2 className="admin-header-title">
        Gestión de Usuarios
      </h2>


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
                Buscar usuario
              </label>

              <input
                type="text"
                placeholder="Nombre o correo..."
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


            <div
              className="grupo-input"
              style={{
                marginBottom:
                  0,

                width:
                  '150px',
              }}
            >
              <label>
                Estado
              </label>

              <select
                value={
                  filtroEstado
                }
                onChange={
                  (evento) =>
                    setFiltroEstado(
                      evento.target.value
                    )
                }
                style={{
                  width:
                    '100%',

                  padding:
                    '0.85rem',

                  borderRadius:
                    '6px',

                  background:
                    'rgba(10,10,12,0.6)',

                  color:
                    '#fff',

                  border:
                    '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <option value="Todos">
                  Todos
                </option>

                <option value="Activos">
                  Activos
                </option>

                <option value="Inactivos">
                  Bloqueados
                </option>
              </select>
            </div>
          </div>


          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    Usuario
                  </th>

                  <th>
                    Rol
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Acciones
                  </th>
                </tr>
              </thead>


              <tbody>
                {filtrados.map(
                  (usuario) => {
                    const rol =
                      roles.find(
                        (item) =>
                          item.id ===
                          usuario.rol
                      );


                    const usuarioActivo =
                      usuario.estado ===
                      true;


                    const rolActivo =
                      rol &&
                      rol.estado !==
                        false;


                    const accesoEfectivo =
                      usuarioActivo &&
                      rolActivo;


                    return (
                      <tr
                        key={
                          usuario.id
                        }
                      >
                        <td>
                          <div
                            style={{
                              fontWeight:
                                'bold',
                            }}
                          >
                            {usuario.nombre}
                          </div>

                          <div
                            style={{
                              fontSize:
                                '0.8rem',

                              color:
                                '#aaa',
                            }}
                          >
                            {usuario.correo}
                          </div>
                        </td>


                        <td>
                          <div>
                            {rol?.nombre ||
                              'Rol inexistente'}
                          </div>

                          {rol &&
                            !rolActivo && (
                            <small
                              style={{
                                color:
                                  '#ff9800',
                              }}
                            >
                              ROL INACTIVO
                            </small>
                          )}
                        </td>


                        <td>
                          <span
                            className={
                              `badge-estado ${
                                accesoEfectivo
                                  ? 'badge-activo'
                                  : 'badge-inactivo'
                              }`
                            }
                          >
                            {accesoEfectivo
                              ? 'ACTIVO'
                              : !usuarioActivo
                                ? 'BLOQUEADO'
                                : 'SIN ACCESO POR ROL'}
                          </span>
                        </td>


                        <td className="acciones-td">
                          <button
                            type="button"
                            onClick={() =>
                              editar(
                                usuario
                              )
                            }
                            className="btn-icon"
                            title="Editar usuario"
                          >
                            ✎
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>


        <aside className="admin-form-panel">
          <h3>
            {modoEdicion
              ? 'Editar Usuario'
              : 'Nuevo Usuario'}
          </h3>


          <form
            onSubmit={
              manejarSubmit
            }
          >
            <div className="grupo-input">
              <label>
                Nombre
              </label>

              <input
                required
                type="text"
                value={
                  formData.nombre
                }
                onChange={
                  (evento) =>
                    setFormData({
                      ...formData,

                      nombre:
                        evento.target.value,
                    })
                }
              />
            </div>


            <div className="grupo-input">
              <label>
                Correo Electrónico
              </label>

              <input
                required
                disabled={
                  modoEdicion
                }
                type="email"
                value={
                  formData.correo
                }
                onChange={
                  (evento) =>
                    setFormData({
                      ...formData,

                      correo:
                        evento.target.value,
                    })
                }
              />
            </div>


            {!modoEdicion && (
              <div className="grupo-input">
                <label>
                  Contraseña
                </label>

                <input
                  required
                  type="password"
                  value={
                    formData.contraseña
                  }
                  onChange={
                    (evento) =>
                      setFormData({
                        ...formData,

                        contraseña:
                          evento.target.value,
                      })
                  }
                />
              </div>
            )}


            <div className="grupo-input">
              <label>
                Rol
              </label>

              <select
                required
                value={
                  formData.rol
                }
                onChange={
                  (evento) =>
                    setFormData({
                      ...formData,

                      rol:
                        evento.target.value,
                    })
                }
                style={{
                  width:
                    '100%',

                  padding:
                    '0.85rem',

                  borderRadius:
                    '6px',

                  background:
                    'rgba(10,10,12,0.6)',

                  border:
                    '1px solid rgba(255,255,255,0.15)',

                  color:
                    '#fff',
                }}
              >
                <option value="">
                  Selecciona un rol
                </option>


                {roles.map(
                  (rol) => {
                    const activo =
                      rol.estado !==
                      false;

                    const seleccionado =
                      formData.rol ===
                      rol.id;


                    if (
                      !activo &&
                      !seleccionado
                    ) {
                      return null;
                    }


                    return (
                      <option
                        key={
                          rol.id
                        }
                        value={
                          rol.id
                        }
                        disabled={
                          !activo
                        }
                      >
                        {rol.nombre}

                        {!activo
                          ? ' (inactivo)'
                          : ''}
                      </option>
                    );
                  }
                )}
              </select>

              <small
                style={{
                  color:
                    '#888',
                }}
              >
                Los roles inactivos no pueden asignarse a usuarios nuevos.
              </small>
            </div>


            <div className="switch-container">
              <label
                style={{
                  fontSize:
                    '0.85rem',

                  color:
                    '#ccc',

                  fontWeight:
                    600,
                }}
              >
                Activo (Permitir Acceso)
              </label>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formData.estado
                  }
                  onChange={
                    (evento) =>
                      setFormData({
                        ...formData,

                        estado:
                          evento.target.checked,
                      })
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            <div
              style={{
                display:
                  'flex',

                gap:
                  '1rem',

                marginTop:
                  '1.5rem',
              }}
            >
              <button
                type="submit"
                disabled={
                  procesando
                }
                className="btn--block"
                style={{
                  flex:
                    1,

                  marginTop:
                    0,
                }}
              >
                {procesando
                  ? '...'
                  : modoEdicion
                    ? 'ACTUALIZAR'
                    : 'CREAR'}
              </button>


              {modoEdicion && (
                <button
                  type="button"
                  onClick={
                    limpiarFormulario
                  }
                  className="btn--block"
                  style={{
                    flex:
                      1,

                    marginTop:
                      0,

                    background:
                      '#333',
                  }}
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


export default GestionUsuarios;