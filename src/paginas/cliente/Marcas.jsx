import {
  useMemo,
  useState
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Sparkles,
} from 'lucide-react';

import {
  usarCatalogo
} from '../../hooks/usarCatalogo';

import TarjetaProducto
  from '../../componentes/cliente/TarjetaProducto';

import CargandoPagina
  from '../../componentes/comun/CargandoPagina';

import SEO
  from '../../componentes/comun/SEO';

import './Marcas.css';


// =========================================================
// HERO DE MARCAS
// =========================================================

const URL_HERO_MARCAS =
  'https://firebasestorage.googleapis.com/v0/b/chapacosport-1468a.firebasestorage.app/o/marcas-ui%2Fhero%2Fhero-marcas.webp?alt=media&token=4d4f5f9c-f0e3-4df1-a5d1-3b745b949cbe';


// =========================================================
// VALIDAR ESTADO DE MARCA
// =========================================================

const esMarcaActiva = (
  marca
) => {
  const estado =
    marca.estado ??
    marca.activo;

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


// =========================================================
// COMPONENTE
// =========================================================

function Marcas() {
  const {
    productos,
    marcas,
    cargando,
    error
  } = usarCatalogo();

  const [
    marcaSeleccionada,
    setMarcaSeleccionada
  ] = useState(null);


  // ======================================================
  // SEO DINÁMICO
  // ======================================================

  const seo =
    useMemo(
      () => {

        if (
          marcaSeleccionada
        ) {
          const nombreMarca =
            marcaSeleccionada.nombre ||
            marcaSeleccionada.id;

          return {
            titulo:
              `${nombreMarca} | Marcas Chapaco Sport`,

            descripcion:
              `Descubre los productos disponibles de ${nombreMarca} en Chapaco Sport. Explora ropa deportiva, novedades y prendas para hombre.`,

            ruta:
              '/marcas',
          };
        }

        return {
          titulo:
            'Marcas deportivas | Chapaco Sport',

          descripcion:
            'Explora las marcas disponibles en Chapaco Sport y descubre colecciones de ropa deportiva para hombre, novedades y productos seleccionados.',

          ruta:
            '/marcas',
        };

      },
      [
        marcaSeleccionada
      ]
    );


  // ======================================================
  // MARCAS ACTIVAS
  // ======================================================

  const marcasConProductos =
    useMemo(
      () => {
        return marcas
          .filter(
            esMarcaActiva
          )

          .map(
            (marca) => {
              const productosMarca =
                productos.filter(
                  (producto) =>
                    producto.marca_id ===
                    marca.id
                );

              return {
                ...marca,

                cantidadProductos:
                  productosMarca.length,

                logo:
                  marca.logo || ''
              };
            }
          );
      },
      [
        marcas,
        productos
      ]
    );


  // ======================================================
  // PRODUCTOS MARCA SELECCIONADA
  // ======================================================

  const productosDeMarca =
    useMemo(
      () => {
        if (
          !marcaSeleccionada
        ) {
          return [];
        }

        return productos.filter(
          (producto) =>
            producto.marca_id ===
            marcaSeleccionada.id
        );
      },
      [
        productos,
        marcaSeleccionada
      ]
    );


  // ======================================================
  // SELECCIONAR MARCA
  // ======================================================

  const seleccionarMarca = (
    marca
  ) => {
    setMarcaSeleccionada(
      marca
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  // ======================================================
  // VOLVER
  // ======================================================

  const volverAMarcas = () => {
    setMarcaSeleccionada(
      null
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  // ======================================================
  // CARGANDO
  // ======================================================

  if (cargando) {
    return (
      <>
        <SEO
          titulo={
            seo.titulo
          }
          descripcion={
            seo.descripcion
          }
          ruta={
            seo.ruta
          }
        />

        <CargandoPagina />
      </>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <>
        <SEO
          titulo={
            seo.titulo
          }
          descripcion={
            seo.descripcion
          }
          ruta={
            seo.ruta
          }
        />

        <div className="pantallaMarcas">

          <div className="marcas__estado">

            <h1>
              No pudimos cargar las marcas
            </h1>

            <p>
              Ocurrió un error al obtener la información.
            </p>

          </div>

        </div>
      </>
    );
  }


  // ======================================================
  // LISTADO PRINCIPAL
  // ======================================================

  if (!marcaSeleccionada) {
    return (
      <div className="pantallaMarcas">

        <SEO
          titulo={
            seo.titulo
          }
          descripcion={
            seo.descripcion
          }
          ruta={
            seo.ruta
          }
        />


        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="marcasHero"
          aria-labelledby="marcas-titulo-principal"
        >

          <div
            className="marcasHero__fondoTexto"
            aria-hidden="true"
          >
            BRANDS
          </div>


          <div className="marcasHero__contenido">

            <div className="marcasHero__badge">

              <Sparkles
                size={15}
                aria-hidden="true"
              />

              <span>
                MARCAS CHAPACO SPORT
              </span>

            </div>


            <h1 id="marcas-titulo-principal">

              ENCUENTRA TU MARCA.

              <span>
                DEFINE TU ESTILO.
              </span>

            </h1>


            <p>
              Descubre colecciones seleccionadas
              de las mejores marcas deportivas y
              encuentra el estilo que mejor va
              contigo.
            </p>

          </div>


          <div className="marcasHero__visual">

            <div className="marcasHero__imagenWrapper">

              <div
                className="marcasHero__resplandor"
                aria-hidden="true"
              />


              <img
                src={
                  URL_HERO_MARCAS
                }
                alt="Colección de marcas deportivas de Chapaco Sport"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            MARCAS
        ================================================= */}

        <section
          className="marcasSeccion"
          aria-labelledby="marcas-listado-titulo"
        >

          <div className="marcasSeccion__encabezado">

            <div>

              <span className="marcasSeccion__eyebrow">
                EXPLORA
              </span>

              <h2 id="marcas-listado-titulo">
                NUESTRAS MARCAS
              </h2>

            </div>


            <p>
              Desliza para explorar y selecciona
              una marca para descubrir todos sus
              productos disponibles.
            </p>

          </div>


          {marcasConProductos.length >
          0 ? (

            <div
              className="marcasSeccion__grid"
              aria-label="Marcas disponibles"
            >

              {marcasConProductos.map(
                (
                  marca,
                  indice
                ) => (

                  <button
                    type="button"
                    key={
                      marca.id
                    }
                    className="marcaCard"
                    onClick={() =>
                      seleccionarMarca(
                        marca
                      )
                    }
                    aria-label={`Ver colección de ${
                      marca.nombre ||
                      marca.id
                    }`}
                  >

                    <span
                      className="marcaCard__numero"
                      aria-hidden="true"
                    >

                      {String(
                        indice + 1
                      ).padStart(
                        2,
                        '0'
                      )}

                    </span>


                    {marca.logo && (

                      <div className="marcaCard__logo">

                        <img
                          src={
                            marca.logo
                          }
                          alt={`Logo de ${
                            marca.nombre ||
                            marca.id
                          }`}
                          loading="lazy"
                          decoding="async"
                        />

                      </div>

                    )}


                    <div className="marcaCard__contenido">

                      <span className="marcaCard__label">
                        MARCA
                      </span>

                      <h3>
                        {marca.nombre ||
                          marca.id}
                      </h3>

                      <p>

                        {marca.cantidadProductos}{' '}

                        {marca.cantidadProductos ===
                        1
                          ? 'producto disponible'
                          : 'productos disponibles'}

                      </p>

                    </div>


                    <div className="marcaCard__footer">

                      <span>
                        VER COLECCIÓN
                      </span>

                      <ArrowRight
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />

                    </div>

                  </button>

                )
              )}

            </div>

          ) : (

            <div className="marcas__estado">

              <h2>
                No hay marcas disponibles
              </h2>

              <p>
                Todavía no existen marcas activas.
              </p>

            </div>

          )}

        </section>

      </div>
    );
  }


  // ======================================================
  // DETALLE MARCA
  // ======================================================

  return (
    <div className="pantallaMarcas">

      <SEO
        titulo={
          seo.titulo
        }
        descripcion={
          seo.descripcion
        }
        ruta={
          seo.ruta
        }
      />


      <section
        className="marcaDetalleHero"
        aria-labelledby="marca-detalle-titulo"
      >

        <div
          className="marcaDetalleHero__fondoTexto"
          aria-hidden="true"
        >

          {marcaSeleccionada.nombre ||
            marcaSeleccionada.id}

        </div>


        <div className="marcaDetalleHero__contenido">

          <button
            type="button"
            className="marcaDetalleHero__volver"
            onClick={
              volverAMarcas
            }
          >

            <ArrowLeft
              size={17}
              aria-hidden="true"
            />

            <span>
              VER TODAS LAS MARCAS
            </span>

          </button>


          <div className="marcaDetalleHero__badge">

            <BadgePercent
              size={15}
              aria-hidden="true"
            />

            <span>
              COLECCIÓN DESTACADA
            </span>

          </div>


          {marcaSeleccionada.logo && (

            <div className="marcaDetalleHero__logo">

              <img
                src={
                  marcaSeleccionada.logo
                }
                alt={`Logo de ${
                  marcaSeleccionada.nombre ||
                  marcaSeleccionada.id
                }`}
                loading="eager"
                decoding="async"
              />

            </div>

          )}


          <h1 id="marca-detalle-titulo">
            {marcaSeleccionada.nombre ||
              marcaSeleccionada.id}
          </h1>


          <p>
            Descubre todos los productos
            disponibles de esta marca.
          </p>


          <div className="marcaDetalleHero__contador">

            <strong>
              {productosDeMarca.length}
            </strong>

            <span>

              {productosDeMarca.length ===
              1
                ? 'PRODUCTO DISPONIBLE'
                : 'PRODUCTOS DISPONIBLES'}

            </span>

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUCTOS
      ================================================= */}

      <section
        className="marcaProductos"
        aria-labelledby="marca-productos-titulo"
      >

        <div className="marcaProductos__encabezado">

          <div>

            <span>
              PRODUCTOS
            </span>

            <h2 id="marca-productos-titulo">
              {marcaSeleccionada.nombre ||
                marcaSeleccionada.id}
            </h2>

          </div>


          <p>

            {productosDeMarca.length}{' '}

            {productosDeMarca.length ===
            1
              ? 'producto encontrado'
              : 'productos encontrados'}

          </p>

        </div>


        {productosDeMarca.length >
        0 ? (

          <div className="marcaProductos__grid">

            {productosDeMarca.map(
              (
                producto,
                indice
              ) => (

                <TarjetaProducto
                  key={
                    producto.id
                  }
                  producto={
                    producto
                  }
                  prioridad={
                    indice === 0
                  }
                />

              )
            )}

          </div>

        ) : (

          <div className="marcas__estado">

            <h2>
              No hay productos disponibles
            </h2>

            <p>
              Actualmente esta marca no tiene
              productos activos.
            </p>

            <button
              type="button"
              className="marcas__estadoBoton"
              onClick={
                volverAMarcas
              }
            >
              VOLVER A MARCAS
            </button>

          </div>

        )}

      </section>

    </div>
  );
}


export default Marcas;