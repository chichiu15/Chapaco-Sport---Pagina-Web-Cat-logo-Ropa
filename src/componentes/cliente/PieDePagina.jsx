import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  X,
} from 'lucide-react';

import {
  NavLink,
} from 'react-router-dom';

import IconoInstagram
  from '../comun/iconos/IconoInstagram';

import IconoFacebook
  from '../comun/iconos/IconoFacebook';

import IconoWhatsapp
  from '../comun/iconos/IconoWhatsApp';

import IconoTikTok
  from '../comun/iconos/IconoTikTok';

import {
  ENLACES_TIENDA,
  URL_LOGO,
} from '../../utilidades/Constantes';

import {
  suscribirConfiguracionGeneralCliente,
  suscribirRedesSocialesCliente,
  suscribirUbicacionesCliente,
} from '../../servicios/cliente/configuracionNegocioClienteServicio';

import './PieDePagina.css';


const DESCRIPCION_RESPALDO =
  'Tu tienda deportiva de confianza en Tarija. La mejor indumentaria, marcas premium y ofertas exclusivas para tu entrenamiento.';


const CONFIGURACION_REDES = {
  instagram: {
    nombre: 'Instagram',
    clase: 'instagram',
    Icono: IconoInstagram,
  },

  facebook: {
    nombre: 'Facebook',
    clase: 'facebook',
    Icono: IconoFacebook,
  },

  whatsapp: {
    nombre: 'WhatsApp',
    clase: 'whatsapp',
    Icono: IconoWhatsapp,
  },

  tiktok: {
    nombre: 'TikTok',
    clase: 'tiktok',
    Icono: IconoTikTok,
  },
};


const obtenerNombreCorto = (
  red,
  tipo
) => {
  const nombreOriginal =
    String(
      red.nombre ||
      ''
    ).trim();


  const nombreRed =
    CONFIGURACION_REDES[
      tipo
    ]?.nombre ||
    tipo;


  let nombre =
    nombreOriginal
      .replace(
        new RegExp(
          nombreRed,
          'gi'
        ),
        ''
      )
      .replace(
        /chapaco sport/gi,
        ''
      )
      .replace(
        /\s+/g,
        ' '
      )
      .trim();


  return (
    nombre ||
    'Principal'
  );
};


