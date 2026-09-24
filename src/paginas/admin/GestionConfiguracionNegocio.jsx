import {
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronUp,
  Edit3,
  MapPin,
  MessageCircle,
  Plus,
  Save,
  Share2,
  Trash2,
} from 'lucide-react';

import Swal from 'sweetalert2';

import {
  crearRedSocial,
  crearUbicacion,
  crearWhatsapp,
  editarRedSocial,
  editarUbicacion,
  editarWhatsapp,
  eliminarRedSocial,
  eliminarUbicacion,
  eliminarWhatsapp,
  guardarDescripcionFooter,
  suscribirConfiguracionGeneral,
  suscribirRedesSociales,
  suscribirUbicaciones,
  suscribirWhatsapps,
} from '../../servicios/admin/configuracionNegocioServicio';

import '../../estilos/adminestilos.css';
import './GestionConfiguracionNegocio.css';


const estadoRedInicial = {
  id: '',
  tipo: 'instagram',
  nombre: '',
  url: '',
  activo: true,
  orden: 1,
};


const estadoUbicacionInicial = {
  id: '',
  nombre: '',
  direccion: '',
  url_mapa: '',
  es_principal: false,
  url_iframe: '',
  activo: true,
  orden: 1,
};


const estadoWhatsappInicial = {
  id: '',
  nombre: '',
  etiqueta: '',
  numero: '',
  activo: true,
  orden: 1,
};


