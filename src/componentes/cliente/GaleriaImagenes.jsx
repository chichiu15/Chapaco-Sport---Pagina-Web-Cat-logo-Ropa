import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';

import './GaleriaImagenes.css';


const DURACION_MS = 5500;


function GaleriaImagenes({
  imagenes = [],
  nombreProducto = 'Producto',
}) {
  const imagenesValidas =
    useMemo(() => {
      if (
        !Array.isArray(
          imagenes
        )
      ) {
        return [];
      }

      return imagenes.filter(
        Boolean
      );
    }, [
      imagenes
    ]);


  const [
    indiceActivo,
    setIndiceActivo,
  ] =
    useState(0);


  const [
    enPausa,
    setEnPausa,
  ] =
    useState(false);


  const [
    zoomAbierto,
    setZoomAbierto,
  ] =
    useState(false);


  // =====================================================
  // REINICIAR AL CAMBIAR DE PRODUCTO / IMÁGENES
  // =====================================================

  useEffect(() => {

    setIndiceActivo(
      0
    );

  }, [
    imagenesValidas.length,
    imagenesValidas[0],
  ]);


  // =====================================================
  // CORREGIR ÍNDICE
  // =====================================================

  useEffect(() => {

    if (
      imagenesValidas.length ===
      0
    ) {

      setIndiceActivo(
        0
      );

      return;
    }


    if (
      indiceActivo >=
      imagenesValidas.length
    ) {

      setIndiceActivo(
        0
      );
    }

  }, [
    imagenesValidas.length,
    indiceActivo,
  ]);


  const imagenActiva =
    imagenesValidas[
      indiceActivo
    ] ||
    '';


  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  const irAnterior =
    useCallback(
      () => {

        if (
          imagenesValidas.length <=
          1
        ) {
          return;
        }


        setIndiceActivo(
          (
            indice
          ) =>
            (
              indice -
              1 +
              imagenesValidas.length
            ) %
            imagenesValidas.length
        );

      },
      [
        imagenesValidas.length,
      ]
    );


  const irSiguiente =
    useCallback(
      () => {

        if (
          imagenesValidas.length <=
          1
        ) {
          return;
        }


        setIndiceActivo(
          (
            indice
          ) =>
            (
              indice +
              1
            ) %
            imagenesValidas.length
        );

      },
      [
        imagenesValidas.length,
      ]
    );


  // =====================================================
  // PRECARGAR SIGUIENTE
  // =====================================================

  useEffect(() => {

    if (
      imagenesValidas.length <=
      1
    ) {
      return;
    }


    const siguienteIndice =
      (
        indiceActivo +
        1
      ) %
      imagenesValidas.length;


    const siguiente =
      imagenesValidas[
        siguienteIndice
      ];


    if (!siguiente) {
      return;
    }


    const preload =
      new Image();


    preload.src =
      siguiente;

  }, [
    indiceActivo,
    imagenesValidas,
  ]);


  // =====================================================
  // ROTACIÓN AUTOMÁTICA
  // =====================================================

  useEffect(() => {

    if (
      enPausa ||
      zoomAbierto ||
      imagenesValidas.length <=
        1
    ) {
      return undefined;
    }


    const temporizador =
      window.setInterval(
        irSiguiente,
        DURACION_MS
      );


    return () => {

      window.clearInterval(
        temporizador
      );
    };

  }, [
    enPausa,
    zoomAbierto,
    imagenesValidas.length,
    irSiguiente,
  ]);


  // =====================================================
  // TECLADO DEL ZOOM
  // =====================================================

  useEffect(() => {

    if (
      !zoomAbierto
    ) {
      return undefined;
    }


    const manejarTecla =
      (
        evento
      ) => {

        if (
          evento.key ===
          'Escape'
        ) {

          setZoomAbierto(
            false
          );
        }


        if (
          evento.key ===
          'ArrowLeft'
        ) {

          irAnterior();
        }


        if (
          evento.key ===
          'ArrowRight'
        ) {

          irSiguiente();
        }
      };


    window.addEventListener(
      'keydown',
      manejarTecla
    );


    return () => {

      window.removeEventListener(
        'keydown',
        manejarTecla
      );
    };

  }, [
    zoomAbierto,
    irAnterior,
    irSiguiente,
  ]);


  // =====================================================
  // SIN IMÁGENES
  // =====================================================

  if (
    imagenesValidas.length ===
    0
  ) {
    return (
      <div
        className="galeriaProducto galeriaProducto--vacia"
        role="status"
      >
        <p>
          Sin imágenes disponibles
        </p>
      </div>
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      <section
        className="galeriaProducto"
        onMouseEnter={() =>
          setEnPausa(
            true
          )
        }
        onMouseLeave={() =>
          setEnPausa(
            false
          )
        }
        aria-roledescription="carrusel"
        aria-label={
          `Galería de imágenes de ${nombreProducto}`
        }
      >

        {/* ===============================================
            VISOR PRINCIPAL
        =============================================== */}

        <div className="galeriaProducto__visor">

          <button
            type="button"
            className="galeriaProducto__diapositiva galeriaProducto__diapositiva--activa"
            onClick={() =>
              setZoomAbierto(
                true
              )
            }
            aria-label={
              `Ampliar imagen ${indiceActivo + 1} de ${imagenesValidas.length} de ${nombreProducto}`
            }
          >

            <img
              key={
                `${imagenActiva}-${indiceActivo}`
              }
              src={
                imagenActiva
              }
              alt={
                `${nombreProducto}, imagen ${indiceActivo + 1} de ${imagenesValidas.length}`
              }
              className="galeriaProducto__imagen"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

          </button>


          <button
            type="button"
            className="galeriaProducto__ampliar"
            onClick={() =>
              setZoomAbierto(
                true
              )
            }
            aria-label={
              `Ampliar imagen de ${nombreProducto}`
            }
          >

            <Maximize2
              size={15}
              aria-hidden="true"
            />


            <span>
              AMPLIAR
            </span>

          </button>


          {
            imagenesValidas.length >
              1 && (

            <>

              <button
                type="button"
                className="galeriaProducto__flecha galeriaProducto__flecha--izquierda"
                onClick={
                  irAnterior
                }
                aria-label="Imagen anterior"
              >

                <ChevronLeft
                  size={25}
                  strokeWidth={2}
                  aria-hidden="true"
                />

              </button>


              <button
                type="button"
                className="galeriaProducto__flecha galeriaProducto__flecha--derecha"
                onClick={
                  irSiguiente
                }
                aria-label="Imagen siguiente"
              >

                <ChevronRight
                  size={25}
                  strokeWidth={2}
                  aria-hidden="true"
                />

              </button>


              <div
                className="galeriaProducto__puntos"
                role="tablist"
                aria-label="Seleccionar imagen del producto"
              >

                {
                  imagenesValidas.map(
                    (
                      _,
                      indice
                    ) => (

                      <button
                        key={
                          indice
                        }
                        type="button"
                        role="tab"
                        aria-selected={
                          indice ===
                          indiceActivo
                        }
                        aria-label={
                          `Ir a imagen ${indice + 1} de ${imagenesValidas.length}`
                        }
                        className={
                          `galeriaProducto__punto ${
                            indice ===
                            indiceActivo
                              ? 'galeriaProducto__punto--activo'
                              : ''
                          }`
                        }
                        onClick={() =>
                          setIndiceActivo(
                            indice
                          )
                        }
                      />

                    )
                  )
                }

              </div>

            </>

          )}


        </div>


        {/* ===============================================
            MINIATURAS
        =============================================== */}

        {
          imagenesValidas.length >
            1 && (

          <div
            className="galeriaProducto__miniaturas"
            aria-label="Miniaturas del producto"
          >

            {
              imagenesValidas.map(
                (
                  imagen,
                  indice
                ) => (

                  <button
                    key={
                      `${imagen}-miniatura-${indice}`
                    }
                    type="button"
                    className={
                      `galeriaProducto__miniatura ${
                        indice ===
                        indiceActivo
                          ? 'galeriaProducto__miniatura--activa'
                          : ''
                      }`
                    }
                    onClick={() =>
                      setIndiceActivo(
                        indice
                      )
                    }
                    aria-label={
                      `Seleccionar imagen ${indice + 1} de ${nombreProducto}`
                    }
                    aria-pressed={
                      indice ===
                      indiceActivo
                    }
                  >

                    <img
                      src={
                        imagen
                      }
                      alt={
                        `${nombreProducto}, miniatura ${indice + 1}`
                      }
                      loading="lazy"
                      decoding="async"
                    />

                  </button>

                )
              )
            }

          </div>

        )}


      </section>


      {/* ===============================================
          ZOOM
      =============================================== */}

      {
        zoomAbierto && (

        <div
          className="galeriaProducto__zoom"
          onClick={() =>
            setZoomAbierto(
              false
            )
          }
          role="dialog"
          aria-modal="true"
          aria-label={
            `Imagen ampliada de ${nombreProducto}`
          }
        >

          <button
            type="button"
            className="galeriaProducto__zoomCerrar"
            onClick={() =>
              setZoomAbierto(
                false
              )
            }
            aria-label="Cerrar imagen ampliada"
          >

            <X
              size={26}
              aria-hidden="true"
            />

          </button>


          {
            imagenesValidas.length >
              1 && (

            <button
              type="button"
              className="galeriaProducto__zoomFlecha galeriaProducto__zoomFlecha--izquierda"
              onClick={
                (
                  evento
                ) => {

                  evento.stopPropagation();

                  irAnterior();
                }
              }
              aria-label="Ver imagen anterior"
            >

              <ChevronLeft
                size={34}
                aria-hidden="true"
              />

            </button>

          )}


          <img
            src={
              imagenActiva
            }
            alt={
              `${nombreProducto}, imagen ampliada ${indiceActivo + 1} de ${imagenesValidas.length}`
            }
            className="galeriaProducto__zoomImagen"
            loading="eager"
            decoding="async"
            onClick={
              (
                evento
              ) =>
                evento.stopPropagation()
            }
          />


          {
            imagenesValidas.length >
              1 && (

            <button
              type="button"
              className="galeriaProducto__zoomFlecha galeriaProducto__zoomFlecha--derecha"
              onClick={
                (
                  evento
                ) => {

                  evento.stopPropagation();

                  irSiguiente();
                }
              }
              aria-label="Ver imagen siguiente"
            >

              <ChevronRight
                size={34}
                aria-hidden="true"
              />

            </button>

          )}


          <div
            className="galeriaProducto__zoomContador"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {indiceActivo + 1}
            {' / '}
            {
              imagenesValidas.length
            }
          </div>

        </div>

      )}


    </>
  );
}


export default GaleriaImagenes;