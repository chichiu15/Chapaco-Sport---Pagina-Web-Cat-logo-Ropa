import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Swal from 'sweetalert2';

import {
  cambiarEstadoAnuncio,
  crearAnuncioBarra,
  editarAnuncioBarra,
  eliminarAnuncioBarra,
  guardarOrdenAnuncios,
  suscribirAnunciosBarra,
} from '../../servicios/admin/anunciosBarraServicio';

import '../../estilos/adminestilos.css';

/*
  IMPORTAMOS EL CSS REAL DEL TICKER DEL CLIENTE.
  Así la vista previa usa exactamente el mismo diseño.
*/
import '../../componentes/cliente/BarraAnuncios.css';

import './GestionAnunciosBarra.css';


const FORMULARIO_INICIAL = {
  id: '',
  texto: '',
  activo: true,
  orden: 1,
};


function GestionAnunciosBarra() {

  const [anuncios, setAnuncios] =
    useState([]);

  const [formData, setFormData] =
    useState(FORMULARIO_INICIAL);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [vistaPreviaAbierta, setVistaPreviaAbierta] =
    useState(false);


  // ====================================================
  // SUSCRIPCIÓN FIRESTORE
  // ====================================================

  useEffect(() => {

    const unsubscribe =
      suscribirAnunciosBarra(
        (datos) => {
          setAnuncios(datos);
          setCargando(false);
        },

        () => {
          setCargando(false);
        }
      );

    return () => unsubscribe();

  }, []);


  // ====================================================
  // NUEVO ANUNCIO
  // ====================================================

  const prepararNuevo = () => {

    const siguienteOrden =
      anuncios.length > 0
        ? Math.max(
            ...anuncios.map(
              anuncio =>
                Number(anuncio.orden) || 0
            )
          ) + 1
        : 1;

    setFormData({
      id: '',
      texto: '',
      activo: true,
      orden: siguienteOrden,
    });

    setModoEdicion(false);
  };


  // ====================================================
  // EDITAR
  // ====================================================

  const prepararEdicion = (
    anuncio
  ) => {

    setFormData({
      id: anuncio.id,
      texto: anuncio.texto || '',
      activo:
        anuncio.activo === true,
      orden:
        Number(anuncio.orden) || 1,
    });

    setModoEdicion(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  // ====================================================
  // CANCELAR FORMULARIO
  // ====================================================

  const cancelarEdicion = () => {

    setFormData(
      FORMULARIO_INICIAL
    );

    setModoEdicion(false);
    setVistaPreviaAbierta(false);
  };


  // ====================================================
  // CAMBIOS FORMULARIO
  // ====================================================

  const manejarCambio = (
    evento
  ) => {

    const {
      name,
      value,
      type,
      checked,
    } = evento.target;

    setFormData(
      (actual) => ({
        ...actual,

        [name]:
          type === 'checkbox'
            ? checked
            : name === 'orden'
              ? Number(value)
              : value,
      })
    );
  };


  // ====================================================
  // GUARDAR / APLICAR CAMBIOS
  // ====================================================

  const manejarSubmit = async (
    evento
  ) => {

    evento.preventDefault();

    const texto =
      formData.texto.trim();

    if (!texto) {

      Swal.fire({
        title: 'Texto requerido',
        text: 'Escribe el contenido del anuncio.',
        icon: 'warning',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
      });

      return;
    }


    try {

      setGuardando(true);

      const datos = {
        texto,
        activo: formData.activo,
        orden: Number(formData.orden),
      };


      if (modoEdicion) {

        await editarAnuncioBarra(
          formData.id,
          datos
        );

      } else {

        await crearAnuncioBarra(
          datos
        );

      }


      Swal.fire({
        title: modoEdicion
          ? 'Anuncio actualizado'
          : 'Anuncio creado',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
        timer: 1300,
        showConfirmButton: false,
      });


      cancelarEdicion();


    } catch (error) {

      console.error(
        'Error guardando anuncio:',
        error
      );

      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el anuncio.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
      });

    } finally {

      setGuardando(false);

    }
  };


  // ====================================================
  // ELIMINAR
  // ====================================================

  const manejarEliminar = async (
    anuncio
  ) => {

    const resultado =
      await Swal.fire({

        title: '¿Eliminar anuncio?',

        text:
          `"${anuncio.texto}" será eliminado permanentemente.`,

        icon: 'warning',

        showCancelButton: true,

        background: '#1a1a1a',
        color: '#fff',

        confirmButtonColor: '#e4292f',
        cancelButtonColor: '#333',

        confirmButtonText:
          'Sí, eliminar',

        cancelButtonText:
          'Cancelar',
      });


    if (!resultado.isConfirmed) {
      return;
    }


    try {

      await eliminarAnuncioBarra(
        anuncio.id
      );


      Swal.fire({
        title: 'Eliminado',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
        timer: 1200,
        showConfirmButton: false,
      });


    } catch (error) {

      console.error(
        'Error eliminando anuncio:',
        error
      );

      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el anuncio.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
      });

    }
  };


  // ====================================================
  // ACTIVAR / DESACTIVAR
  // ====================================================

  const manejarEstado = async (
    anuncio
  ) => {

    try {

      await cambiarEstadoAnuncio(
        anuncio.id,
        !anuncio.activo
      );

    } catch (error) {

      console.error(
        'Error cambiando estado:',
        error
      );

      Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar el estado.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
      });

    }
  };


  // ====================================================
  // MOVER ARRIBA / ABAJO
  // ====================================================

  const moverAnuncio = async (
    indiceActual,
    direccion
  ) => {

    const nuevoIndice =
      direccion === 'arriba'
        ? indiceActual - 1
        : indiceActual + 1;


    if (
      nuevoIndice < 0 ||
      nuevoIndice >= anuncios.length
    ) {
      return;
    }


    const nuevaLista = [
      ...anuncios
    ];


    [
      nuevaLista[indiceActual],
      nuevaLista[nuevoIndice],
    ] = [
      nuevaLista[nuevoIndice],
      nuevaLista[indiceActual],
    ];


    try {

      await guardarOrdenAnuncios(
        nuevaLista
      );

    } catch (error) {

      console.error(
        'Error reordenando anuncios:',
        error
      );

      Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar el orden.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#e4292f',
      });

    }
  };


  // ====================================================
  // DATOS PARA VISTA PREVIA
  // ====================================================

  const anunciosVistaPrevia =
    useMemo(() => {

      let lista = anuncios.map(
        anuncio => ({
          ...anuncio,
        })
      );


      /*
        Si estamos editando, reemplazamos
        temporalmente el anuncio SIN tocar Firebase.
      */
      if (modoEdicion) {

        lista = lista.map(
          anuncio =>

            anuncio.id === formData.id

              ? {
                  ...anuncio,
                  texto:
                    formData.texto.trim() ||
                    anuncio.texto,
                  activo:
                    formData.activo,
                  orden:
                    Number(
                      formData.orden
                    ),
                }

              : anuncio
        );

      } else if (
        formData.texto.trim()
      ) {

        /*
          Si estamos creando uno nuevo,
          se agrega solamente para la vista previa.
        */

        lista.push({
          id: '__preview__',
          texto:
            formData.texto.trim(),
          activo:
            formData.activo,
          orden:
            Number(
              formData.orden
            ),
        });

      }


      return lista
        .filter(
          anuncio =>
            anuncio.activo
        )
        .sort(
          (a, b) =>
            Number(a.orden) -
            Number(b.orden)
        );


    }, [
      anuncios,
      formData,
      modoEdicion,
    ]);


  const textoVistaPrevia =
    anunciosVistaPrevia
      .map(
        anuncio =>
          anuncio.texto
      )
      .join('  ·  ');


  // ====================================================
  // CARGANDO
  // ====================================================

  if (cargando) {

    return (
      <div className="gestionAnuncios">
        Cargando anuncios...
      </div>
    );

  }


  return (

    <section className="gestionAnuncios">


      {/* ===============================================
          CABECERA
      =============================================== */}

      <div className="gestionAnuncios__cabecera">

        <div>

          <h1 className="admin-header-title">
            Gestión de Anuncios
          </h1>

          <p className="gestionAnuncios__subtitulo">
            Administra los mensajes que aparecen
            en la barra superior de la tienda.
          </p>

        </div>


        <button
          type="button"
          className="gestionAnuncios__btnPreviewGlobal"
          onClick={() =>
            setVistaPreviaAbierta(true)
          }
        >
          VISTA PREVIA
        </button>

      </div>


      <div className="gestionAnuncios__grid">


        {/* ===============================================
            LISTADO
        =============================================== */}

        <div>

          <div className="gestionAnuncios__resumen">

            <span>
              {anuncios.length}
              {' '}
              anuncios registrados
            </span>

            <span>
              {
                anuncios.filter(
                  anuncio =>
                    anuncio.activo
                ).length
              }
              {' '}
              activos
            </span>

          </div>


          <div className="admin-table-container">

            <table className="admin-table gestionAnuncios__tabla">

              <thead>

                <tr>
                  <th>Texto</th>
                  <th>Estado</th>
                  <th>Ordenar</th>
                  <th>Acciones</th>
                </tr>

              </thead>


              <tbody>

                {anuncios.map(
                  (
                    anuncio,
                    indice
                  ) => (

                    <tr
                      key={
                        anuncio.id
                      }
                    >
                      {/* TEXTO */}

                      <td className="gestionAnuncios__textoTd">

                        <span className="gestionAnuncios__texto">
                          {anuncio.texto}
                        </span>

                      </td>


                      {/* ESTADO */}

                      <td>

                        <button
                          type="button"
                          className={`gestionAnuncios__estado ${
                            anuncio.activo
                              ? 'gestionAnuncios__estado--activo'
                              : 'gestionAnuncios__estado--inactivo'
                          }`}
                          onClick={() =>
                            manejarEstado(
                              anuncio
                            )
                          }
                        >
                          {
                            anuncio.activo
                              ? 'ACTIVO'
                              : 'INACTIVO'
                          }
                        </button>

                      </td>


                      {/* REORDENAR */}

                      <td>

                        <div className="gestionAnuncios__ordenAcciones">

                          <button
                            type="button"
                            className="btn-icon"
                            title="Subir"
                            disabled={
                              indice === 0
                            }
                            onClick={() =>
                              moverAnuncio(
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
                            title="Bajar"
                            disabled={
                              indice ===
                              anuncios.length - 1
                            }
                            onClick={() =>
                              moverAnuncio(
                                indice,
                                'abajo'
                              )
                            }
                          >
                            ↓
                          </button>

                        </div>

                      </td>


                      {/* ACCIONES */}

                      <td>

                        <div className="gestionAnuncios__acciones">

                          <button
                            type="button"
                            className="btn-icon"
                            title="Editar"
                            onClick={() =>
                              prepararEdicion(
                                anuncio
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>


                          <button
                            type="button"
                            className="btn-icon btn-icon--delete"
                            title="Eliminar"
                            onClick={() =>
                              manejarEliminar(
                                anuncio
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>


            {anuncios.length === 0 && (

              <div className="gestionAnuncios__vacio">
                No existen anuncios registrados.
              </div>

            )}

          </div>

        </div>



        {/* ===============================================
            FORMULARIO
        =============================================== */}

        <aside className="gestionAnuncios__formulario">

          <h3>
            {
              modoEdicion
                ? 'EDITAR ANUNCIO'
                : 'NUEVO ANUNCIO'
            }
          </h3>


          <form
            onSubmit={
              manejarSubmit
            }
          >

            <div className="grupo-input">

              <label>
                Texto del anuncio
              </label>

              <textarea
                name="texto"
                rows="4"
                maxLength="120"
                required
                value={
                  formData.texto
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej: ENVÍOS A TODA BOLIVIA"
              />

              <small className="gestionAnuncios__contadorTexto">
                {
                  formData.texto.length
                }
                /120
              </small>

            </div>


            <div className="grupo-input">

              <label>
                Orden
              </label>

              <input
                type="number"
                min="1"
                name="orden"
                value={
                  formData.orden
                }
                onChange={
                  manejarCambio
                }
                required
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


            {/* PREVIEW DEL BORRADOR */}

            <button
              type="button"
              className="gestionAnuncios__btnSecundario"
              onClick={() =>
                setVistaPreviaAbierta(true)
              }
            >
              VER VISTA PREVIA
            </button>


            {/* GUARDAR */}

            <button
              type="submit"
              className="btn--block"
              disabled={
                guardando
              }
            >
              {
                guardando
                  ? 'GUARDANDO...'
                  : modoEdicion
                    ? 'APLICAR CAMBIOS'
                    : 'CREAR ANUNCIO'
              }
            </button>


            {(modoEdicion ||
              formData.texto) && (

              <button
                type="button"
                className="gestionAnuncios__btnCancelar"
                onClick={
                  cancelarEdicion
                }
              >
                CANCELAR
              </button>

            )}


            {!modoEdicion &&
              !formData.texto && (

              <button
                type="button"
                className="gestionAnuncios__btnNuevo"
                onClick={
                  prepararNuevo
                }
              >
                LIMPIAR FORMULARIO
              </button>

            )}

          </form>

        </aside>

      </div>



      {/* ===============================================
          MODAL VISTA PREVIA
      =============================================== */}

      {vistaPreviaAbierta && (

        <div
          className="adminAnunciosPreview"
          onMouseDown={(evento) => {

            if (
              evento.target ===
              evento.currentTarget
            ) {
              setVistaPreviaAbierta(
                false
              );
            }

          }}
        >

          <div className="adminAnunciosPreview__modal">

            <div className="adminAnunciosPreview__cabecera">

              <div>

                <h2>
                  Vista previa
                </h2>

                <p>
                  Así se verá la barra
                  superior en la tienda.
                </p>

              </div>


              <button
                type="button"
                className="adminAnunciosPreview__cerrar"
                onClick={() =>
                  setVistaPreviaAbierta(
                    false
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="adminAnunciosPreview__navegador">

              <div className="adminAnunciosPreview__browserTop">

                <span />
                <span />
                <span />

              </div>


              {/* =====================================
                  MISMAS CLASES DEL COMPONENTE REAL
              ===================================== */}

              {
                anunciosVistaPrevia.length >
                0
                  ? (

                    <div className="barraAnuncios">

                      <div className="barraAnuncios__pista">

                        {[1, 2, 3, 4].map(
                          repeticion => (

                            <span
                              key={
                                repeticion
                              }
                              className="barraAnuncios__bloque"
                            >

                              {
                                textoVistaPrevia
                              }

                              <span className="barraAnuncios__separadorFinal">
                                &nbsp;&nbsp;·&nbsp;&nbsp;
                              </span>

                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )
                  : (

                    <div className="adminAnunciosPreview__sinAnuncios">
                      La barra no se mostraría porque
                      no hay anuncios activos.
                    </div>

                  )
              }


              <div className="adminAnunciosPreview__paginaFalsa">

                <strong>
                  CHAPACO SPORT
                </strong>

                <span>
                  Vista previa del encabezado
                </span>

              </div>

            </div>


            <div className="adminAnunciosPreview__acciones">

              <button
                type="button"
                className="gestionAnuncios__btnSecundario"
                onClick={() =>
                  setVistaPreviaAbierta(
                    false
                  )
                }
              >
                VOLVER
              </button>


              <button
                type="button"
                className="btn--block adminAnunciosPreview__aplicar"
                onClick={() => {

                  setVistaPreviaAbierta(
                    false
                  );

                  /*
                    Solamente cerramos la preview.
                    El usuario confirma definitivamente
                    con CREAR / APLICAR CAMBIOS
                    del formulario.
                  */

                }}
              >
                LISTO
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );
}


export default GestionAnunciosBarra;