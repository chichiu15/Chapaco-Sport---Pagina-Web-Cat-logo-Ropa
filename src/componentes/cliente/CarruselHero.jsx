import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import './CarruselHero.css';


const DURACION_MS = 6000;

const DISTANCIA_MINIMA_DESLIZAMIENTO = 55;


function CarruselHero({
  diapositivas = [],
}) {

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
    arrastrando,
    setArrastrando,
  ] =
    useState(false);


  const gestoRef =
    useRef({
      activo: false,
      ignorar: false,
      pointerId: null,
      inicioX: 0,
      inicioY: 0,
    });


  // =====================================================
  // CORREGIR ÍNDICE SI FIRESTORE CAMBIA
  // =====================================================

  useEffect(() => {

    if (
      diapositivas.length ===
      0
    ) {

      setIndiceActivo(
        0
      );

      return;
    }


    if (
      indiceActivo >=
      diapositivas.length
    ) {

      setIndiceActivo(
        0
      );
    }

  }, [
    diapositivas.length,
    indiceActivo,
  ]);


  const diapositivaActiva =
    diapositivas[
      indiceActivo
    ] ||
    null;


  const indiceSiguiente =
    useMemo(
      () => {

        if (
          diapositivas.length <=
          1
        ) {
          return null;
        }


        return (
          indiceActivo +
          1
        ) %
        diapositivas.length;

      },
      [
        indiceActivo,
        diapositivas.length,
      ]
    );


  // =====================================================
  // PRECARGAR SIGUIENTE IMAGEN
  // =====================================================

  useEffect(() => {

    if (
      indiceSiguiente ===
      null
    ) {
      return;
    }


    const siguiente =
      diapositivas[
        indiceSiguiente
      ];


    if (
      !siguiente?.imagenFondo
    ) {
      return;
    }


    const imagen =
      new Image();


    imagen.decoding =
      'async';


    imagen.src =
      siguiente.imagenFondo;

  }, [
    indiceSiguiente,
    diapositivas,
  ]);


  // =====================================================
  // PRECARGAR RESTO CUANDO EL NAVEGADOR ESTÉ LIBRE
  // =====================================================

  useEffect(() => {

    if (
      diapositivas.length <=
      2
    ) {
      return undefined;
    }


    const precargarResto =
      () => {

        diapositivas.forEach(
          (
            diapositiva,
            indice
          ) => {

            if (
              indice ===
                indiceActivo ||
              indice ===
                indiceSiguiente ||
              !diapositiva.imagenFondo
            ) {
              return;
            }


            const imagen =
              new Image();


            imagen.decoding =
              'async';


            imagen.src =
              diapositiva.imagenFondo;

          }
        );
      };


    let idIdle =
      null;


    let timeout =
      null;


    if (
      typeof window.requestIdleCallback ===
      'function'
    ) {

      idIdle =
        window.requestIdleCallback(
          precargarResto,
          {
            timeout:
              2500,
          }
        );

    } else {

      timeout =
        window.setTimeout(
          precargarResto,
          1200
        );
    }


    return () => {

      if (
        idIdle !==
          null &&
        typeof window.cancelIdleCallback ===
          'function'
      ) {

        window.cancelIdleCallback(
          idIdle
        );
      }


      if (
        timeout !==
        null
      ) {

        window.clearTimeout(
          timeout
        );
      }
    };

  }, [
    diapositivas,
    indiceActivo,
    indiceSiguiente,
  ]);


  // =====================================================
  // NAVEGACIÓN
  // =====================================================

  const irAnterior =
    useCallback(
      () => {

        if (
          diapositivas.length <=
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
              diapositivas.length
            ) %
            diapositivas.length
        );

      },
      [
        diapositivas.length,
      ]
    );


  const irSiguiente =
    useCallback(
      () => {

        if (
          diapositivas.length <=
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
            diapositivas.length
        );

      },
      [
        diapositivas.length,
      ]
    );


  // =====================================================
  // ROTACIÓN AUTOMÁTICA
  // =====================================================

  useEffect(() => {

    if (
      enPausa ||
      arrastrando ||
      diapositivas.length <=
        1
    ) {
      return undefined;
    }


    const temporizador =
      window.setInterval(
        () => {

          setIndiceActivo(
            (
              indice
            ) =>
              (
                indice +
                1
              ) %
              diapositivas.length
          );

        },
        DURACION_MS
      );


    return () => {

      window.clearInterval(
        temporizador
      );
    };

  }, [
    enPausa,
    arrastrando,
    diapositivas.length,
  ]);


  // =====================================================
  // DESLIZAR CON DEDO / LÁPIZ / MOUSE
  // =====================================================

  const iniciarDeslizamiento =
    (
      evento
    ) => {

      if (
        diapositivas.length <=
        1
      ) {
        return;
      }


      /*
        Si el gesto comenzó sobre un botón,
        enlace o campo interactivo, dejamos
        que ese elemento funcione normalmente.
      */

      const elementoInteractivo =
        evento.target.closest(
          'a, button, input, textarea, select'
        );


      gestoRef.current = {
        activo:
          !elementoInteractivo,

        ignorar:
          Boolean(
            elementoInteractivo
          ),

        pointerId:
          evento.pointerId,

        inicioX:
          evento.clientX,

        inicioY:
          evento.clientY,
      };


      if (
        elementoInteractivo
      ) {
        return;
      }


      setArrastrando(
        true
      );


      evento.currentTarget
        .setPointerCapture?.(
          evento.pointerId
        );
    };


  const finalizarDeslizamiento =
    (
      evento
    ) => {

      const gesto =
        gestoRef.current;


      if (
        !gesto.activo ||
        gesto.ignorar ||
        gesto.pointerId !==
          evento.pointerId
      ) {

        gestoRef.current.activo =
          false;

        setArrastrando(
          false
        );

        return;
      }


      const diferenciaX =
        evento.clientX -
        gesto.inicioX;


      const diferenciaY =
        evento.clientY -
        gesto.inicioY;


      const desplazamientoHorizontal =
        Math.abs(
          diferenciaX
        );


      const desplazamientoVertical =
        Math.abs(
          diferenciaY
        );


      /*
        Solo cambiamos de diapositiva si:
        - el movimiento fue suficientemente largo;
        - fue principalmente horizontal.
      */

      if (
        desplazamientoHorizontal >=
          DISTANCIA_MINIMA_DESLIZAMIENTO &&
        desplazamientoHorizontal >
          desplazamientoVertical
      ) {

        if (
          diferenciaX <
          0
        ) {

          irSiguiente();

        } else {

          irAnterior();
        }
      }


      gestoRef.current.activo =
        false;


      setArrastrando(
        false
      );


      try {

        evento.currentTarget
          .releasePointerCapture?.(
            evento.pointerId
          );

      } catch {

        // No es necesario hacer nada.
      }
    };


  const cancelarDeslizamiento =
    () => {

      gestoRef.current.activo =
        false;


      setArrastrando(
        false
      );
    };


  // =====================================================
  // SIN DIAPOSITIVA
  // =====================================================

  if (
    !diapositivaActiva
  ) {
    return null;
  }


  const botonTexto =
    diapositivaActiva.enlaceBoton ||
    'VER MÁS';


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      className={
        `carruselHero ${
          arrastrando
            ? 'carruselHero--arrastrando'
            : ''
        }`
      }
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
      onPointerDown={
        iniciarDeslizamiento
      }
      onPointerUp={
        finalizarDeslizamiento
      }
      onPointerCancel={
        cancelarDeslizamiento
      }
      aria-roledescription="carrusel"
      aria-label="Destacados de Chapaco Sport"
    >

      {/* ===============================================
          DIAPOSITIVA ACTIVA
      =============================================== */}

      <article
        key={
          diapositivaActiva.id
        }
        className="carruselHero__diapositiva carruselHero__diapositiva--activa"
      >

        <img
          src={
            diapositivaActiva.imagenFondo
          }
          alt=""
          aria-hidden="true"
          className="carruselHero__imagenFondo"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          draggable="false"
        />


        <div className="carruselHero__overlay" />


        <div className="contenedor carruselHero__contenido">

          <div className="carruselHero__textos">

            {
              diapositivaActiva.sintesis && (

                <span className="carruselHero__sintesis">
                  {
                    diapositivaActiva.sintesis
                  }
                </span>

              )
            }


            <h1 className="carruselHero__titulo">

              <span className="carruselHero__ganchoUno">
                {
                  diapositivaActiva.ganchoUno
                }
              </span>


              <span className="carruselHero__ganchoDos">
                {
                  diapositivaActiva.ganchoDos
                }
              </span>

            </h1>


            {
              diapositivaActiva.descripcion && (

                <p className="carruselHero__descripcion">
                  {
                    diapositivaActiva.descripcion
                  }
                </p>

              )
            }


            {
              diapositivaActiva.tipoEnlace ===
              'externo'
                ? (

                  <a
                    href={
                      diapositivaActiva.enlace
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="carruselHero__boton"
                  >

                    {
                      botonTexto
                    }


                    <span
                      className="carruselHero__flechaBoton"
                      aria-hidden="true"
                    >
                      →
                    </span>

                  </a>

                )
                : (

                  <Link
                    to={
                      diapositivaActiva.enlace ||
                      '/catalogo'
                    }
                    className="carruselHero__boton"
                  >

                    {
                      botonTexto
                    }


                    <span
                      className="carruselHero__flechaBoton"
                      aria-hidden="true"
                    >
                      →
                    </span>

                  </Link>

                )
            }

          </div>

        </div>

      </article>


      {/* ===============================================
          CONTROLES
      =============================================== */}

      {
        diapositivas.length >
          1 && (

          <>

            <button
              type="button"
              className="carruselHero__flecha carruselHero__flecha--izquierda"
              onClick={
                irAnterior
              }
              aria-label="Diapositiva anterior"
            >

              <ChevronLeft
                size={26}
                strokeWidth={2}
                aria-hidden="true"
              />

            </button>


            <button
              type="button"
              className="carruselHero__flecha carruselHero__flecha--derecha"
              onClick={
                irSiguiente
              }
              aria-label="Siguiente diapositiva"
            >

              <ChevronRight
                size={26}
                strokeWidth={2}
                aria-hidden="true"
              />

            </button>


            <div
              className="carruselHero__puntos"
              role="tablist"
              aria-label="Seleccionar diapositiva"
            >

              {
                diapositivas.map(
                  (
                    diapositiva,
                    indice
                  ) => (

                    <button
                      key={
                        diapositiva.id
                      }
                      type="button"
                      role="tab"
                      aria-selected={
                        indice ===
                        indiceActivo
                      }
                      aria-label={
                        `Ir a diapositiva ${indice + 1}`
                      }
                      className={
                        `carruselHero__punto ${
                          indice ===
                          indiceActivo
                            ? 'carruselHero__punto--activo'
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

        )
      }

    </section>
  );
}


export default CarruselHero;