const alertaExito = async (
  titulo
) => {
  await Swal.fire({
    title:
      titulo,

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
};


const alertaError = async (
  mensaje
) => {
  await Swal.fire({
    title:
      'Error',

    text:
      mensaje,

    icon:
      'error',

    confirmButtonColor:
      '#e4292f',

    background:
      '#1a1a1a',

    color:
      '#ffffff',
  });
};


// ======================================================
// EXTRAER URL SRC DE IFRAME
// ======================================================

const normalizarUrlIframe = (
  valor
) => {
  const texto =
    String(
      valor || ''
    ).trim();

  if (
    !texto
  ) {
    return '';
  }

  if (
    texto
      .toLowerCase()
      .includes(
        '<iframe'
      )
  ) {
    const coincidencia =
      texto.match(
        /src\s*=\s*["']([^"']+)["']/i
      );

    if (
      coincidencia?.[1]
    ) {
      return coincidencia[
        1
      ].replace(
        /&amp;/g,
        '&'
      );
    }

    return '';
  }

  return texto.replace(
    /&amp;/g,
    '&'
  );
};


function GestionConfiguracionNegocio() {
  const [
    descripcionFooter,
    setDescripcionFooter,
  ] =
    useState('');

  const [
    guardandoDescripcion,
    setGuardandoDescripcion,
  ] =
    useState(false);


  const [
    redes,
    setRedes,
  ] =
    useState([]);

  const [
    formularioRed,
    setFormularioRed,
  ] =
    useState({
      ...estadoRedInicial,
    });

  const [
    editandoRed,
    setEditandoRed,
  ] =
    useState(false);


  const [
    ubicaciones,
    setUbicaciones,
  ] =
    useState([]);

  const [
    formularioUbicacion,
    setFormularioUbicacion,
  ] =
    useState({
      ...estadoUbicacionInicial,
    });

  const [
    editandoUbicacion,
    setEditandoUbicacion,
  ] =
    useState(false);

  const [
    tutorialMapaAbierto,
    setTutorialMapaAbierto,
  ] =
    useState(false);


  const [
    whatsapps,
    setWhatsapps,
  ] =
    useState([]);

  const [
    formularioWhatsapp,
    setFormularioWhatsapp,
  ] =
    useState({
      ...estadoWhatsappInicial,
    });

  const [
    editandoWhatsapp,
    setEditandoWhatsapp,
  ] =
    useState(false);


  const [
    procesando,
    setProcesando,
  ] =
    useState(false);


  // ======================================================
  // SUSCRIPCIONES FIREBASE
  // ======================================================

  useEffect(() => {
    const desuscribirGeneral =
      suscribirConfiguracionGeneral(
        (datos) => {
          setDescripcionFooter(
            datos.descripcion_footer ||
            ''
          );
        }
      );

    const desuscribirRedes =
      suscribirRedesSociales(
        setRedes
      );

    const desuscribirUbicaciones =
      suscribirUbicaciones(
        setUbicaciones
      );

    const desuscribirWhatsapps =
      suscribirWhatsapps(
        setWhatsapps
      );


    return () => {
      desuscribirGeneral();
      desuscribirRedes();
      desuscribirUbicaciones();
      desuscribirWhatsapps();
    };
  }, []);


  // ======================================================
  // DESCRIPCIÓN FOOTER
  // ======================================================

  const manejarGuardarDescripcion =
    async () => {
      if (
        !descripcionFooter.trim()
      ) {
        await Swal.fire({
          title:
            'Descripción requerida',

          text:
            'Escribe la descripción que aparecerá debajo del logo.',

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


      try {
        setGuardandoDescripcion(
          true
        );

        await guardarDescripcionFooter(
          descripcionFooter
        );

        await alertaExito(
          'Descripción guardada'
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo guardar la descripción.'
        );
      } finally {
        setGuardandoDescripcion(
          false
        );
      }
    };


  // ======================================================
  // REDES SOCIALES
  // ======================================================

  const limpiarFormularioRed =
    () => {
      setFormularioRed({
        ...estadoRedInicial,
        orden:
          redes.length +
          1,
      });

      setEditandoRed(
        false
      );
    };


  const seleccionarRed =
    (red) => {
      setFormularioRed({
        id:
          red.id,

        tipo:
          red.tipo ||
          'instagram',

        nombre:
          red.nombre ||
          '',

        url:
          red.url ||
          '',

        activo:
          red.activo !==
          false,

        orden:
          red.orden ??
          1,
      });

      setEditandoRed(
        true
      );
    };


  const guardarRed =
    async (
      evento
    ) => {
      evento.preventDefault();

      if (
        !formularioRed.nombre.trim() ||
        !formularioRed.url.trim()
      ) {
        await Swal.fire({
          title:
            'Datos incompletos',

          text:
            'Completa el nombre y la URL de la red social.',

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


      try {
        setProcesando(
          true
        );

        if (
          editandoRed
        ) {
          await editarRedSocial(
            formularioRed.id,
            formularioRed
          );

          await alertaExito(
            'Red social actualizada'
          );
        } else {
          await crearRedSocial(
            formularioRed
          );

          await alertaExito(
            'Red social agregada'
          );
        }

        limpiarFormularioRed();
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo guardar la red social.'
        );
      } finally {
        setProcesando(
          false
        );
      }
    };


  const borrarRed =
    async (
      red
    ) => {
      const confirmacion =
        await Swal.fire({
          title:
            '¿Eliminar red social?',

          text:
            red.nombre,

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
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      try {
        await eliminarRedSocial(
          red.id
        );

        if (
          formularioRed.id ===
          red.id
        ) {
          limpiarFormularioRed();
        }

        await alertaExito(
          'Red social eliminada'
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo eliminar la red social.'
        );
      }
    };


  // ======================================================
  // UBICACIONES
  // ======================================================

  const limpiarFormularioUbicacion =
    () => {
      setFormularioUbicacion({
        ...estadoUbicacionInicial,
        orden:
          ubicaciones.length +
          1,
      });

      setEditandoUbicacion(
        false
      );

      setTutorialMapaAbierto(
        false
      );
    };


  const seleccionarUbicacion =
    (ubicacion) => {
      setFormularioUbicacion({
        id:
          ubicacion.id,

        nombre:
          ubicacion.nombre ||
          '',

        direccion:
          ubicacion.direccion ||
          '',

        url_mapa:
          ubicacion.url_mapa ||
          '',

        es_principal:
          ubicacion.es_principal ===
          true,

        url_iframe:
          ubicacion.url_iframe ||
          '',

        activo:
          ubicacion.activo !==
          false,

        orden:
          ubicacion.orden ??
          1,
      });

      setEditandoUbicacion(
        true
      );

      setTutorialMapaAbierto(
        false
      );
    };


  const cambiarPrincipalUbicacion =
    (
      esPrincipal
    ) => {
      setFormularioUbicacion(
        (actual) => ({
          ...actual,

          es_principal:
            esPrincipal,

          url_iframe:
            esPrincipal
              ? actual.url_iframe
              : '',
        })
      );

      if (
        !esPrincipal
      ) {
        setTutorialMapaAbierto(
          false
        );
      }
    };


  const manejarCambioIframe =
    (
      valor
    ) => {
      setFormularioUbicacion(
        (actual) => ({
          ...actual,

          url_iframe:
            valor,
        })
      );
    };


  const guardarUbicacion =
    async (
      evento
    ) => {
      evento.preventDefault();

      if (
        !formularioUbicacion.nombre.trim() ||
        !formularioUbicacion.direccion.trim() ||
        !formularioUbicacion.url_mapa.trim()
      ) {
        await Swal.fire({
          title:
            'Datos incompletos',

          text:
            'Completa nombre, descripción o dirección y enlace de Google Maps.',

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


      let urlIframeFinal =
        '';

      if (
        formularioUbicacion.es_principal
      ) {
        urlIframeFinal =
          normalizarUrlIframe(
            formularioUbicacion.url_iframe
          );

        if (
          !urlIframeFinal
        ) {
          await Swal.fire({
            title:
              'Mapa incrustado requerido',

            text:
              'La ubicación principal debe tener una URL de mapa incrustado o el código iframe de Google Maps.',

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
      }


      const datos = {
        ...formularioUbicacion,

        url_iframe:
          urlIframeFinal,
      };


      try {
        setProcesando(
          true
        );

        if (
          editandoUbicacion
        ) {
          await editarUbicacion(
            formularioUbicacion.id,
            datos
          );

          await alertaExito(
            'Ubicación actualizada'
          );
        } else {
          await crearUbicacion(
            datos
          );

          await alertaExito(
            'Ubicación agregada'
          );
        }

        limpiarFormularioUbicacion();
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo guardar la ubicación.'
        );
      } finally {
        setProcesando(
          false
        );
      }
    };


  const borrarUbicacion =
    async (
      ubicacion
    ) => {
      const confirmacion =
        await Swal.fire({
          title:
            '¿Eliminar ubicación?',

          text:
            ubicacion.es_principal
              ? 'Esta es la ubicación principal y dejará de mostrarse el mapa principal en el footer.'
              : ubicacion.nombre,

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
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      try {
        await eliminarUbicacion(
          ubicacion.id
        );

        if (
          formularioUbicacion.id ===
          ubicacion.id
        ) {
          limpiarFormularioUbicacion();
        }

        await alertaExito(
          'Ubicación eliminada'
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo eliminar la ubicación.'
        );
      }
    };


  // ======================================================
  // WHATSAPP
  // ======================================================

  const limpiarFormularioWhatsapp =
    () => {
      setFormularioWhatsapp({
        ...estadoWhatsappInicial,
        orden:
          whatsapps.length +
          1,
      });

      setEditandoWhatsapp(
        false
      );
    };


  const seleccionarWhatsapp =
    (whatsapp) => {
      setFormularioWhatsapp({
        id:
          whatsapp.id,

        nombre:
          whatsapp.nombre ||
          '',

        etiqueta:
          whatsapp.etiqueta ||
          '',

        numero:
          whatsapp.numero ||
          '',

        activo:
          whatsapp.activo !==
          false,

        orden:
          whatsapp.orden ??
          1,
      });

      setEditandoWhatsapp(
        true
      );
    };


  const guardarWhatsapp =
    async (
      evento
    ) => {
      evento.preventDefault();

      const numeroLimpio =
        formularioWhatsapp.numero.replace(
          /\D/g,
          ''
        );


      if (
        !formularioWhatsapp.nombre.trim() ||
        !numeroLimpio
      ) {
        await Swal.fire({
          title:
            'Datos incompletos',

          text:
            'Completa el nombre del operador y su número de WhatsApp.',

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


      const datos = {
        ...formularioWhatsapp,

        numero:
          numeroLimpio,
      };


      try {
        setProcesando(
          true
        );

        if (
          editandoWhatsapp
        ) {
          await editarWhatsapp(
            formularioWhatsapp.id,
            datos
          );

          await alertaExito(
            'Operador actualizado'
          );
        } else {
          await crearWhatsapp(
            datos
          );

          await alertaExito(
            'Operador agregado'
          );
        }

        limpiarFormularioWhatsapp();
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo guardar el operador.'
        );
      } finally {
        setProcesando(
          false
        );
      }
    };


  const borrarWhatsapp =
    async (
      whatsapp
    ) => {
      const confirmacion =
        await Swal.fire({
          title:
            '¿Eliminar operador?',

          text:
            whatsapp.nombre,

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
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      try {
        await eliminarWhatsapp(
          whatsapp.id
        );

        if (
          formularioWhatsapp.id ===
          whatsapp.id
        ) {
          limpiarFormularioWhatsapp();
        }

        await alertaExito(
          'Operador eliminado'
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        await alertaError(
          'No se pudo eliminar el operador.'
        );
      }
    };


  return (
    <div className="configNegocio contenedor">
      <div className="configNegocio__cabecera">
        <div>
          <h1 className="admin-header-title">
            Configuración del negocio
          </h1>

          <p>
            Administra la información pública de Chapaco Sport,
            redes sociales, ubicaciones y números de WhatsApp.
          </p>
        </div>
      </div>


      {/* ==================================================
          DESCRIPCIÓN
      ================================================== */}

      <section className="configNegocio__seccion">
        <div className="configNegocio__titulo">
          <div className="configNegocio__icono">
            <Save size={21} />
          </div>

          <div>
            <h2>
              Descripción del footer
            </h2>

            <p>
              Texto que aparece debajo del logo de Chapaco Sport.
            </p>
          </div>
        </div>


        <div className="configNegocio__descripcionForm">
          <textarea
            value={
              descripcionFooter
            }
            onChange={
              (evento) =>
                setDescripcionFooter(
                  evento.target.value
                )
            }
            rows={4}
            maxLength={350}
            placeholder="Ej. Tu tienda deportiva de confianza en Tarija..."
          />

          <div className="configNegocio__descripcionInferior">
            <span>
              {descripcionFooter.length}/350
            </span>

            <button
              type="button"
              className="configNegocio__btnPrincipal"
              onClick={
                manejarGuardarDescripcion
              }
              disabled={
                guardandoDescripcion
              }
            >
              <Save size={17} />

              {guardandoDescripcion
                ? 'GUARDANDO...'
                : 'GUARDAR'}
            </button>
          </div>
        </div>
      </section>


      {/* ==================================================
          REDES SOCIALES
      ================================================== */}

      <section className="configNegocio__seccion">
        <div className="configNegocio__titulo">
          <div className="configNegocio__icono">
            <Share2 size={21} />
          </div>

          <div>
            <h2>
              Redes sociales
            </h2>

            <p>
              Puedes registrar varias cuentas de una misma red.
            </p>
          </div>
        </div>


        <div className="configNegocio__grid">
          <div className="configNegocio__lista">
            {redes.map(
              (red) => (
                <article
                  key={
                    red.id
                  }
                  className="configNegocio__item"
                >
                  <div>
                    <strong>
                      {red.nombre}
                    </strong>

                    <span>
                      {red.tipo}
                    </span>

                    <small>
                      Orden: {red.orden || 0}
                    </small>
                  </div>

                  <div className="configNegocio__accionesItem">
                    <span
                      className={
                        `badge-estado ${
                          red.activo !== false
                            ? 'badge-activo'
                            : 'badge-inactivo'
                        }`
                      }
                    >
                      {red.activo !== false
                        ? 'ACTIVO'
                        : 'INACTIVO'}
                    </span>

                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() =>
                        seleccionarRed(
                          red
                        )
                      }
                      title="Editar"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon btn-icon--delete"
                      onClick={() =>
                        borrarRed(
                          red
                        )
                      }
                      title="Eliminar"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              )
            )}


            {redes.length === 0 && (
              <div className="configNegocio__vacio">
                Todavía no existen redes sociales registradas.
              </div>
            )}
          </div>


          <form
            className="configNegocio__formulario"
            onSubmit={
              guardarRed
            }
          >
            <h3>
              {editandoRed
                ? 'Editar red social'
                : 'Agregar red social'}
            </h3>


            <div className="grupo-input">
              <label>
                Tipo
              </label>

              <select
                value={
                  formularioRed.tipo
                }
                onChange={
                  (evento) =>
                    setFormularioRed(
                      (actual) => ({
                        ...actual,

                        tipo:
                          evento.target.value,
                      })
                    )
                }
              >
                <option value="instagram">
                  Instagram
                </option>

                <option value="facebook">
                  Facebook
                </option>

                <option value="tiktok">
                  TikTok
                </option>

                <option value="youtube">
                  YouTube
                </option>

                <option value="whatsapp">
                  WhatsApp
                </option>

                <option value="x">
                  X / Twitter
                </option>

                <option value="otro">
                  Otro
                </option>
              </select>
            </div>


            <div className="grupo-input">
              <label>
                Nombre
              </label>

              <input
                type="text"
                value={
                  formularioRed.nombre
                }
                onChange={
                  (evento) =>
                    setFormularioRed(
                      (actual) => ({
                        ...actual,

                        nombre:
                          evento.target.value,
                      })
                    )
                }
                placeholder="Ej. Instagram Principal"
              />
            </div>


            <div className="grupo-input">
              <label>
                URL
              </label>

              <input
                type="url"
                value={
                  formularioRed.url
                }
                onChange={
                  (evento) =>
                    setFormularioRed(
                      (actual) => ({
                        ...actual,

                        url:
                          evento.target.value,
                      })
                    )
                }
                placeholder="https://..."
              />
            </div>


            <div className="grupo-input">
              <label>
                Orden
              </label>

              <input
                type="number"
                min="0"
                value={
                  formularioRed.orden
                }
                onChange={
                  (evento) =>
                    setFormularioRed(
                      (actual) => ({
                        ...actual,

                        orden:
                          Number(
                            evento.target.value
                          ),
                      })
                    )
                }
              />
            </div>


            <div className="configNegocio__switch">
              <span>
                Activo
              </span>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formularioRed.activo
                  }
                  onChange={
                    (evento) =>
                      setFormularioRed(
                        (actual) => ({
                          ...actual,

                          activo:
                            evento.target.checked,
                        })
                      )
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            <div className="configNegocio__botonesForm">
              <button
                type="submit"
                className="configNegocio__btnPrincipal"
                disabled={
                  procesando
                }
              >
                {editandoRed
                  ? 'GUARDAR CAMBIOS'
                  : (
                    <>
                      <Plus size={17} />
                      AGREGAR
                    </>
                  )}
              </button>

              {editandoRed && (
                <button
                  type="button"
                  className="configNegocio__btnSecundario"
                  onClick={
                    limpiarFormularioRed
                  }
                >
                  CANCELAR
                </button>
              )}
            </div>
          </form>
        </div>
      </section>


      {/* ==================================================
          UBICACIONES
      ================================================== */}

      <section className="configNegocio__seccion">
        <div className="configNegocio__titulo">
          <div className="configNegocio__icono">
            <MapPin size={21} />
          </div>

          <div>
            <h2>
              Ubicaciones
            </h2>

            <p>
              Define una ubicación principal con mapa incrustado
              y agrega otras sucursales con su enlace de Google Maps.
            </p>
          </div>
        </div>


        <div className="configNegocio__grid">
          <div className="configNegocio__lista">
            {ubicaciones.map(
              (ubicacion) => (
                <article
                  key={
                    ubicacion.id
                  }
                  className="configNegocio__item"
                >
                  <div>
                    <strong>
                      {ubicacion.nombre}
                    </strong>

                    <span>
                      {ubicacion.direccion}
                    </span>

                    <small>
                      {ubicacion.es_principal ===
                        true
                        ? 'UBICACIÓN PRINCIPAL · '
                        : ''}
                      Orden: {ubicacion.orden || 0}
                    </small>
                  </div>

                  <div className="configNegocio__accionesItem">
                    {ubicacion.es_principal ===
                      true && (
                      <span className="badge-estado badge-activo">
                        PRINCIPAL
                      </span>
                    )}

                    <span
                      className={
                        `badge-estado ${
                          ubicacion.activo !== false
                            ? 'badge-activo'
                            : 'badge-inactivo'
                        }`
                      }
                    >
                      {ubicacion.activo !== false
                        ? 'ACTIVA'
                        : 'INACTIVA'}
                    </span>

                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() =>
                        seleccionarUbicacion(
                          ubicacion
                        )
                      }
                      title="Editar"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon btn-icon--delete"
                      onClick={() =>
                        borrarUbicacion(
                          ubicacion
                        )
                      }
                      title="Eliminar"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              )
            )}


            {ubicaciones.length ===
              0 && (
              <div className="configNegocio__vacio">
                Todavía no existen ubicaciones registradas.
              </div>
            )}
          </div>


          <form
            className="configNegocio__formulario"
            onSubmit={
              guardarUbicacion
            }
          >
            <h3>
              {editandoUbicacion
                ? 'Editar ubicación'
                : 'Agregar ubicación'}
            </h3>


            <div className="grupo-input">
              <label>
                Nombre
              </label>

              <input
                type="text"
                value={
                  formularioUbicacion.nombre
                }
                onChange={
                  (evento) =>
                    setFormularioUbicacion(
                      (actual) => ({
                        ...actual,

                        nombre:
                          evento.target.value,
                      })
                    )
                }
                placeholder="Ej. Sucursal Lourdes"
              />
            </div>


            <div className="grupo-input">
              <label>
                Descripción / dirección
              </label>

              <textarea
                rows={3}
                value={
                  formularioUbicacion.direccion
                }
                onChange={
                  (evento) =>
                    setFormularioUbicacion(
                      (actual) => ({
                        ...actual,

                        direccion:
                          evento.target.value,
                      })
                    )
                }
                placeholder="Ej. Barrio Lourdes, Av. 11 de febrero..."
              />
            </div>


            <div className="grupo-input">
              <label>
                URL Google Maps
              </label>

              <input
                type="url"
                value={
                  formularioUbicacion.url_mapa
                }
                onChange={
                  (evento) =>
                    setFormularioUbicacion(
                      (actual) => ({
                        ...actual,

                        url_mapa:
                          evento.target.value,
                      })
                    )
                }
                placeholder="https://maps.app.goo.gl/..."
              />

              <small>
                Enlace que abrirá Google Maps cuando el cliente pulse
                "Ver mapa".
              </small>
            </div>


            <div className="configNegocio__switch">
              <div>
                <strong>
                  Ubicación principal
                </strong>

                <small
                  style={{
                    display:
                      'block',
                    marginTop:
                      '0.3rem',
                    maxWidth:
                      '220px',
                    color:
                      '#777',
                    fontSize:
                      '0.7rem',
                    lineHeight:
                      '1.4',
                  }}
                >
                  Solo una ubicación puede ser principal.
                  Esta será la que muestre el mapa incrustado.
                </small>
              </div>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formularioUbicacion.es_principal
                  }
                  onChange={
                    (evento) =>
                      cambiarPrincipalUbicacion(
                        evento.target.checked
                      )
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            {formularioUbicacion.es_principal && (
              <div className="grupo-input">
                <label>
                  Mapa incrustado
                </label>

                <textarea
                  rows={4}
                  value={
                    formularioUbicacion.url_iframe
                  }
                  onChange={
                    (evento) =>
                      manejarCambioIframe(
                        evento.target.value
                      )
                  }
                  placeholder='Pega aquí la URL embed o el código completo <iframe ...></iframe>'
                />

                <small>
                  Puedes pegar la URL de mapa incrustado o
                  directamente el código HTML que copia Google Maps.
                  El sistema guardará automáticamente solo la URL necesaria.
                </small>


                <button
                  type="button"
                  onClick={() =>
                    setTutorialMapaAbierto(
                      (actual) =>
                        !actual
                    )
                  }
                  style={{
                    width:
                      '100%',
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'space-between',
                    gap:
                      '0.75rem',
                    marginTop:
                      '0.9rem',
                    padding:
                      '0.75rem',
                    border:
                      '1px solid rgba(255,255,255,0.1)',
                    borderRadius:
                      '7px',
                    background:
                      'rgba(255,255,255,0.035)',
                    color:
                      '#ddd',
                    cursor:
                      'pointer',
                    fontFamily:
                      'inherit',
                    fontSize:
                      '0.75rem',
                    fontWeight:
                      700,
                    textAlign:
                      'left',
                  }}
                >
                  <span>
                    ¿Cómo obtener el mapa incrustado?
                  </span>

                  {tutorialMapaAbierto ? (
                    <ChevronUp
                      size={17}
                    />
                  ) : (
                    <ChevronDown
                      size={17}
                    />
                  )}
                </button>


                {tutorialMapaAbierto && (
                  <div
                    style={{
                      marginTop:
                        '0.7rem',
                      padding:
                        '0.9rem',
                      border:
                        '1px solid rgba(239,48,56,0.2)',
                      borderRadius:
                        '7px',
                      background:
                        'rgba(239,48,56,0.05)',
                      color:
                        '#aaa',
                      fontSize:
                        '0.75rem',
                      lineHeight:
                        '1.7',
                    }}
                  >
                    <strong
                      style={{
                        display:
                          'block',
                        marginBottom:
                          '0.45rem',
                        color:
                          '#fff',
                      }}
                    >
                      PASOS EN GOOGLE MAPS
                    </strong>

                    <div>
                      1. Abre Google Maps desde una computadora.
                    </div>

                    <div>
                      2. Busca la ubicación de la sucursal.
                    </div>

                    <div>
                      3. Pulsa <strong>Compartir</strong>.
                    </div>

                    <div>
                      4. Selecciona <strong>Insertar un mapa</strong>.
                    </div>

                    <div>
                      5. Elige el tamaño del mapa.
                    </div>

                    <div>
                      6. Pulsa <strong>Copiar HTML</strong>.
                    </div>

                    <div>
                      7. Pega aquí todo el código copiado.
                    </div>
                  </div>
                )}
              </div>
            )}


            <div className="grupo-input">
              <label>
                Orden
              </label>

              <input
                type="number"
                min="0"
                value={
                  formularioUbicacion.orden
                }
                onChange={
                  (evento) =>
                    setFormularioUbicacion(
                      (actual) => ({
                        ...actual,

                        orden:
                          Number(
                            evento.target.value
                          ),
                      })
                    )
                }
              />
            </div>


            <div className="configNegocio__switch">
              <span>
                Activa
              </span>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formularioUbicacion.activo
                  }
                  onChange={
                    (evento) =>
                      setFormularioUbicacion(
                        (actual) => ({
                          ...actual,

                          activo:
                            evento.target.checked,
                        })
                      )
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            <div className="configNegocio__botonesForm">
              <button
                type="submit"
                className="configNegocio__btnPrincipal"
                disabled={
                  procesando
                }
              >
                {editandoUbicacion
                  ? 'GUARDAR CAMBIOS'
                  : (
                    <>
                      <Plus size={17} />
                      AGREGAR
                    </>
                  )}
              </button>

              {editandoUbicacion && (
                <button
                  type="button"
                  className="configNegocio__btnSecundario"
                  onClick={
                    limpiarFormularioUbicacion
                  }
                >
                  CANCELAR
                </button>
              )}
            </div>
          </form>
        </div>
      </section>


      {/* ==================================================
          WHATSAPP
      ================================================== */}

      <section className="configNegocio__seccion">
        <div className="configNegocio__titulo">
          <div className="configNegocio__icono">
            <MessageCircle size={21} />
          </div>

          <div>
            <h2>
              WhatsApp / Operadores
            </h2>

            <p>
              Estos números también serán utilizados posteriormente
              por el carrito para seleccionar el operador del pedido.
            </p>
          </div>
        </div>


        <div className="configNegocio__grid">
          <div className="configNegocio__lista">
            {whatsapps.map(
              (whatsapp) => (
                <article
                  key={
                    whatsapp.id
                  }
                  className="configNegocio__item"
                >
                  <div>
                    <strong>
                      {whatsapp.nombre}
                    </strong>

                    <span>
                      {whatsapp.etiqueta ||
                        'Sin etiqueta'}
                    </span>

                    <small>
                      +{whatsapp.numero} · Orden {whatsapp.orden || 0}
                    </small>
                  </div>

                  <div className="configNegocio__accionesItem">
                    <span
                      className={
                        `badge-estado ${
                          whatsapp.activo !== false
                            ? 'badge-activo'
                            : 'badge-inactivo'
                        }`
                      }
                    >
                      {whatsapp.activo !== false
                        ? 'ACTIVO'
                        : 'INACTIVO'}
                    </span>

                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() =>
                        seleccionarWhatsapp(
                          whatsapp
                        )
                      }
                      title="Editar"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon btn-icon--delete"
                      onClick={() =>
                        borrarWhatsapp(
                          whatsapp
                        )
                      }
                      title="Eliminar"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              )
            )}


            {whatsapps.length ===
              0 && (
              <div className="configNegocio__vacio">
                Todavía no existen operadores registrados.
              </div>
            )}
          </div>


          <form
            className="configNegocio__formulario"
            onSubmit={
              guardarWhatsapp
            }
          >
            <h3>
              {editandoWhatsapp
                ? 'Editar operador'
                : 'Agregar operador'}
            </h3>


            <div className="grupo-input">
              <label>
                Nombre
              </label>

              <input
                type="text"
                value={
                  formularioWhatsapp.nombre
                }
                onChange={
                  (evento) =>
                    setFormularioWhatsapp(
                      (actual) => ({
                        ...actual,

                        nombre:
                          evento.target.value,
                      })
                    )
                }
                placeholder="Ej. Operador 1"
              />
            </div>


            <div className="grupo-input">
              <label>
                Etiqueta
              </label>

              <input
                type="text"
                value={
                  formularioWhatsapp.etiqueta
                }
                onChange={
                  (evento) =>
                    setFormularioWhatsapp(
                      (actual) => ({
                        ...actual,

                        etiqueta:
                          evento.target.value,
                      })
                    )
                }
                placeholder="Ej. Ventas, Consultas, Centro..."
              />
            </div>


            <div className="grupo-input">
              <label>
                Número
              </label>

              <input
                type="tel"
                value={
                  formularioWhatsapp.numero
                }
                onChange={
                  (evento) =>
                    setFormularioWhatsapp(
                      (actual) => ({
                        ...actual,

                        numero:
                          evento.target.value,
                      })
                    )
                }
                placeholder="59175785262"
              />

              <small>
                Guarda el número con código de país. Ejemplo: 59175785262.
              </small>
            </div>


            <div className="grupo-input">
              <label>
                Orden
              </label>

              <input
                type="number"
                min="0"
                value={
                  formularioWhatsapp.orden
                }
                onChange={
                  (evento) =>
                    setFormularioWhatsapp(
                      (actual) => ({
                        ...actual,

                        orden:
                          Number(
                            evento.target.value
                          ),
                      })
                    )
                }
              />
            </div>


            <div className="configNegocio__switch">
              <span>
                Activo
              </span>

              <label className="switch-status">
                <input
                  type="checkbox"
                  checked={
                    formularioWhatsapp.activo
                  }
                  onChange={
                    (evento) =>
                      setFormularioWhatsapp(
                        (actual) => ({
                          ...actual,

                          activo:
                            evento.target.checked,
                        })
                      )
                  }
                />

                <span className="slider-status" />
              </label>
            </div>


            <div className="configNegocio__botonesForm">
              <button
                type="submit"
                className="configNegocio__btnPrincipal"
                disabled={
                  procesando
                }
              >
                {editandoWhatsapp
                  ? 'GUARDAR CAMBIOS'
                  : (
                    <>
                      <Plus size={17} />
                      AGREGAR
                    </>
                  )}
              </button>

              {editandoWhatsapp && (
                <button
                  type="button"
                  className="configNegocio__btnSecundario"
                  onClick={
                    limpiarFormularioWhatsapp
                  }
                >
                  CANCELAR
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}


export default GestionConfiguracionNegocio;