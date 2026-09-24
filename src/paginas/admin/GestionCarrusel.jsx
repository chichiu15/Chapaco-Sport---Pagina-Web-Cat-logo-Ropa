import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Swal from 'sweetalert2';

import {
  cambiarEstadoCarrusel,
  crearDiapositivaCarrusel,
  editarDiapositivaCarrusel,
  eliminarDiapositivaCarrusel,
  guardarOrdenCarrusel,
  suscribirCarruselAdmin,
} from '../../servicios/admin/carruselServicio';

import '../../estilos/adminestilos.css';
import './GestionCarrusel.css';


const FORMULARIO_INICIAL = {
  id: '',
  activo: true,
  descripcion: '',
  enlace: '/catalogo',
  enlaceBoton: '',
  ganchoDos: '',
  ganchoUno: '',
  imagenFondo: '',
  imagenFondoRuta: '',
  orden: 1,
  sintesis: '',
  tipoEnlace: 'interno',
};


function GestionCarrusel() {

  const [
    diapositivas,
    setDiapositivas,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState(
    FORMULARIO_INICIAL
  );

  const [
    archivoImagen,
    setArchivoImagen,
  ] = useState(null);

  const [
    previewImagenLocal,
    setPreviewImagenLocal,
  ] = useState('');

  const [
    modoEdicion,
    setModoEdicion,
  ] = useState(false);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    vistaPreviaAbierta,
    setVistaPreviaAbierta,
  ] = useState(false);


  // ======================================================
  // FIRESTORE
  // ======================================================

  useEffect(() => {

    const unsubscribe =
      suscribirCarruselAdmin(
        (datos) => {
          setDiapositivas(
            datos
          );

          setCargando(
            false
          );
        },

        () => {
          setCargando(
            false
          );
        }
      );


    return () =>
      unsubscribe();

  }, []);


  // ======================================================
  // LIMPIAR URL TEMPORAL
  // ======================================================

  useEffect(() => {

    return () => {

      if (
        previewImagenLocal &&
        previewImagenLocal.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          previewImagenLocal
        );
      }

    };

  }, [
    previewImagenLocal
  ]);


  // ======================================================
  // LIMPIAR FORMULARIO
  // ======================================================

  const limpiarFormulario =
    () => {

      setFormData({
        ...FORMULARIO_INICIAL,

        orden:
          diapositivas.length
            ? Math.max(
                ...diapositivas.map(
                  item =>
                    Number(
                      item.orden
                    ) || 0
                )
              ) + 1
            : 1,
      });


      setArchivoImagen(
        null
      );


      setPreviewImagenLocal(
        ''
      );


      setModoEdicion(
        false
      );


      setVistaPreviaAbierta(
        false
      );
    };


  // ======================================================
  // EDITAR
  // ======================================================

  const prepararEdicion =
    (
      diapositiva
    ) => {

      setFormData({
        id:
          diapositiva.id,

        activo:
          diapositiva.activo ===
          true,

        descripcion:
          diapositiva.descripcion ||
          '',

        enlace:
          diapositiva.enlace ||
          '',

        enlaceBoton:
          diapositiva.enlaceBoton ||
          '',

        ganchoDos:
          diapositiva.ganchoDos ||
          '',

        ganchoUno:
          diapositiva.ganchoUno ||
          '',

        imagenFondo:
          diapositiva.imagenFondo ||
          '',

        imagenFondoRuta:
          diapositiva.imagenFondoRuta ||
          '',

        orden:
          Number(
            diapositiva.orden
          ) || 1,

        sintesis:
          diapositiva.sintesis ||
          '',

        tipoEnlace:
          diapositiva.tipoEnlace ||
          'interno',
      });


      setArchivoImagen(
        null
      );


      setPreviewImagenLocal(
        diapositiva.imagenFondo ||
        ''
      );


      setModoEdicion(
        true
      );


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };


  // ======================================================
  // CAMBIO INPUT
  // ======================================================

  const manejarCambio =
    (
      evento
    ) => {

      const {
        name,
        value,
        checked,
        type,
      } = evento.target;


      let nuevoValor =
        type === 'checkbox'
          ? checked
          : value;


      if (
        name === 'orden'
      ) {
        nuevoValor =
          Number(
            value
          );
      }


      if (
        name ===
        'tipoEnlace'
      ) {

        setFormData(
          actual => ({
            ...actual,

            tipoEnlace:
              value,

            enlace:
              value ===
              'interno'
                ? '/catalogo'
                : '',
          })
        );

        return;
      }


      setFormData(
        actual => ({
          ...actual,

          [name]:
            nuevoValor,
        })
      );
    };


  // ======================================================
  // IMAGEN
  // ======================================================

  const manejarImagen =
    (
      evento
    ) => {

      const archivo =
        evento.target
          .files?.[0];


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
            'Selecciona una imagen.',

          icon:
            'warning',

          background:
            '#1a1a1a',

          color:
            '#fff',
        });

        evento.target.value =
          '';

        return;
      }


      if (
        archivo.size >
        10 * 1024 * 1024
      ) {

        Swal.fire({
          title:
            'Imagen demasiado grande',

          text:
            'La imagen debe pesar menos de 10 MB.',

          icon:
            'warning',

          background:
            '#1a1a1a',

          color:
            '#fff',
        });

        evento.target.value =
          '';

        return;
      }


      setArchivoImagen(
        archivo
      );


      const urlTemporal =
        URL.createObjectURL(
          archivo
        );


      setPreviewImagenLocal(
        urlTemporal
      );
    };


  // ======================================================
  // NORMALIZAR ENLACE INTERNO
  // ======================================================

  const normalizarEnlace =
    (
      enlace,
      tipo
    ) => {

      const valor =
        enlace.trim();


      if (
        tipo ===
        'externo'
      ) {
        return valor;
      }


      if (!valor) {
        return '/';
      }


      if (
        !valor.startsWith(
          '/'
        )
      ) {
        return `/${valor}`;
      }


      return valor;
    };


  // ======================================================
  // GUARDAR
  // ======================================================

  const manejarSubmit =
    async (
      evento
    ) => {

      evento.preventDefault();


      if (guardando) {
        return;
      }


      if (
        !modoEdicion &&
        !archivoImagen
      ) {

        Swal.fire({
          title:
            'Imagen requerida',

          text:
            'Selecciona la imagen de la diapositiva.',

          icon:
            'warning',

          background:
            '#1a1a1a',

          color:
            '#fff',
        });

        return;
      }


      if (
        formData.tipoEnlace ===
          'externo' &&
        formData.enlace.trim() &&
        !/^https?:\/\//i.test(
          formData.enlace.trim()
        )
      ) {

        Swal.fire({
          title:
            'Enlace externo inválido',

          text:
            'Debe comenzar con http:// o https://',

          icon:
            'warning',

          background:
            '#1a1a1a',

          color:
            '#fff',
        });

        return;
      }


      try {

        setGuardando(
          true
        );


        const datos = {
          ...formData,

          enlace:
            normalizarEnlace(
              formData.enlace,
              formData.tipoEnlace
            ),
        };


        if (
          modoEdicion
        ) {

          await editarDiapositivaCarrusel(
            formData.id,
            datos,
            archivoImagen,
            formData.imagenFondo,
            formData.imagenFondoRuta
          );

        } else {

          await crearDiapositivaCarrusel(
            datos,
            archivoImagen
          );
        }


        await Swal.fire({
          title:
            modoEdicion
              ? 'Diapositiva actualizada'
              : 'Diapositiva creada',

          icon:
            'success',

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#e4292f',

          timer:
            1200,

          showConfirmButton:
            false,
        });


        limpiarFormulario();


      } catch (error) {

        console.error(
          'Error guardando carrusel:',
          error
        );


        Swal.fire({
          title:
            'Error',

          text:
            error?.message ||
            'No se pudo guardar la diapositiva.',

          icon:
            'error',

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#e4292f',
        });

      } finally {

        setGuardando(
          false
        );
      }
    };


  // ======================================================
  // ELIMINAR
  // ======================================================

  const manejarEliminar =
    async (
      diapositiva
    ) => {

      const resultado =
        await Swal.fire({
          title:
            '¿Eliminar diapositiva?',

          text:
            diapositiva.sintesis ||
            diapositiva.ganchoUno,

          icon:
            'warning',

          showCancelButton:
            true,

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#e4292f',

          cancelButtonColor:
            '#333',

          confirmButtonText:
            'Sí, eliminar',

          cancelButtonText:
            'Cancelar',
        });


      if (
        !resultado.isConfirmed
      ) {
        return;
      }


      try {

        await eliminarDiapositivaCarrusel(
          diapositiva
        );


        await Swal.fire({
          title:
            '¡Eliminado!',

          text:
            'La diapositiva y su imagen fueron eliminadas.',

          icon:
            'success',

          background:
            '#1a1a1a',

          color:
            '#fff',

          confirmButtonColor:
            '#e4292f',

          timer:
            1200,

          showConfirmButton:
            false,
        });


        if (
          modoEdicion &&
          formData.id ===
            diapositiva.id
        ) {
          limpiarFormulario();
        }


      } catch (error) {

        console.error(
          'Error eliminando diapositiva:',
          error
        );


        Swal.fire({
          title:
            'Error',

          text:
            'No se pudo eliminar la diapositiva.',

          icon:
            'error',

          background:
            '#1a1a1a',

          color:
            '#fff',
        });
      }
    };


  // ======================================================
  // ESTADO
  // ======================================================

  const manejarEstado =
    async (
      diapositiva
    ) => {

      try {

        await cambiarEstadoCarrusel(
          diapositiva.id,
          !diapositiva.activo
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };


  // ======================================================
  // ORDEN
  // ======================================================

  const mover =
    async (
      indice,
      direccion
    ) => {

      const destino =
        direccion ===
        'arriba'
          ? indice - 1
          : indice + 1;


      if (
        destino < 0 ||
        destino >=
          diapositivas.length
      ) {
        return;
      }


      const nuevaLista =
        [
          ...diapositivas,
        ];


      [
        nuevaLista[
          indice
        ],
        nuevaLista[
          destino
        ],
      ] = [
        nuevaLista[
          destino
        ],
        nuevaLista[
          indice
        ],
      ];


      try {

        await guardarOrdenCarrusel(
          nuevaLista
        );

      } catch (error) {

        console.error(
          'Error cambiando orden:',
          error
        );
      }
    };


  // ======================================================
  // PREVIEW
  // ======================================================

  const preview =
    useMemo(
      () => ({
        ...formData,

        imagenFondo:
          previewImagenLocal ||
          formData.imagenFondo,
      }),
      [
        formData,
        previewImagenLocal,
      ]
    );


  if (cargando) {

    return (
      <div className="gestionCarrusel">
        Cargando carrusel...
      </div>
    );
  }


  return (
    <section className="gestionCarrusel">


      <div className="gestionCarrusel__encabezado">

        <div>

          <h1 className="admin-header-title">
            Gestión del Carrusel
          </h1>

          <p>
            Administra las diapositivas
            principales del Inicio.
          </p>

        </div>

      </div>


      <div className="gestionCarrusel__layout">


        {/* =======================================
            LISTADO
        ======================================= */}

        <div>

          <div className="admin-table-container">

            <table className="admin-table gestionCarrusel__tabla">

              <thead>

                <tr>
                  <th>Imagen</th>
                  <th>Contenido</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th>Ordenar</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {diapositivas.map(
                  (
                    diapositiva,
                    indice
                  ) => (

                    <tr
                      key={
                        diapositiva.id
                      }
                    >

                      <td>

                        <img
                          src={
                            diapositiva.imagenFondo
                          }
                          alt=""
                          className="gestionCarrusel__miniatura"
                        />

                      </td>


                      <td>

                        <div className="gestionCarrusel__contenidoTabla">

                          <strong>
                            {
                              diapositiva.ganchoUno
                            }
                          </strong>

                          <span>
                            {
                              diapositiva.sintesis
                            }
                          </span>

                        </div>

                      </td>


                      <td>

                        <div className="gestionCarrusel__destino">

                          <span>

                            {
                              diapositiva.tipoEnlace ===
                              'interno'
                                ? 'INTERNO'
                                : 'EXTERNO'
                            }

                          </span>

                          <small>
                            {
                              diapositiva.enlace
                            }
                          </small>

                        </div>

                      </td>


                      <td>

                        <button
                          type="button"
                          className={`gestionCarrusel__estado ${
                            diapositiva.activo
                              ? 'gestionCarrusel__estado--activo'
                              : 'gestionCarrusel__estado--inactivo'
                          }`}
                          onClick={() =>
                            manejarEstado(
                              diapositiva
                            )
                          }
                        >

                          {
                            diapositiva.activo
                              ? 'ACTIVO'
                              : 'INACTIVO'
                          }

                        </button>

                      </td>


                      <td>

                        <div className="gestionCarrusel__orden">

                          <button
                            type="button"
                            className="btn-icon"
                            disabled={
                              indice ===
                              0
                            }
                            onClick={() =>
                              mover(
                                indice,
                                'arriba'
                              )
                            }
                          >
                            ↑
                          </button>


                          <button
                            type="button"
                            className="btn-icon"
                            disabled={
                              indice ===
                              diapositivas.length -
                                1
                            }
                            onClick={() =>
                              mover(
                                indice,
                                'abajo'
                              )
                            }
                          >
                            ↓
                          </button>

                        </div>

                      </td>


                      <td>

                        <div className="gestionCarrusel__acciones">

                          <button
                            type="button"
                            className="btn-icon"
                            title="Editar"
                            onClick={() =>
                              prepararEdicion(
                                diapositiva
                              )
                            }
                          >
                            ✎
                          </button>


                          <button
                            type="button"
                            className="btn-icon btn-icon--delete"
                            title="Eliminar"
                            onClick={() =>
                              manejarEliminar(
                                diapositiva
                              )
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =======================================
            FORMULARIO
        ======================================= */}

        <aside className="gestionCarrusel__formulario">

          <h3>

            {
              modoEdicion
                ? 'EDITAR DIAPOSITIVA'
                : 'NUEVA DIAPOSITIVA'
            }

          </h3>


          <form
            onSubmit={
              manejarSubmit
            }
            className="gestionCarrusel__formGrid"
          >


            <div className="grupo-input">

              <label>
                Síntesis
              </label>

              <input
                required
                type="text"
                name="sintesis"
                value={
                  formData.sintesis
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: CATÁLOGO OFICIAL"
              />

              <small>
                Texto pequeño que presenta
                la diapositiva.
              </small>

            </div>


            <div className="grupo-input">

              <label>
                Gancho principal
              </label>

              <input
                required
                type="text"
                name="ganchoUno"
                value={
                  formData.ganchoUno
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: MEJORES PRODUCTOS"
              />

            </div>


            <div className="grupo-input">

              <label>
                Gancho secundario
              </label>

              <input
                required
                type="text"
                name="ganchoDos"
                value={
                  formData.ganchoDos
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: VERSIÓN 2026"
              />

            </div>


            <div className="grupo-input gestionCarrusel__campoCompleto">

              <label>
                Descripción
              </label>

              <textarea
                required
                name="descripcion"
                value={
                  formData.descripcion
                }
                onChange={
                  manejarCambio
                }
                rows="3"
                placeholder="Ej: Poleras oversize, compresión, baggy..."
              />

            </div>


            <div className="grupo-input">

              <label>
                Texto del botón
              </label>

              <input
                required
                type="text"
                name="enlaceBoton"
                value={
                  formData.enlaceBoton
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: VER CATÁLOGO"
              />

            </div>


            <div className="grupo-input">

              <label>
                Tipo de enlace
              </label>

              <select
                name="tipoEnlace"
                value={
                  formData.tipoEnlace
                }
                onChange={
                  manejarCambio
                }
              >

                <option value="interno">
                  Interno - página de Chapaco Sport
                </option>

                <option value="externo">
                  Externo - WhatsApp, Instagram, etc.
                </option>

              </select>

            </div>


            <div className="grupo-input">

              <label>
                Enlace
              </label>


              {
                formData.tipoEnlace ===
                'interno'
                  ? (
                    <>

                      <div className="gestionCarrusel__enlaceInterno">

                        <span>
                          CHAPACO SPORT
                        </span>

                        <input
                          required
                          type="text"
                          name="enlace"
                          value={
                            formData.enlace
                          }
                          onChange={
                            manejarCambio
                          }
                          placeholder="/catalogo"
                        />

                      </div>

                      <small>
                        Ejemplos:
                        /catalogo,
                        /marcas,
                        /ofertas
                      </small>

                    </>
                  )
                  : (
                    <>

                      <input
                        required
                        type="url"
                        name="enlace"
                        value={
                          formData.enlace
                        }
                        onChange={
                          manejarCambio
                        }
                        placeholder="https://wa.me/591..."
                      />

                      <small>
                        Pega el enlace completo:
                        https://...
                      </small>

                    </>
                  )
              }

            </div>


            <div className="grupo-input">

              <label>
                Orden
              </label>

              <input
                required
                min="1"
                type="number"
                name="orden"
                value={
                  formData.orden
                }
                onChange={
                  manejarCambio
                }
              />

            </div>


            <div className="switch-container">

              <label>
                Activo
              </label>

              <label className="switch-status">

                <input
                  type="checkbox"
                  name="activo"
                  checked={
                    formData.activo
                  }
                  onChange={
                    manejarCambio
                  }
                />

                <span className="slider-status" />

              </label>

            </div>


            <div className="grupo-input gestionCarrusel__campoCompleto">

              <label>
                Imagen de fondo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  manejarImagen
                }
              />


              <small>

                {modoEdicion
                  ? 'Selecciona otra imagen solamente si deseas reemplazar la actual.'
                  : 'Recomendación: imagen horizontal amplia para pantalla completa.'}

              </small>

            </div>


            {
              previewImagenLocal && (

                <div className="gestionCarrusel__previewImagen">

                  <img
                    src={
                      previewImagenLocal
                    }
                    alt="Vista previa"
                  />

                </div>

              )
            }


            <button
              type="button"
              className="gestionCarrusel__btnPreview gestionCarrusel__campoCompleto"
              onClick={() =>
                setVistaPreviaAbierta(
                  true
                )
              }
            >
              VISTA PREVIA
            </button>


            <button
              type="submit"
              className="btn--block gestionCarrusel__campoCompleto"
              disabled={
                guardando
              }
            >

              {
                guardando
                  ? 'GUARDANDO...'
                  : modoEdicion
                    ? 'APLICAR CAMBIOS'
                    : 'CREAR DIAPOSITIVA'
              }

            </button>


            {
              modoEdicion && (

                <button
                  type="button"
                  className="gestionCarrusel__cancelar gestionCarrusel__campoCompleto"
                  onClick={
                    limpiarFormulario
                  }
                >
                  CANCELAR EDICIÓN
                </button>

              )
            }

          </form>

        </aside>

      </div>


      {/* =========================================
          MODAL VISTA PREVIA
      ========================================= */}

      {
        vistaPreviaAbierta && (

          <div
            className="gestionCarruselPreview"
            onMouseDown={
              evento => {

                if (
                  evento.target ===
                  evento.currentTarget
                ) {
                  setVistaPreviaAbierta(
                    false
                  );
                }

              }
            }
          >

            <div className="gestionCarruselPreview__modal">

              <button
                type="button"
                className="gestionCarruselPreview__cerrar"
                onClick={() =>
                  setVistaPreviaAbierta(
                    false
                  )
                }
              >
                ×
              </button>


              <div
                className="gestionCarruselPreview__banner"
                style={{
                  backgroundImage:
                    preview.imagenFondo
                      ? `url(${preview.imagenFondo})`
                      : 'none',
                }}
              >

                <div className="gestionCarruselPreview__overlay" />


                <div className="gestionCarruselPreview__contenido">

                  <span className="gestionCarruselPreview__sintesis">

                    {
                      preview.sintesis ||
                      'SÍNTESIS'
                    }

                  </span>


                  <h2>

                    {
                      preview.ganchoUno ||
                      'GANCHO PRINCIPAL'
                    }

                  </h2>


                  <h3>

                    {
                      preview.ganchoDos ||
                      'GANCHO SECUNDARIO'
                    }

                  </h3>


                  <p>

                    {
                      preview.descripcion ||
                      'Descripción de la diapositiva'
                    }

                  </p>


                  <span className="gestionCarruselPreview__boton">

                    {
                      preview.enlaceBoton ||
                      'BOTÓN'
                    }

                  </span>

                </div>

              </div>


              <div className="gestionCarruselPreview__pie">

                <span>

                  {
                    preview.tipoEnlace ===
                    'interno'
                      ? 'Destino interno:'
                      : 'Destino externo:'
                  }

                  {' '}

                  {
                    preview.enlace ||
                    'sin enlace'
                  }

                </span>


                <button
                  type="button"
                  onClick={() =>
                    setVistaPreviaAbierta(
                      false
                    )
                  }
                  className="btn--block"
                >
                  LISTO
                </button>

              </div>

            </div>

          </div>

        )
      }

    </section>
  );
}


export default GestionCarrusel;