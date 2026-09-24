import { useEffect, useState } from 'react';
import {
  suscribirCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria
} from '../../servicios/admin/categoriasServicio';

import {
  subirGuiaTallasCategoria,
  eliminarImagenStorage,
  eliminarArchivoPorUrl
} from '../../servicios/admin/storageServicio';

import Swal from 'sweetalert2';
import '../../estilos/adminestilos.css';

function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    estado: true,
    guia_tallas_url: '',
    guia_tallas_ruta: ''
  });

  const [archivoGuia, setArchivoGuia] = useState(null);
  const [previewGuia, setPreviewGuia] = useState('');
  const [quitarGuia, setQuitarGuia] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const unsubscribe = suscribirCategorias((data) => {
      setCategorias(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (previewGuia?.startsWith('blob:')) {
        URL.revokeObjectURL(previewGuia);
      }
    };
  }, [previewGuia]);

  const generarIdCategoria = (nombre) => {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  };

  const manejarArchivoGuia = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      Swal.fire({
        title: 'Archivo no válido',
        text: 'Debes seleccionar una imagen.',
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff3b3b'
      });

      e.target.value = '';
      return;
    }

    if (previewGuia?.startsWith('blob:')) {
      URL.revokeObjectURL(previewGuia);
    }

    setArchivoGuia(archivo);
    setPreviewGuia(URL.createObjectURL(archivo));
    setQuitarGuia(false);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) return;

    setGuardando(true);

    try {
      const categoriaId = modoEdicion
        ? formData.id
        : generarIdCategoria(formData.nombre);

      const urlAnterior = formData.guia_tallas_url || '';
      const rutaAnterior = formData.guia_tallas_ruta || '';

      let nuevaUrl = quitarGuia
        ? ''
        : urlAnterior;

      let nuevaRuta = quitarGuia
        ? ''
        : rutaAnterior;

      let nuevaImagenSubida = false;

      if (archivoGuia) {
        const resultado = await subirGuiaTallasCategoria(
          categoriaId,
          archivoGuia
        );

        nuevaUrl = resultado.url;
        nuevaRuta = resultado.ruta;
        nuevaImagenSubida = true;
      }

      const datosCategoria = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estado: formData.estado,
        guia_tallas_url: nuevaUrl,
        guia_tallas_ruta: nuevaRuta
      };

      if (modoEdicion) {
        await editarCategoria(
          formData.id,
          datosCategoria
        );
      } else {
        await crearCategoria(datosCategoria);
      }

      // Si reemplazamos la imagen o la quitamos,
      // eliminamos la imagen anterior después de guardar Firestore.
      if (
        modoEdicion &&
        (nuevaImagenSubida || quitarGuia) &&
        urlAnterior
      ) {
        try {
          if (rutaAnterior) {
            await eliminarImagenStorage(rutaAnterior);
          } else {
            // Compatibilidad con guías antiguas
            // que solo tienen guia_tallas_url.
            await eliminarArchivoPorUrl(urlAnterior);
          }
        } catch (error) {
          console.warn(
            'No se pudo eliminar la guía anterior:',
            error
          );
        }
      }

      await Swal.fire({
        title: modoEdicion
          ? '¡Actualizada!'
          : '¡Guardada!',
        text: modoEdicion
          ? 'La categoría fue actualizada correctamente.'
          : 'La categoría fue creada correctamente.',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff3b3b'
      });

      limpiarFormulario();
    } catch (error) {
      console.error(
        'Error guardando categoría:',
        error
      );

      Swal.fire({
        title: 'Error',
        text:
          error.message ||
          'No se pudo guardar la categoría.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff3b3b'
      });
    } finally {
      setGuardando(false);
    }
  };

  const editar = (cat) => {
    const esActivo =
      cat.estado === true ||
      cat.estado === 'activo';

    if (previewGuia?.startsWith('blob:')) {
      URL.revokeObjectURL(previewGuia);
    }

    setFormData({
      id: cat.id,
      nombre: cat.nombre || '',
      descripcion: cat.descripcion || '',
      estado: esActivo,
      guia_tallas_url:
        cat.guia_tallas_url || '',
      guia_tallas_ruta:
        cat.guia_tallas_ruta || ''
    });

    setArchivoGuia(null);
    setPreviewGuia(
      cat.guia_tallas_url || ''
    );

    setQuitarGuia(false);
    setModoEdicion(true);
  };

  const quitarGuiaActual = async () => {
    if (
      !previewGuia &&
      !formData.guia_tallas_url
    ) {
      return;
    }

    const result = await Swal.fire({
      title: '¿Quitar guía de tallas?',
      text: 'Al actualizar, esta categoría quedará sin guía.',
      icon: 'warning',
      showCancelButton: true,
      background: '#1a1a1a',
      color: '#fff',
      confirmButtonColor: '#ff3b3b',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    if (previewGuia?.startsWith('blob:')) {
      URL.revokeObjectURL(previewGuia);
    }

    setArchivoGuia(null);
    setPreviewGuia('');
    setQuitarGuia(true);
  };

  const eliminar = async (cat) => {
    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Se borrará permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      background: '#1a1a1a',
      color: '#fff',
      confirmButtonColor: '#ff3b3b',
      cancelButtonColor: '#333',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await eliminarCategoria(cat.id);

      if (cat.guia_tallas_url) {
        try {
          if (cat.guia_tallas_ruta) {
            await eliminarImagenStorage(
              cat.guia_tallas_ruta
            );
          } else {
            await eliminarArchivoPorUrl(
              cat.guia_tallas_url
            );
          }
        } catch (error) {
          console.warn(
            'No se pudo eliminar la guía de Storage:',
            error
          );
        }
      }

      await Swal.fire({
        title: '¡Eliminada!',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff3b3b'
      });

      if (
        modoEdicion &&
        formData.id === cat.id
      ) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error(
        'Error eliminando categoría:',
        error
      );

      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la categoría.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ff3b3b'
      });
    }
  };

  const limpiarFormulario = () => {
    if (previewGuia?.startsWith('blob:')) {
      URL.revokeObjectURL(previewGuia);
    }

    setFormData({
      id: '',
      nombre: '',
      descripcion: '',
      estado: true,
      guia_tallas_url: '',
      guia_tallas_ruta: ''
    });

    setArchivoGuia(null);
    setPreviewGuia('');
    setQuitarGuia(false);
    setModoEdicion(false);
  };

  const categoriasFiltradas =
    categorias.filter((c) => {
      const nombre = c.nombre || '';

      const coincideBusqueda =
        nombre
          .toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const esActivo =
        c.estado === true ||
        c.estado === 'activo';

      if (filtroEstado === 'Activos') {
        return coincideBusqueda && esActivo;
      }

      if (filtroEstado === 'Inactivos') {
        return coincideBusqueda && !esActivo;
      }

      return coincideBusqueda;
    });

  return (
    <div
      className="contenedor"
      style={{ padding: '2rem 0' }}
    >
      <h2 className="admin-header-title">
        Gestión de Categorías
      </h2>

      <div className="admin-grid">
        <div>
          <div className="admin-toolbar">

            <div
              className="grupo-input admin-search"
              style={{ marginBottom: 0 }}
            >
              <label>
                Buscar categoría
              </label>

              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
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
              <label>Estado</label>

              <select
                value={filtroEstado}
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
                    '1px solid rgba(255, 255, 255, 0.15)'
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
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Guía de tallas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categoriasFiltradas.map(
                  (cat) => {
                    const esActivo =
                      cat.estado === true ||
                      cat.estado === 'activo';

                    return (
                      <tr key={cat.id}>

                        <td
                          style={{
                            fontWeight: 'bold'
                          }}
                        >
                          {cat.nombre}
                        </td>

                        <td
                          style={{
                            fontSize: '0.85rem',
                            color: '#aaa'
                          }}
                        >
                          {cat.descripcion || '-'}
                        </td>

                        <td>
                          {cat.guia_tallas_url ? (
                            <a
                              href={
                                cat.guia_tallas_url
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#fff',
                                textDecoration:
                                  'underline'
                              }}
                            >
                              Ver guía
                            </a>
                          ) : (
                            <span
                              style={{
                                color: '#777',
                                fontSize: '0.85rem'
                              }}
                            >
                              Sin guía
                            </span>
                          )}
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
                            onClick={() =>
                              editar(cat)
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
                            onClick={() =>
                              eliminar(cat)
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

                {categoriasFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: 'center',
                        color: '#888'
                      }}
                    >
                      No se encontraron categorías
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
              ? 'Editar Categoría'
              : 'Nueva Categoría'}
          </h3>

          <form onSubmit={manejarSubmit}>

            <div className="grupo-input">
              <label>Nombre</label>

              <input
                required
                type="text"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre: e.target.value
                  })
                }
              />
            </div>

            <div className="grupo-input">
              <label>
                Descripción (Opcional)
              </label>

              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcion:
                      e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  background:
                    'rgba(10,10,12,0.6)',
                  border:
                    '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  resize: 'vertical'
                }}
                rows="3"
              />
            </div>

            <div className="grupo-input">

              <label>
                Guía de tallas
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  manejarArchivoGuia
                }
              />

              <small
                style={{
                  display: 'block',
                  marginTop: '6px',
                  color: '#888'
                }}
              >
                Selecciona la imagen de la guía
                correspondiente a esta categoría.
              </small>

            </div>

            {previewGuia && (
              <div
                style={{
                  marginBottom: '1.5rem'
                }}
              >
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    color: '#ccc',
                    fontWeight: 600
                  }}
                >
                  Vista previa
                </label>

                <div
                  style={{
                    background: '#fff',
                    padding: '10px',
                    borderRadius: '8px'
                  }}
                >
                  <img
                    src={previewGuia}
                    alt="Guía de tallas"
                    style={{
                      width: '100%',
                      maxHeight: '280px',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={
                    quitarGuiaActual
                  }
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '0.7rem',
                    border:
                      '1px solid #ff3b3b',
                    borderRadius: '6px',
                    background: 'transparent',
                    color: '#ff3b3b',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  QUITAR GUÍA
                </button>
              </div>
            )}

            <div className="switch-container">
              <label
                style={{
                  fontSize: '0.85rem',
                  color: '#ccc',
                  fontWeight: 600
                }}
              >
                Activo
              </label>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={formData.estado}
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
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem'
              }}
            >
              <button
                type="submit"
                className="btn--block"
                disabled={guardando}
                style={{
                  flex: 1,
                  marginTop: 0,
                  opacity:
                    guardando ? 0.7 : 1
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
                  onClick={limpiarFormulario}
                  className="btn--block"
                  disabled={guardando}
                  style={{
                    flex: 1,
                    marginTop: 0,
                    background: '#333'
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

export default GestionCategorias;