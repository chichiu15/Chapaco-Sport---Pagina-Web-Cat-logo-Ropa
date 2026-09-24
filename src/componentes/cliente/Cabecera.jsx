import {
  useEffect,
  useState,
} from 'react';

import {
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  Search,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react';

import {
  ENLACES_NAV,
  URL_LOGO,
} from '../../utilidades/Constantes';

import './Cabecera.css';

import usarCarrito
  from '../../hooks/usarCarrito';


function Cabecera({
  alAbrirCarrito,
}) {

  const [
    conScroll,
    setConScroll,
  ] =
    useState(false);


  const [
    menuAbierto,
    setMenuAbierto,
  ] =
    useState(false);


  const [
    terminoBusqueda,
    setTerminoBusqueda,
  ] =
    useState('');


  const {
    cantidadTotal,
  } =
    usarCarrito();


  const navegar =
    useNavigate();


  const ubicacion =
    useLocation();


  // ======================================================
  // SCROLL
  // ======================================================

  useEffect(() => {

    const alScrollear =
      () =>
        setConScroll(
          window.scrollY >
            40
        );


    alScrollear();


    window.addEventListener(
      'scroll',
      alScrollear,
      {
        passive: true,
      }
    );


    return () =>
      window.removeEventListener(
        'scroll',
        alScrollear
      );

  }, []);


  // ======================================================
  // CERRAR MENÚ AL CAMBIAR DE RUTA
  // ======================================================

  useEffect(() => {

    setMenuAbierto(
      false
    );

  }, [
    ubicacion.pathname,
    ubicacion.search,
  ]);


  // ======================================================
  // BLOQUEAR SCROLL CON MENÚ ABIERTO
  // ======================================================

  useEffect(() => {

    document.body.style.overflow =
      menuAbierto
        ? 'hidden'
        : '';


    return () => {

      document.body.style.overflow =
        '';
    };

  }, [
    menuAbierto
  ]);


  // ======================================================
  // BÚSQUEDA
  // ======================================================

  const manejarBusqueda =
    (
      evento
    ) => {

      evento.preventDefault();


      const termino =
        terminoBusqueda.trim();


      navegar(
        termino
          ? `/busqueda?q=${encodeURIComponent(
              termino
            )}`
          : '/catalogo'
      );
    };


  // ======================================================
  // RUTA SEGURA DEL MENÚ
  // ======================================================

  const obtenerRutaEnlace =
    (
      enlace
    ) => {

      if (
        enlace.etiqueta
          ?.toUpperCase() ===
        'MARCAS'
      ) {
        return '/marcas';
      }


      return enlace.ruta;
    };


  return (
    <header
      className={
        `cabecera ${
          conScroll
            ? 'cabecera--conScroll'
            : ''
        }`
      }
    >

      <div className="cabecera__contenedor">


        {/* =================================================
            LOGO
        ================================================= */}

        <NavLink
          to="/"
          className="cabecera__logo"
          aria-label="Ir al inicio"
        >

          <img
            src={
              URL_LOGO
            }
            alt="Chapaco Sport"
            loading="eager"
            decoding="async"
            fetchPriority="auto"
          />

        </NavLink>


        {/* =============================================
            NAVEGACIÓN DESKTOP
        ============================================= */}

        <nav
          className="cabecera__navDesktop"
          aria-label="Navegación principal"
        >

          <ul>

            {
              ENLACES_NAV.map(
                (
                  enlace
                ) => {

                  const ruta =
                    obtenerRutaEnlace(
                      enlace
                    );


                  return (
                    <li
                      key={
                        enlace.etiqueta
                      }
                    >

                      <NavLink
                        to={
                          ruta
                        }
                        end={
                          ruta === '/' ||
                          ruta === '/catalogo' ||
                          ruta === '/marcas' ||
                          ruta === '/ofertas'
                        }
                        className={({
                          isActive,
                        }) =>
                          `cabecera__enlace ${
                            isActive
                              ? 'cabecera__enlace--activo'
                              : ''
                          }`
                        }
                      >
                        {
                          enlace.etiqueta
                        }
                      </NavLink>

                    </li>
                  );

                }
              )
            }

          </ul>

        </nav>


        {/* =============================================
            BUSCADOR DESKTOP
        ============================================= */}

        <form
          className="cabecera__buscador"
          onSubmit={
            manejarBusqueda
          }
          role="search"
        >

          <input
            type="search"
            placeholder="Buscar..."
            value={
              terminoBusqueda
            }
            onChange={(
              evento
            ) =>
              setTerminoBusqueda(
                evento.target.value
              )
            }
            aria-label="Buscar productos"
          />


          <button
            type="submit"
            aria-label="Buscar"
          >

            <Search
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />

          </button>

        </form>


        {/* =============================================
            ACCIONES
        ============================================= */}

        <div className="cabecera__acciones">


          {/* CARRITO */}

          <button
            type="button"
            className="cabecera__carrito"
            onClick={
              alAbrirCarrito
            }
            aria-label="Abrir carrito de compras"
            style={{
              background:
                'transparent',

              border:
                'none',

              cursor:
                'pointer',

              color:
                'inherit',
            }}
          >

            <ShoppingCart
              size={22}
              strokeWidth={2}
              aria-hidden="true"
            />


            {
              cantidadTotal >
                0 && (

                <span className="cabecera__carritoContador">

                  {
                    cantidadTotal >
                    99
                      ? '99+'
                      : cantidadTotal
                  }

                </span>

              )
            }

          </button>


          {/* MENÚ MÓVIL */}

          <button
            type="button"
            className="cabecera__botonMenu"
            aria-label={
              menuAbierto
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            aria-expanded={
              menuAbierto
            }
            onClick={() =>
              setMenuAbierto(
                (
                  valor
                ) =>
                  !valor
              )
            }
          >

            {
              menuAbierto
                ? (
                  <X
                    size={24}
                    aria-hidden="true"
                  />
                )
                : (
                  <Menu
                    size={24}
                    aria-hidden="true"
                  />
                )
            }

          </button>

        </div>

      </div>


      {/* ===============================================
          MENÚ MÓVIL
      =============================================== */}

      <div
        className={
          `cabecera__menuMovil ${
            menuAbierto
              ? 'cabecera__menuMovil--abierto'
              : ''
          }`
        }
      >

        <nav
          aria-label="Navegación principal móvil"
        >

          <ul>

            {
              ENLACES_NAV.map(
                (
                  enlace
                ) => {

                  const ruta =
                    obtenerRutaEnlace(
                      enlace
                    );


                  return (
                    <li
                      key={
                        enlace.etiqueta
                      }
                    >

                      <NavLink
                        to={
                          ruta
                        }
                        end={
                          ruta === '/' ||
                          ruta === '/catalogo' ||
                          ruta === '/marcas' ||
                          ruta === '/ofertas'
                        }
                        className={({
                          isActive,
                        }) =>
                          `cabecera__enlace cabecera__enlace--movil ${
                            isActive
                              ? 'cabecera__enlace--activo'
                              : ''
                          }`
                        }
                      >
                        {
                          enlace.etiqueta
                        }
                      </NavLink>

                    </li>
                  );

                }
              )
            }

          </ul>

        </nav>


        {/* BUSCADOR MÓVIL */}

        <form
          className="cabecera__buscador cabecera__buscador--movil"
          onSubmit={
            manejarBusqueda
          }
          role="search"
        >

          <input
            type="search"
            placeholder="Buscar..."
            value={
              terminoBusqueda
            }
            onChange={(
              evento
            ) =>
              setTerminoBusqueda(
                evento.target.value
              )
            }
            aria-label="Buscar productos"
          />


          <button
            type="submit"
            aria-label="Buscar"
          >

            <Search
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />

          </button>

        </form>

      </div>

    </header>
  );
}


export default Cabecera;