function PieDePagina() {
  const [
    descripcionFooter,
    setDescripcionFooter,
  ] =
    useState('');

  const [
    redesSociales,
    setRedesSociales,
  ] =
    useState([]);

  const [
    redActiva,
    setRedActiva,
  ] =
    useState('');

  const [
    ubicaciones,
    setUbicaciones,
  ] =
    useState([]);

  const [
    indiceUbicacion,
    setIndiceUbicacion,
  ] =
    useState(0);


  useEffect(() => {
    const desuscribirGeneral =
      suscribirConfiguracionGeneralCliente(
        (datos) => {
          setDescripcionFooter(
            datos.descripcion_footer ||
            ''
          );
        }
      );


    const desuscribirRedes =
      suscribirRedesSocialesCliente(
        setRedesSociales
      );


    const desuscribirUbicaciones =
      suscribirUbicacionesCliente(
        setUbicaciones
      );


    return () => {
      desuscribirGeneral();
      desuscribirRedes();
      desuscribirUbicaciones();
    };
  }, []);


  const redesAgrupadas =
    useMemo(
      () => {
        const mapa =
          new Map();


        redesSociales.forEach(
          (red) => {
            const tipo =
              String(
                red.tipo ||
                'otro'
              )
                .trim()
                .toLowerCase();


            if (
              !mapa.has(
                tipo
              )
            ) {
              mapa.set(
                tipo,
                []
              );
            }


            mapa
              .get(
                tipo
              )
              .push(
                red
              );
          }
        );


        return Array.from(
          mapa.entries()
        ).map(
          ([
            tipo,
            perfiles,
          ]) => ({
            tipo,
            perfiles,
          })
        );
      },
      [
        redesSociales,
      ]
    );


  const redesOrdenadasVisualmente =
    useMemo(
      () => {
        if (
          !redActiva
        ) {
          return redesAgrupadas;
        }


        const activa =
          redesAgrupadas.find(
            (
              grupo
            ) =>
              grupo.tipo ===
              redActiva
          );


        if (
          !activa
        ) {
          return redesAgrupadas;
        }


        const restantes =
          redesAgrupadas.filter(
            (
              grupo
            ) =>
              grupo.tipo !==
              redActiva
          );


        return [
          activa,
          ...restantes,
        ];
      },
      [
        redesAgrupadas,
        redActiva,
      ]
    );


  useEffect(() => {
    if (
      !redActiva
    ) {
      return;
    }


    const existe =
      redesAgrupadas.some(
        (
          grupo
        ) =>
          grupo.tipo ===
          redActiva
      );


    if (
      !existe
    ) {
      setRedActiva(
        ''
      );
    }
  }, [
    redActiva,
    redesAgrupadas,
  ]);


  const manejarClickRed =
    (
      grupo
    ) => {
      if (
        grupo.perfiles.length ===
        1
      ) {
        window.open(
          grupo.perfiles[
            0
          ].url,
          '_blank',
          'noopener,noreferrer'
        );

        return;
      }


      setRedActiva(
        (
          actual
        ) =>
          actual ===
          grupo.tipo
            ? ''
            : grupo.tipo
      );
    };


  const ubicacionesOrdenadas =
    useMemo(
      () => {
        return [
          ...ubicaciones,
        ].sort(
          (
            a,
            b
          ) => {
            if (
              a.es_principal ===
                true &&
              b.es_principal !==
                true
            ) {
              return -1;
            }

            if (
              a.es_principal !==
                true &&
              b.es_principal ===
                true
            ) {
              return 1;
            }

            return (
              Number(
                a.orden
              ) -
              Number(
                b.orden
              )
            );
          }
        );
      },
      [
        ubicaciones,
      ]
    );


  useEffect(() => {
    if (
      indiceUbicacion >=
      ubicacionesOrdenadas.length
    ) {
      setIndiceUbicacion(
        0
      );
    }
  }, [
    indiceUbicacion,
    ubicacionesOrdenadas.length,
  ]);


  const ubicacionActual =
    ubicacionesOrdenadas[
      indiceUbicacion
    ] ||
    null;


  const anteriorUbicacion =
    () => {
      if (
        ubicacionesOrdenadas.length <=
        1
      ) {
        return;
      }


      setIndiceUbicacion(
        (
          actual
        ) =>
          actual ===
          0
            ? ubicacionesOrdenadas.length -
              1
            : actual -
              1
      );
    };


  const siguienteUbicacion =
    () => {
      if (
        ubicacionesOrdenadas.length <=
        1
      ) {
        return;
      }


      setIndiceUbicacion(
        (
          actual
        ) =>
          (
            actual +
            1
          ) %
          ubicacionesOrdenadas.length
      );
    };


  return (
    <footer className="pie">
      <div className="pie__contenedor contenedor">

        {/* MARCA */}

        <div className="pie__columna pie__marca">
          <div className="pie__marcaVisual">
            <img
              src={
                URL_LOGO
              }
              alt="Chapaco Sport"
              className="pie__logo"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>

          <p className="pie__descripcion">
            {descripcionFooter ||
              DESCRIPCION_RESPALDO}
          </p>
        </div>


        {/* TIENDA */}

        <div className="pie__columna pie__tienda">
          <h3 className="pie__titulo">
            TIENDA
          </h3>

          <ul className="pie__lista">
            {ENLACES_TIENDA.map(
              (
                enlace
              ) => (
                <li
                  key={
                    enlace.ruta
                  }
                >
                  <NavLink
                    to={
                      enlace.ruta
                    }
                    className="pie__enlace"
                  >
                    {enlace.etiqueta}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>


        {/* REDES */}

        <div className="pie__columna pie__redesColumna">
          <h3 className="pie__titulo">
            REDES SOCIALES
          </h3>


          {redesOrdenadasVisualmente.length >
          0 ? (
            <div className="pie__socialDock">

              {redesOrdenadasVisualmente.map(
                (
                  grupo
                ) => {
                  const configuracion =
                    CONFIGURACION_REDES[
                      grupo.tipo
                    ];

                  const Icono =
                    configuracion
                      ?.Icono ||
                    ExternalLink;

                  const nombre =
                    configuracion
                      ?.nombre ||
                    grupo.tipo;

                  const clase =
                    configuracion
                      ?.clase ||
                    'otro';

                  const estaActiva =
                    redActiva ===
                    grupo.tipo;

                  const tieneVarias =
                    grupo.perfiles.length >
                    1;


                  return (
                    <div
                      key={
                        grupo.tipo
                      }
                      className={
                        `pie__socialDockItem ${
                          estaActiva
                            ? 'pie__socialDockItem--expandido'
                            : ''
                        }`
                      }
                    >
                      <button
                        type="button"
                        className={
                          `pie__redBoton pie__redBoton--${clase} ${
                            estaActiva
                              ? 'pie__redBoton--activo'
                              : ''
                          }`
                        }
                        onClick={() =>
                          manejarClickRed(
                            grupo
                          )
                        }
                        aria-label={
                          tieneVarias
                            ? `Mostrar cuentas de ${nombre}`
                            : `Abrir ${nombre}`
                        }
                        aria-expanded={
                          tieneVarias
                            ? estaActiva
                            : undefined
                        }
                        title={
                          nombre
                        }
                      >
                        <Icono
                          size={26}
                          strokeWidth={1.8}
                        />

                        {tieneVarias &&
                          !estaActiva && (
                          <span className="pie__redCantidad">
                            {grupo.perfiles.length}
                          </span>
                        )}
                      </button>


                      {estaActiva && (
                        <div className="pie__socialDockExpansion">
                          <span className="pie__socialDockNombre">
                            {nombre}
                          </span>


                          <div className="pie__socialDockCuentas">
                            {grupo.perfiles.map(
                              (
                                red
                              ) => (
                                <a
                                  key={
                                    red.id
                                  }
                                  href={
                                    red.url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pie__socialDockCuenta"
                                  title={
                                    red.nombre
                                  }
                                >
                                  <span>
                                    {obtenerNombreCorto(
                                      red,
                                      grupo.tipo
                                    )}
                                  </span>

                                  <ExternalLink
                                    size={10}
                                  />
                                </a>
                              )
                            )}
                          </div>


                          <button
                            type="button"
                            className="pie__socialDockCerrar"
                            onClick={() =>
                              setRedActiva(
                                ''
                              )
                            }
                            aria-label={`Cerrar ${nombre}`}
                          >
                            <X
                              size={13}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="pie__textoVacio">
              Redes sociales próximamente.
            </p>
          )}
        </div>


        {/* UBICACIONES */}

        <div className="pie__columna pie__ubicacionesColumna">
          <h3 className="pie__titulo">
            NUESTRA UBICACIÓN
          </h3>


          {ubicacionActual ? (
            <div className="pie__ubicacionCarrusel">

              <div className="pie__ubicacionSuperior">
                <button
                  type="button"
                  className="pie__ubicacionFlecha"
                  onClick={
                    anteriorUbicacion
                  }
                  disabled={
                    ubicacionesOrdenadas.length <=
                    1
                  }
                  aria-label="Ubicación anterior"
                >
                  <ChevronLeft
                    size={18}
                  />
                </button>


                <div className="pie__ubicacionTitulo">
                  <span>
                    {ubicacionActual.es_principal
                      ? 'PRINCIPAL'
                      : 'SUCURSAL'}
                  </span>

                  <strong>
                    {ubicacionActual.nombre}
                  </strong>
                </div>


                <button
                  type="button"
                  className="pie__ubicacionFlecha"
                  onClick={
                    siguienteUbicacion
                  }
                  disabled={
                    ubicacionesOrdenadas.length <=
                    1
                  }
                  aria-label="Siguiente ubicación"
                >
                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>


              <div className="pie__ubicacionContenido">
                {ubicacionActual.es_principal &&
                ubicacionActual.url_iframe ? (
                  <div className="pie__miniMapa">
                    <iframe
                      src={
                        ubicacionActual.url_iframe
                      }
                      width="100%"
                      height="108"
                      style={{
                        border: 0,
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title={`Ubicación ${ubicacionActual.nombre}`}
                    />
                  </div>
                ) : (
                  <div className="pie__sucursalVisual">
                    <div className="pie__sucursalVisualIcono">
                      <MapPin
                        size={25}
                        strokeWidth={1.8}
                      />
                    </div>

                    <span>
                      Sucursal Chapaco Sport
                    </span>
                  </div>
                )}


                {ubicacionActual.url_mapa ? (
                  <a
                    href={
                      ubicacionActual.url_mapa
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pie__ubicacionDireccionEnlace"
                    title="Abrir ubicación en Google Maps"
                  >
                    <MapPin
                      size={14}
                      strokeWidth={2}
                    />

                    <span>
                      {ubicacionActual.direccion}
                    </span>

                    <ExternalLink
                      size={12}
                    />
                  </a>
                ) : (
                  <div className="pie__ubicacionDireccionEnlace pie__ubicacionDireccionEnlace--sinLink">
                    <MapPin
                      size={14}
                    />

                    <span>
                      {ubicacionActual.direccion}
                    </span>
                  </div>
                )}
              </div>


              {ubicacionesOrdenadas.length >
                1 && (
                <div className="pie__ubicacionIndicadores">
                  {ubicacionesOrdenadas.map(
                    (
                      ubicacion,
                      indice
                    ) => (
                      <button
                        key={
                          ubicacion.id
                        }
                        type="button"
                        onClick={() =>
                          setIndiceUbicacion(
                            indice
                          )
                        }
                        className={
                          `pie__ubicacionPunto ${
                            indice ===
                            indiceUbicacion
                              ? 'pie__ubicacionPunto--activo'
                              : ''
                          }`
                        }
                        aria-label={`Ver ${ubicacion.nombre}`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="pie__textoVacio">
              Ubicación próximamente.
            </p>
          )}
        </div>
      </div>


      <div className="pie__inferior">
        <span>
          CHAPACO SPORT
        </span>

        <span>
          Vive el deporte. Viste con pasión.
        </span>
      </div>
    </footer>
  );
}


export default PieDePagina;
