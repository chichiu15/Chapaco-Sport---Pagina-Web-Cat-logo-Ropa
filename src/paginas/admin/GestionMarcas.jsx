import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  suscribirMarcas,
  crearMarca,
  editarMarca,
  eliminarMarca,
  generarIdMarca
} from '../../servicios/admin/marcasServicio';

import {
  subirLogoMarca,
  eliminarImagenStorage,
  obtenerLogoMarcaExistente
} from '../../servicios/admin/storageServicio';

import '../../estilos/adminestilos.css';

import Swal from 'sweetalert2';


const marcaEstaActiva = (
  marca
) => {
  const estado =
    marca?.estado ??
    marca?.activo;

  if (
    estado === undefined ||
    estado === null ||
    estado === ''
  ) {
    return true;
  }

  if (
    typeof estado ===
    'boolean'
  ) {
    return estado;
  }

  if (
    typeof estado ===
    'number'
  ) {
    return estado !== 0;
  }

  const valor =
    String(estado)
      .trim()
      .toLowerCase();

  return ![
    'false',
    'inactivo',
    'inactiva',
    '0',
    'desactivado',
    'desactivada'
  ].includes(valor);
};


function GestionMarcas() {
  const [
    marcas,
    setMarcas
  ] = useState([]);

  const [
    busqueda,
    setBusqueda
  ] = useState('');

  const [
    filtroEstado,
    setFiltroEstado
  ] = useState('Todos');

  const [
    formData,
    setFormData
  ] = useState({
    id: '',
    nombre: '',
    estado: true,
    logo: '',
    logoRuta: ''
  });

  const [
    archivoLogo,
    setArchivoLogo
  ] = useState(null);

  const [
    logoPreview,
    setLogoPreview
  ] = useState('');

  const [
    modoEdicion,
    setModoEdicion
  ] = useState(false);

  const [
    guardando,
    setGuardando
  ] = useState(false);

  const [
    migrandoLogos,
    setMigrandoLogos
  ] = useState(false);

  /*
    Evita buscar el mismo logo
    continuamente mientras onSnapshot
    actualiza Firestore.
  */

  const marcasRevisadasRef =
    useRef(
      new Set()
    );


  // ======================================================
  // ESCUCHAR MARCAS
  // ======================================================

  useEffect(() => {
    const unsubscribe =
      suscribirMarcas(
        (data) => {
          setMarcas(
            data
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);


  // ======================================================
  // MIGRAR LOGOS ANTIGUOS AUTOMÁTICAMENTE
  // ======================================================

  useEffect(() => {
    if (
      marcas.length === 0 ||
      migrandoLogos
    ) {
      return;
    }

    const migrarLogos =
      async () => {
        setMigrandoLogos(
          true
        );

        try {
          for (
            const marca of marcas
          ) {
            /*
              Si ya tiene logo en Firestore,
              no hacemos absolutamente nada.
            */

            if (
              marca.logo &&
              marca.logoRuta
            ) {
              marcasRevisadasRef.current.add(
                marca.id
              );

              continue;
            }

            /*
              Si ya buscamos esta marca
              durante esta sesión, no repetimos.
            */

            if (
              marcasRevisadasRef.current.has(
                marca.id
              )
            ) {
              continue;
            }

            marcasRevisadasRef.current.add(
              marca.id
            );

            try {
              const logoEncontrado =
                await obtenerLogoMarcaExistente(
                  marca.id,
                  marca.logoRuta || ''
                );

              if (
                !logoEncontrado
              ) {
                continue;
              }

              await editarMarca(
                marca.id,
                {
                  nombre:
                    marca.nombre ||
                    marca.id,

                  estado:
                    marcaEstaActiva(
                      marca
                    ),

                  logo:
                    logoEncontrado.url,

                  logoRuta:
                    logoEncontrado.ruta
                }
              );

            } catch (
              errorMarca
            ) {
              console.warn(
                `No se pudo migrar el logo de ${marca.id}:`,
                errorMarca
              );
            }
          }

        } finally {
          setMigrandoLogos(
            false
          );
        }
      };

    migrarLogos();

  }, [
    marcas,
    migrandoLogos
  ]);


  // ======================================================
  // LIMPIAR URL TEMPORAL
  // ======================================================

  useEffect(() => {
    return () => {
      if (
        logoPreview &&
        logoPreview.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          logoPreview
        );
      }
    };
  }, [
    logoPreview
  ]);


  // ======================================================
  // SELECCIONAR LOGO
  // ======================================================

  const manejarCambioLogo = (
    e
  ) => {
    const archivo =
      e.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {
      Swal.fire({
        title:
          'Archivo inválido',

        text:
          'Debes seleccionar una imagen.',

        icon:
          'warning',

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b'
      });

      e.target.value = '';

      return;
    }

    if (
      archivo.size >
      5 * 1024 * 1024
    ) {
      Swal.fire({
        title:
          'Imagen demasiado grande',

        text:
          'El logo debe pesar como máximo 5 MB.',

        icon:
          'warning',

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b'
      });

      e.target.value = '';

      return;
    }

    setArchivoLogo(
      archivo
    );

    setLogoPreview(
      URL.createObjectURL(
        archivo
      )
    );
  };


  // ======================================================
  // GUARDAR
  // ======================================================

  const manejarSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (guardando) {
      return;
    }

    const nombre =
      formData.nombre.trim();

    if (!nombre) {
      return;
    }

    try {
      setGuardando(
        true
      );

      // ==================================================
      // EDICIÓN
      // ==================================================

      if (modoEdicion) {
        let logoFinal =
          formData.logo || '';

        let logoRutaFinal =
          formData.logoRuta || '';

        if (archivoLogo) {
          const resultadoLogo =
            await subirLogoMarca(
              formData.id,
              archivoLogo,
              formData.logoRuta
            );

          logoFinal =
            resultadoLogo.url;

          logoRutaFinal =
            resultadoLogo.ruta;
        }

        await editarMarca(
          formData.id,
          {
            nombre,

            estado:
              formData.estado,

            logo:
              logoFinal,

            logoRuta:
              logoRutaFinal
          }
        );

        await Swal.fire({
          title:
            '¡Actualizado!',

          text:
            archivoLogo
              ? 'La marca y su logo fueron actualizados correctamente.'
              : 'La marca fue actualizada correctamente.',

          icon:
            'success',

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#ff3b3b'
        });

      } else {
        // ==================================================
        // NUEVA MARCA
        // ==================================================

        if (!archivoLogo) {
          await Swal.fire({
            title:
              'Logo requerido',

            text:
              'Selecciona el logo de la nueva marca.',

            icon:
              'warning',

            background:
              '#1a1a1a',

            color:
              '#fff',

            confirmButtonColor:
              '#ff3b3b'
          });

          return;
        }

        const idGenerado =
          generarIdMarca(
            nombre
          );

        const yaExiste =
          marcas.some(
            (marca) =>
              marca.id ===
              idGenerado
          );

        if (yaExiste) {
          await Swal.fire({
            title:
              'La marca ya existe',

            text:
              'Ya existe una marca con ese nombre.',

            icon:
              'warning',

            background:
              '#1a1a1a',

            color:
              '#fff',

            confirmButtonColor:
              '#ff3b3b'
          });

          return;
        }

        const resultadoLogo =
          await subirLogoMarca(
            idGenerado,
            archivoLogo
          );

        try {
          await crearMarca({
            nombre,

            estado:
              formData.estado,

            logo:
              resultadoLogo.url,

            logoRuta:
              resultadoLogo.ruta
          });

        } catch (errorCrear) {
          try {
            await eliminarImagenStorage(
              resultadoLogo.ruta
            );
          } catch (
            errorLimpiar
          ) {
            console.warn(
              'No se pudo limpiar el logo:',
              errorLimpiar
            );
          }

          throw errorCrear;
        }

        await Swal.fire({
          title:
            '¡Guardado!',

          text:
            'La marca y su logo fueron creados correctamente.',

          icon:
            'success',

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#ff3b3b'
        });
      }

      limpiarFormulario();

    } catch (error) {
      console.error(
        'Error al guardar la marca:',
        error
      );

      Swal.fire({
        title:
          'Error',

        text:
          error?.message ||
          'No se pudo guardar la marca.',

        icon:
          'error',

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b'
      });

    } finally {
      setGuardando(
        false
      );
    }
  };


  // ======================================================
  // EDITAR
  // ======================================================

  const editar = (
    marca
  ) => {
    setFormData({
      id:
        marca.id,

      nombre:
        marca.nombre || '',

      estado:
        marcaEstaActiva(
          marca
        ),

      logo:
        marca.logo || '',

      logoRuta:
        marca.logoRuta || ''
    });

    setArchivoLogo(
      null
    );

    setLogoPreview(
      marca.logo || ''
    );

    setModoEdicion(
      true
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  // ======================================================
  // ELIMINAR
  // ======================================================

  const eliminar = async (
    marca
  ) => {
    const result =
      await Swal.fire({
        title:
          '¿Eliminar marca?',

        text:
          'Se eliminará la marca y también su logo de Firebase Storage.',

        icon:
          'warning',

        showCancelButton:
          true,

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b',

        cancelButtonColor:
          '#333',

        confirmButtonText:
          'Sí, eliminar',

        cancelButtonText:
          'Cancelar'
      });

    if (
      !result.isConfirmed
    ) {
      return;
    }

    try {
      await eliminarMarca(
        marca.id
      );

      if (marca.logoRuta) {
        try {
          await eliminarImagenStorage(
            marca.logoRuta
          );
        } catch (
          errorStorage
        ) {
          console.warn(
            'La marca se eliminó, pero no se pudo borrar el logo:',
            errorStorage
          );
        }
      }

      await Swal.fire({
        title:
          '¡Eliminado!',

        text:
          'La marca ha sido borrada con éxito.',

        icon:
          'success',

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b'
      });

      if (
        modoEdicion &&
        formData.id ===
        marca.id
      ) {
        limpiarFormulario();
      }

    } catch (error) {
      console.error(
        'Error eliminando marca:',
        error
      );

      Swal.fire({
        title:
          'Error',

        text:
          'No se pudo eliminar la marca.',

        icon:
          'error',

        background:
          '#1a1a1a',

        color:
          '#fff',

        confirmButtonColor:
          '#ff3b3b'
      });
    }
  };


  // ======================================================
  // LIMPIAR FORMULARIO
  // ======================================================

  const limpiarFormulario = () => {
    setFormData({
      id: '',
      nombre: '',
      estado: true,
      logo: '',
      logoRuta: ''
    });

    setArchivoLogo(
      null
    );

    setLogoPreview(
      ''
    );

    setModoEdicion(
      false
    );
  };


  // ======================================================
  // FILTRADO
  // ======================================================

  const marcasFiltradas =
    marcas.filter(
      (marca) => {
        const nombre =
          marca.nombre || '';

        const coincideBusqueda =
          nombre
            .toLowerCase()
            .includes(
              busqueda
                .toLowerCase()
            );

        const esActivo =
          marcaEstaActiva(
            marca
          );

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
        padding: '2rem 0'
      }}
    >
      <h2 className="admin-header-title">
        Gestión de Marcas
      </h2>

      <div className="admin-grid">

        <div>

          <div className="admin-toolbar">

            <div
              className="grupo-input admin-search"
              style={{
                marginBottom: 0
              }}
            >
              <label>
                Buscar marca
              </label>

              <input
                type="text"
                placeholder="Ej. Nike, Adidas..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(
                    e.target.value
                  )
                }
              />
            </div>

            <div
              className="grupo-input"
              style={{
                marginBottom: 0,
                width: '150px'
              }}
            >
              <label>
                Estado
              </label>

              <select
                value={
                  filtroEstado
                }
                onChange={(e) =>
                  setFiltroEstado(
                    e.target.value
                  )
                }
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  background:
                    'rgba(10, 10, 12, 0.6)',
                  color: '#fff',
                  border:
                    '1px solid rgba(255,255,255,0.15)'
                }}
              >
                <option value="Todos">
                  Todos
                </option>

                <option value="Activos">
                  Activos
                </option>

                <option value="Inactivos">
                  Inactivos
                </option>
              </select>
            </div>

          </div>


          <div className="admin-table-container">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {marcasFiltradas.map(
                  (marca) => {
                    const esActivo =
                      marcaEstaActiva(
                        marca
                      );

                    return (
                      <tr
                        key={
                          marca.id
                        }
                      >

                        <td>
                          {marca.logo ? (
                            <div
                              style={{
                                width: '64px',
                                height: '48px',
                                display: 'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                padding: '6px',
                                boxSizing:
                                  'border-box',
                                borderRadius:
                                  '8px',
                                background:
                                  'rgba(255,255,255,0.06)',
                                border:
                                  '1px solid rgba(255,255,255,0.1)'
                              }}
                            >
                              <img
                                src={
                                  marca.logo
                                }
                                alt={`Logo ${marca.nombre}`}
                                style={{
                                  width:
                                    '100%',
                                  height:
                                    '100%',
                                  objectFit:
                                    'contain'
                                }}
                              />
                            </div>
                          ) : (
                            <span
                              style={{
                                color:
                                  '#777',
                                fontSize:
                                  '0.75rem'
                              }}
                            >
                              SIN LOGO
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            fontWeight:
                              'bold'
                          }}
                        >
                          {marca.nombre}
                        </td>

                        <td>
                          <span
                            className={`badge-estado ${
                              esActivo
                                ? 'badge-activo'
                                : 'badge-inactivo'
                            }`}
                          >
                            {esActivo
                              ? 'ACTIVO'
                              : 'INACTIVO'}
                          </span>
                        </td>

                        <td className="acciones-td">

                          <button
                            type="button"
                            onClick={() =>
                              editar(
                                marca
                              )
                            }
                            className="btn-icon"
                            title="Editar"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>

                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              eliminar(
                                marca
                              )
                            }
                            className="btn-icon btn-icon--delete"
                            title="Eliminar"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>

                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

                {marcasFiltradas.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign:
                          'center',
                        color:
                          '#888'
                      }}
                    >
                      No se encontraron marcas
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>


        <aside className="admin-form-panel">

          <h3>
            {modoEdicion
              ? 'Editar Marca'
              : 'Nueva Marca'}
          </h3>

          <form
            onSubmit={
              manejarSubmit
            }
          >

            <div className="grupo-input">

              <label>
                Nombre Marca
              </label>

              <input
                required
                type="text"
                value={
                  formData.nombre
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre:
                      e.target.value
                  })
                }
                placeholder="Ej. Adidas"
              />

            </div>


            <div className="grupo-input">

              <label>
                Logo de la marca
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  manejarCambioLogo
                }
              />

              <small
                style={{
                  display:
                    'block',
                  marginTop:
                    '0.5rem',
                  color:
                    '#888',
                  lineHeight:
                    '1.4'
                }}
              >
                {modoEdicion
                  ? 'Selecciona otro logo solamente si deseas reemplazar el actual.'
                  : 'Selecciona el logo que aparecerá en la tienda.'}
              </small>

            </div>


            {logoPreview && (
              <div
                style={{
                  marginTop:
                    '1rem',
                  marginBottom:
                    '1.25rem'
                }}
              >
                <span
                  style={{
                    display:
                      'block',
                    marginBottom:
                      '0.6rem',
                    fontSize:
                      '0.78rem',
                    fontWeight:
                      600,
                    color:
                      '#aaa'
                  }}
                >
                  VISTA PREVIA
                </span>

                <div
                  style={{
                    width:
                      '100%',
                    minHeight:
                      '120px',
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    padding:
                      '1rem',
                    boxSizing:
                      'border-box',
                    background:
                      'rgba(255,255,255,0.04)',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    borderRadius:
                      '8px'
                  }}
                >
                  <img
                    src={
                      logoPreview
                    }
                    alt="Vista previa del logo"
                    style={{
                      width:
                        '100%',
                      maxWidth:
                        '220px',
                      height:
                        '100px',
                      objectFit:
                        'contain'
                    }}
                  />
                </div>
              </div>
            )}


            <div className="switch-container">

              <label
                style={{
                  fontSize:
                    '0.85rem',
                  color:
                    '#ccc',
                  fontWeight:
                    600
                }}
              >
                Activo
              </label>

              <label className="switch-status">

                <input
                  type="checkbox"
                  checked={
                    formData.estado
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado:
                        e.target.checked
                    })
                  }
                />

                <span className="slider-status"></span>

              </label>

            </div>


            <div
              style={{
                display:
                  'flex',
                gap:
                  '1rem',
                marginTop:
                  '1.5rem'
              }}
            >

              <button
                type="submit"
                className="btn--block"
                disabled={
                  guardando
                }
                style={{
                  flex: 1,
                  marginTop: 0,
                  opacity:
                    guardando
                      ? 0.6
                      : 1
                }}
              >
                {guardando
                  ? 'GUARDANDO...'
                  : modoEdicion
                    ? 'ACTUALIZAR'
                    : 'GUARDAR'}
              </button>

              {modoEdicion && (
                <button
                  type="button"
                  onClick={
                    limpiarFormulario
                  }
                  className="btn--block"
                  disabled={
                    guardando
                  }
                  style={{
                    flex: 1,
                    marginTop: 0,
                    background:
                      '#333',
                    color:
                      '#fff'
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


export default GestionMarcas;