import {
  useMemo,
  useState,
} from 'react';

import {
  ArrowDownWideNarrow,
  Flame,
  Percent,
} from 'lucide-react';

import {
  Link,
} from 'react-router-dom';

import {
  usarCatalogo,
} from '../../hooks/usarCatalogo';

import TarjetaProducto
  from '../../componentes/cliente/TarjetaProducto';

import CargandoPagina
  from '../../componentes/comun/CargandoPagina';

import SEO
  from '../../componentes/comun/SEO';

import './Ofertas.css';


const POR_PAGINA = 12;


function Ofertas() {
  const {
    productos,
    categorias,
    cargando,
    error,
  } =
    usarCatalogo();


  const [
    pagina,
    setPagina,
  ] =
    useState(1);


  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] =
    useState(
      'Todos'
    );


  const [
    orden,
    setOrden,
  ] =
    useState(
      'descuento'
    );


  // ======================================================
  // PRODUCTOS EN OFERTA
  // ======================================================

  const productosEnOferta =
    useMemo(
      () => {
        return productos.filter(
          (
            producto
          ) =>
            producto.oferta &&
            Number.isFinite(
              Number(
                producto.oferta.precioOferta
              )
            )
        );
      },
      [
        productos
      ]
    );


  // ======================================================
  // CATEGORÍAS DISPONIBLES
  // ======================================================

  const categoriasDisponibles =
    useMemo(
      () => {

        const idsCategorias =
          new Set(
            productosEnOferta.map(
              (
                producto
              ) =>
                producto.categoria_id
            )
          );


        return categorias.filter(
          (
            categoria
          ) =>
            idsCategorias.has(
              categoria.id
            )
        );
      },
      [
        productosEnOferta,
        categorias,
      ]
    );


  // ======================================================
  // MAYOR DESCUENTO
  // ======================================================

  const mayorDescuento =
    useMemo(
      () => {

        if (
          productosEnOferta.length ===
          0
        ) {
          return 0;
        }


        return Math.max(
          ...productosEnOferta.map(
            (
              producto
            ) =>
              Number(
                producto.oferta
                  ?.porcentajeDescuento
              ) ||
              0
          )
        );
      },
      [
        productosEnOferta
      ]
    );


  // ======================================================
  // FILTRAR Y ORDENAR
  // ======================================================

  const productosFiltrados =
    useMemo(
      () => {

        let resultado = [
          ...productosEnOferta,
        ];


        if (
          categoriaSeleccionada !==
          'Todos'
        ) {

          resultado =
            resultado.filter(
              (
                producto
              ) =>
                producto.categoria_id ===
                categoriaSeleccionada
            );
        }


        switch (
          orden
        ) {

          case 'descuento':

            resultado.sort(
              (
                a,
                b
              ) =>
                Number(
                  b.oferta
                    ?.porcentajeDescuento
                ) -
                Number(
                  a.oferta
                    ?.porcentajeDescuento
                )
            );

            break;


          case 'precio-menor':

            resultado.sort(
              (
                a,
                b
              ) =>
                Number(
                  a.precioEfectivo
                ) -
                Number(
                  b.precioEfectivo
                )
            );

            break;


          case 'precio-mayor':

            resultado.sort(
              (
                a,
                b
              ) =>
                Number(
                  b.precioEfectivo
                ) -
                Number(
                  a.precioEfectivo
                )
            );

            break;


          default:
            break;
        }


        return resultado;
      },
      [
        productosEnOferta,
        categoriaSeleccionada,
        orden,
      ]
    );


  const productosPaginados =
    productosFiltrados.slice(
      0,
      pagina *
        POR_PAGINA
    );


  // ======================================================
  // EVENTOS
  // ======================================================

  const manejarCategoria =
    (
      categoriaId
    ) => {

      setCategoriaSeleccionada(
        categoriaId
      );


      setPagina(
        1
      );
    };


  const manejarOrden =
    (
      evento
    ) => {

      setOrden(
        evento.target.value
      );


      setPagina(
        1
      );
    };


  // ======================================================
  // CARGANDO
  // ======================================================

  if (
    cargando
  ) {
    return (
      <>
        <SEO
          titulo="Ofertas en ropa deportiva | Chapaco Sport"
          descripcion="Descubre ofertas en ropa deportiva para hombre en Chapaco Sport. Encuentra productos seleccionados, descuentos y precios especiales por tiempo limitado."
          ruta="/ofertas"
        />

        <CargandoPagina />
      </>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (
    error
  ) {
    return (
      <>
        <SEO
          titulo="Ofertas en ropa deportiva | Chapaco Sport"
          descripcion="Descubre ofertas en ropa deportiva para hombre en Chapaco Sport. Encuentra productos seleccionados, descuentos y precios especiales por tiempo limitado."
          ruta="/ofertas"
        />


        <div className="ofertasProductos__vacio">

          <Percent
            size={42}
            aria-hidden="true"
          />


          <h1>
            No pudimos cargar las ofertas
          </h1>


          <p>
            Ocurrió un error al obtener los productos disponibles.
          </p>

        </div>
      </>
    );
  }


  return (
    <div className="paginaOfertas">

      {/* =================================================
          SEO
      ================================================= */}

      <SEO
        titulo="Ofertas en ropa deportiva | Chapaco Sport"
        descripcion="Descubre ofertas en ropa deportiva para hombre en Chapaco Sport. Encuentra productos seleccionados, descuentos y precios especiales por tiempo limitado."
        ruta="/ofertas"
      />


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="ofertasHero"
        aria-labelledby="ofertas-titulo-principal"
      >

        <div
          className="ofertasHero__decoracion ofertasHero__decoracion--uno"
          aria-hidden="true"
        />


        <div
          className="ofertasHero__decoracion ofertasHero__decoracion--dos"
          aria-hidden="true"
        />


        <div className="ofertasHero__contenido">

          <div className="ofertasHero__etiqueta">

            <Flame
              size={17}
              aria-hidden="true"
            />


            <span>
              OFERTAS CHAPACO SPORT
            </span>

          </div>


          <h1 id="ofertas-titulo-principal">

            PRECIOS QUE
            <br />

            <span>
              NO ESPERAN.
            </span>

          </h1>


          <p>
            Encuentra productos con
            variantes seleccionadas a
            precios especiales.
            Aprovecha mientras sigan
            disponibles.
          </p>


          <div className="ofertasHero__acciones">

            <a
              href="#productos-oferta"
              className="ofertasHero__boton ofertasHero__boton--principal"
            >
              VER OFERTAS
            </a>


            <Link
              to="/catalogo"
              className="ofertasHero__boton ofertasHero__boton--secundario"
            >
              VER CATÁLOGO
            </Link>

          </div>

        </div>


        <div
          className="ofertasHero__grafico"
          aria-hidden="true"
        >

          <span className="ofertasHero__off">
            SALE
          </span>


          <span className="ofertasHero__porcentaje">

            -
            {
              mayorDescuento ||
              0
            }
            %

          </span>


          <span className="ofertasHero__textoGrafico">
            HASTA
          </span>

        </div>

      </section>


      {/* =================================================
          PRODUCTOS
      ================================================= */}

      <section
        className="ofertasProductos"
        id="productos-oferta"
        aria-labelledby="ofertas-productos-titulo"
      >

        <div className="ofertasProductos__encabezado">

          <div>

            <span className="ofertasProductos__sobreTitulo">
              APROVECHA AHORA
            </span>


            <h2 id="ofertas-productos-titulo">
              PRODUCTOS EN OFERTA
            </h2>


            <p>

              Mostrando{' '}

              <strong>
                {
                  productosFiltrados.length
                }
              </strong>{' '}

              productos

            </p>

          </div>


          {
            productosEnOferta.length >
              0 && (

              <div className="ofertasProductos__orden">

                <ArrowDownWideNarrow
                  size={18}
                  aria-hidden="true"
                />


                <select
                  value={
                    orden
                  }
                  onChange={
                    manejarOrden
                  }
                  aria-label="Ordenar ofertas"
                >

                  <option value="descuento">
                    Mayor descuento
                  </option>


                  <option value="precio-menor">
                    Menor precio
                  </option>


                  <option value="precio-mayor">
                    Mayor precio
                  </option>

                </select>

              </div>

            )
          }

        </div>


        {/* =================================================
            CATEGORÍAS
        ================================================= */}

        {
          categoriasDisponibles.length >
            0 && (

            <div
              className="ofertasCategorias"
              aria-label="Filtrar ofertas por categoría"
            >

              <button
                type="button"
                className={`ofertasCategorias__boton ${
                  categoriaSeleccionada ===
                  'Todos'
                    ? 'ofertasCategorias__boton--activo'
                    : ''
                }`}
                onClick={() =>
                  manejarCategoria(
                    'Todos'
                  )
                }
                aria-pressed={
                  categoriaSeleccionada ===
                  'Todos'
                }
              >
                TODOS
              </button>


              {
                categoriasDisponibles.map(
                  (
                    categoria
                  ) => (

                    <button
                      type="button"
                      key={
                        categoria.id
                      }
                      className={`ofertasCategorias__boton ${
                        categoriaSeleccionada ===
                        categoria.id
                          ? 'ofertasCategorias__boton--activo'
                          : ''
                      }`}
                      onClick={() =>
                        manejarCategoria(
                          categoria.id
                        )
                      }
                      aria-pressed={
                        categoriaSeleccionada ===
                        categoria.id
                      }
                    >

                      {
                        categoria.nombre ||
                        categoria.id
                      }

                    </button>

                  )
                )
              }

            </div>

          )
        }


        {/* =================================================
            GRILLA
        ================================================= */}

        {
          productosPaginados.length >
            0
            ? (
              <>

                <div className="ofertasProductos__grilla">

                  {
                    productosPaginados.map(
                      (
                        producto,
                        indice
                      ) => (

                        <div
                          key={
                            producto.id
                          }
                          className="ofertasProductos__tarjeta"
                        >

                          <TarjetaProducto
                            producto={
                              producto
                            }
                            prioridad={
                              indice <
                              4
                            }
                          />

                        </div>

                      )
                    )
                  }

                </div>


                {
                  productosPaginados.length <
                    productosFiltrados.length && (

                    <div className="ofertasProductos__verMasContenedor">

                      <button
                        type="button"
                        className="ofertasProductos__verMas"
                        onClick={() =>
                          setPagina(
                            (
                              paginaActual
                            ) =>
                              paginaActual +
                              1
                          )
                        }
                      >
                        VER MÁS OFERTAS
                      </button>

                    </div>

                  )
                }

              </>
            )
            : (

              <div className="ofertasProductos__vacio">

                <Percent
                  size={42}
                  aria-hidden="true"
                />


                <h3>
                  No hay ofertas disponibles
                </h3>


                <p>

                  Actualmente no existen
                  productos disponibles en
                  oferta

                  {
                    categoriaSeleccionada !==
                    'Todos'
                      ? ' para esta categoría'
                      : ''
                  }

                  .

                </p>


                {
                  categoriaSeleccionada !==
                    'Todos' && (

                    <button
                      type="button"
                      onClick={() =>
                        manejarCategoria(
                          'Todos'
                        )
                      }
                    >
                      VER TODAS LAS OFERTAS
                    </button>

                  )
                }


                {
                  productosEnOferta.length ===
                    0 && (

                    <Link
                      to="/catalogo"
                    >
                      IR AL CATÁLOGO
                    </Link>

                  )
                }

              </div>

            )
        }

      </section>

    </div>
  );
}


export default Ofertas;