import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  Search,
  X,
} from 'lucide-react';

import {
  usarCatalogo,
} from '../../hooks/usarCatalogo';

import TarjetaProducto from '../../componentes/cliente/TarjetaProducto';
import CargandoPagina from '../../componentes/comun/CargandoPagina';
import SEO from '../../componentes/comun/SEO';

import './Catalogo.css';


const POR_PAGINA = 16;


// ======================================================
// NORMALIZAR TEXTO
// ======================================================

const normalizarTexto = (
  texto = ''
) => {
  return String(texto)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim();
};


// ======================================================
// TEXTO COMPLETO DE BÚSQUEDA
// ======================================================

const obtenerTextoBusquedaProducto = (
  producto
) => {
  const textos = [
    producto.id,
    producto.nombre,
    producto.nombreMarca,
    producto.nombreCategoria,
    producto.marca_id,
    producto.categoria_id,
    producto.descripcion_corta,
  ];


  producto.variantes?.forEach(
    (
      variante
    ) => {
      textos.push(
        variante.cod_producto,
        variante.color_estampado,
        variante.talla,
        variante.nombre_variante
      );
    }
  );


  return normalizarTexto(
    textos
      .filter(Boolean)
      .join(' ')
  );
};


// ======================================================
// CALCULAR PUNTAJE DE BÚSQUEDA
// ======================================================

const calcularPuntajeBusqueda = (
  producto,
  termino
) => {
  if (!termino) {
    return 0;
  }


  const palabras =
    normalizarTexto(
      termino
    )
      .split(/\s+/)
      .filter(Boolean);


  if (
    palabras.length === 0
  ) {
    return 0;
  }


  const {
    nombre,
    marca,
    categoria,
    descripcion,
    variantesTexto,
    textoCompleto,
  } =
    producto.__busqueda;


  let puntaje = 0;


  for (
    const palabra of palabras
  ) {
    let encontrada = false;


    if (
      nombre === palabra
    ) {
      puntaje += 20;
      encontrada = true;

    } else if (
      nombre.startsWith(
        palabra
      )
    ) {
      puntaje += 14;
      encontrada = true;

    } else if (
      nombre.includes(
        palabra
      )
    ) {
      puntaje += 10;
      encontrada = true;
    }


    if (
      marca.includes(
        palabra
      )
    ) {
      puntaje += 9;
      encontrada = true;
    }


    if (
      categoria.includes(
        palabra
      )
    ) {
      puntaje += 8;
      encontrada = true;
    }


    if (
      variantesTexto.includes(
        palabra
      )
    ) {
      puntaje += 7;
      encontrada = true;
    }


    if (
      descripcion.includes(
        palabra
      )
    ) {
      puntaje += 4;
      encontrada = true;
    }


    if (
      !encontrada &&
      textoCompleto.includes(
        palabra
      )
    ) {
      puntaje += 2;
      encontrada = true;
    }


    if (
      !encontrada
    ) {
      return 0;
    }
  }


  const terminoNormalizado =
    normalizarTexto(
      termino
    );


  if (
    nombre.includes(
      terminoNormalizado
    )
  ) {
    puntaje += 15;
  }


  return puntaje;
};


// ======================================================
// COMPONENTE
// ======================================================

function Catalogo() {

  const {
    productos,
    categorias,
    marcas,
    rangoPreciosGlobal,
    cargando,
    error,
  } =
    usarCatalogo();


  const ubicacion =
    useLocation();

  const navegar =
    useNavigate();


  // ======================================================
  // PARÁMETROS DE URL
  // ======================================================

  const parametros =
    useMemo(
      () =>
        new URLSearchParams(
          ubicacion.search
        ),
      [
        ubicacion.search
      ]
    );


  const terminoBusqueda =
    parametros
      .get('q')
      ?.trim() ||
    '';


  const mostrarSoloNuevos =
    parametros.get(
      'nuevo'
    ) === 'true';


  const esPaginaBusqueda =
    ubicacion.pathname ===
    '/busqueda';


  // ======================================================
  // SEO DINÁMICO
  // ======================================================

  const seo =
    useMemo(
      () => {

        if (
          esPaginaBusqueda &&
          terminoBusqueda
        ) {
          return {
            titulo:
              `Resultados para "${terminoBusqueda}" | Chapaco Sport`,

            descripcion:
              `Encuentra resultados para "${terminoBusqueda}" en Chapaco Sport. Explora ropa deportiva, marcas, categorías, colores y productos disponibles.`,

            ruta:
              `/busqueda?q=${encodeURIComponent(
                terminoBusqueda
              )}`,
          };
        }


        if (
          mostrarSoloNuevos
        ) {
          return {
            titulo:
              'Nuevo Drop 2026 | Chapaco Sport',

            descripcion:
              'Descubre los productos nuevos de Chapaco Sport. Explora las últimas prendas y novedades de ropa deportiva para hombre.',

            ruta:
              '/catalogo?nuevo=true',
          };
        }


        return {
          titulo:
            'Catálogo de ropa deportiva | Chapaco Sport',

          descripcion:
            'Explora el catálogo de Chapaco Sport con ropa deportiva para hombre, camisetas, prendas de compresión, marcas, novedades y más.',

          ruta:
            '/catalogo',
        };

      },
      [
        esPaginaBusqueda,
        terminoBusqueda,
        mostrarSoloNuevos,
      ]
    );


  const [
    busquedaLocal,
    setBusquedaLocal,
  ] =
    useState(
      terminoBusqueda
    );


  const [
    filtrosActivos,
    setFiltrosActivos,
  ] =
    useState({
      categoria_id:
        'Todos',

      marca_id:
        'Todos',

      orden:
        '',

      precioMin:
        0,

      precioMax:
        100000,
    });


  const [
    filtrosBorrador,
    setFiltrosBorrador,
  ] =
    useState(
      filtrosActivos
    );


  const [
    pagina,
    setPagina,
  ] =
    useState(1);


  const [
    filtrosAbiertos,
    setFiltrosAbiertos,
  ] =
    useState(false);


  // ======================================================
  // SINCRONIZAR BÚSQUEDA
  // ======================================================

  useEffect(() => {

    setBusquedaLocal(
      terminoBusqueda
    );

    setPagina(
      1
    );

  }, [
    terminoBusqueda,
    mostrarSoloNuevos,
  ]);


  // ======================================================
  // RANGO DE PRECIOS
  // ======================================================

  useEffect(() => {

    if (
      !cargando &&
      productos.length > 0
    ) {

      setFiltrosActivos(
        (
          prev
        ) => ({
          ...prev,

          precioMin:
            rangoPreciosGlobal.min,

          precioMax:
            rangoPreciosGlobal.max,
        })
      );


      setFiltrosBorrador(
        (
          prev
        ) => ({
          ...prev,

          precioMin:
            rangoPreciosGlobal.min,

          precioMax:
            rangoPreciosGlobal.max,
        })
      );
    }

  }, [
    cargando,
    productos.length,
    rangoPreciosGlobal.min,
    rangoPreciosGlobal.max,
  ]);


  // ======================================================
  // CAMBIO DE FILTROS
  // ======================================================

  const manejarCambioFiltro =
    (
      evento
    ) => {

      const {
        name,
        value,
      } =
        evento.target;


      setFiltrosBorrador(
        (
          prev
        ) => ({
          ...prev,

          [name]:
            value,
        })
      );
    };


  // ======================================================
  // APLICAR FILTROS
  // ======================================================

  const aplicarFiltros =
    () => {

      setFiltrosActivos(
        filtrosBorrador
      );


      setPagina(
        1
      );


      setFiltrosAbiertos(
        false
      );
    };


  // ======================================================
  // LIMPIAR FILTROS
  // ======================================================

  const limpiarFiltros =
    () => {

      const reseteo = {
        categoria_id:
          'Todos',

        marca_id:
          'Todos',

        orden:
          '',

        precioMin:
          rangoPreciosGlobal.min,

        precioMax:
          rangoPreciosGlobal.max,
      };


      setFiltrosBorrador(
        reseteo
      );


      setFiltrosActivos(
        reseteo
      );


      setPagina(
        1
      );
    };


  // ======================================================
  // NUEVA BÚSQUEDA
  // ======================================================

  const manejarNuevaBusqueda =
    (
      evento
    ) => {

      evento.preventDefault();


      const termino =
        busquedaLocal.trim();


      if (!termino) {

        navegar(
          '/catalogo'
        );

        return;
      }


      navegar(
        `/busqueda?q=${encodeURIComponent(
          termino
        )}`
      );
    };


  // ======================================================
  // LIMPIAR BÚSQUEDA
  // ======================================================

  const limpiarBusqueda =
    () => {

      setBusquedaLocal(
        ''
      );


      navegar(
        '/catalogo'
      );
    };


  // ======================================================
  // INDEXAR PRODUCTOS
  // ======================================================

  const productosIndexados =
    useMemo(
      () => {

        return productos.map(
          (
            producto
          ) => {

            const nombre =
              normalizarTexto(
                producto.nombre
              );


            const marca =
              normalizarTexto(
                `${
                  producto.nombreMarca ||
                  ''
                } ${
                  producto.marca_id ||
                  ''
                }`
              );


            const categoria =
              normalizarTexto(
                `${
                  producto.nombreCategoria ||
                  ''
                } ${
                  producto.categoria_id ||
                  ''
                }`
              );


            const descripcion =
              normalizarTexto(
                producto.descripcion_corta
              );


            const variantesTexto =
              normalizarTexto(
                producto.variantes
                  ?.map(
                    (
                      variante
                    ) =>
                      [
                        variante.cod_producto,
                        variante.color_estampado,
                        variante.talla,
                        variante.nombre_variante,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ' '
                        )
                  )
                  .join(
                    ' '
                  ) ||
                ''
              );


            return {
              ...producto,

              __busqueda: {
                nombre,
                marca,
                categoria,
                descripcion,
                variantesTexto,

                textoCompleto:
                  obtenerTextoBusquedaProducto(
                    producto
                  ),
              },
            };
          }
        );
      },
      [
        productos
      ]
    );


  // ======================================================
  // FILTRAR PRODUCTOS
  // ======================================================

  const productosFiltrados =
    useMemo(
      () => {

        let resultado =
          productosIndexados.map(
            (
              producto
            ) => ({
              ...producto,

              puntajeBusqueda:
                0,
            })
          );


        if (
          mostrarSoloNuevos
        ) {

          resultado =
            resultado.filter(
              (
                producto
              ) =>
                producto.esNuevo ===
                true
            );
        }


        if (
          terminoBusqueda
        ) {

          resultado =
            resultado
              .map(
                (
                  producto
                ) => ({
                  ...producto,

                  puntajeBusqueda:
                    calcularPuntajeBusqueda(
                      producto,
                      terminoBusqueda
                    ),
                })
              )
              .filter(
                (
                  producto
                ) =>
                  producto.puntajeBusqueda >
                  0
              );
        }


        if (
          filtrosActivos.categoria_id !==
          'Todos'
        ) {

          resultado =
            resultado.filter(
              (
                producto
              ) =>
                producto.categoria_id ===
                filtrosActivos.categoria_id
            );
        }


        if (
          filtrosActivos.marca_id !==
          'Todos'
        ) {

          resultado =
            resultado.filter(
              (
                producto
              ) =>
                producto.marca_id ===
                filtrosActivos.marca_id
            );
        }


        resultado =
          resultado.filter(
            (
              producto
            ) =>
              producto.precioEfectivo >=
                Number(
                  filtrosActivos.precioMin
                ) &&
              producto.precioEfectivo <=
                Number(
                  filtrosActivos.precioMax
                )
          );


        if (
          filtrosActivos.orden ===
          'mayor'
        ) {

          resultado.sort(
            (
              a,
              b
            ) =>
              b.precioEfectivo -
              a.precioEfectivo
          );

        } else if (
          filtrosActivos.orden ===
          'menor'
        ) {

          resultado.sort(
            (
              a,
              b
            ) =>
              a.precioEfectivo -
              b.precioEfectivo
          );

        } else if (
          terminoBusqueda
        ) {

          resultado.sort(
            (
              a,
              b
            ) =>
              b.puntajeBusqueda -
              a.puntajeBusqueda
          );
        }


        return resultado;
      },
      [
        productosIndexados,
        filtrosActivos,
        terminoBusqueda,
        mostrarSoloNuevos,
      ]
    );


  // ======================================================
  // PAGINACIÓN
  // ======================================================

  const productosPaginados =
    productosFiltrados.slice(
      0,
      pagina *
        POR_PAGINA
    );


  // ======================================================
  // CARGANDO
  // ======================================================

  if (
    cargando
  ) {
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

  if (
    error
  ) {
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

        <div className="catalogo__vacio">

          <p>
            Ocurrió un error al cargar los productos.
          </p>

        </div>
      </>
    );
  }


  return (
    <div className="pantallaCatalogo">

      {/* =================================================
          SEO
      ================================================= */}

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


      {/* ================================================= */}
      {/* ENCABEZADO                                       */}
      {/* ================================================= */}

      <div className="catalogo__encabezado">

        <div>

          <h1 className="pantallaCatalogo__titulo">

            {
              terminoBusqueda
                ? 'Resultados de búsqueda'
                : mostrarSoloNuevos
                  ? 'Nuevo Drop 2026'
                  : 'Nuestros Productos'
            }

          </h1>


          {
            mostrarSoloNuevos &&
            !terminoBusqueda && (

              <p className="catalogo__resultadoTexto">

                {
                  productosFiltrados.length
                }{' '}

                {
                  productosFiltrados.length ===
                  1
                    ? 'producto nuevo'
                    : 'productos nuevos'
                }

              </p>

            )
          }


          {
            terminoBusqueda && (

              <p
                className="catalogo__resultadoTexto"
                aria-live="polite"
              >

                {
                  productosFiltrados.length
                }{' '}

                {
                  productosFiltrados.length ===
                  1
                    ? 'resultado'
                    : 'resultados'
                }{' '}

                para{' '}

                <strong>
                  “{terminoBusqueda}”
                </strong>

              </p>

            )
          }

        </div>

      </div>


      {/* ================================================= */}
      {/* BÚSQUEDA                                         */}
      {/* ================================================= */}

      {
        esPaginaBusqueda && (

          <form
            className="catalogo__busqueda"
            onSubmit={
              manejarNuevaBusqueda
            }
            role="search"
            aria-label="Buscar dentro del catálogo"
          >

            <Search
              size={20}
              className="catalogo__busquedaIcono"
              aria-hidden="true"
            />


            <input
              type="search"
              value={
                busquedaLocal
              }
              onChange={
                (
                  evento
                ) =>
                  setBusquedaLocal(
                    evento.target.value
                  )
              }
              placeholder="Buscar por producto, marca, categoría, color, SKU..."
              aria-label="Buscar productos"
            />


            {
              busquedaLocal && (

                <button
                  type="button"
                  className="catalogo__busquedaLimpiar"
                  onClick={() =>
                    setBusquedaLocal(
                      ''
                    )
                  }
                  aria-label="Limpiar búsqueda"
                >
                  <X
                    size={18}
                    aria-hidden="true"
                  />
                </button>

              )
            }


            <button
              type="submit"
              className="catalogo__busquedaBoton"
            >
              BUSCAR
            </button>

          </form>

        )
      }


      {/* ================================================= */}
      {/* BOTÓN FILTROS MÓVIL                              */}
      {/* ================================================= */}

      <button
        type="button"
        className="catalogo__btnFiltrosMovil"
        onClick={() =>
          setFiltrosAbiertos(
            (
              prev
            ) =>
              !prev
          )
        }
        aria-expanded={
          filtrosAbiertos
        }
        aria-controls="catalogo-filtros"
      >

        <span>
          FILTROS
        </span>

        <span aria-hidden="true">
          {
            filtrosAbiertos
              ? '−'
              : '+'
          }
        </span>

      </button>


      <div className="catalogo__layout">


        {/* ================================================= */}
        {/* SIDEBAR                                          */}
        {/* ================================================= */}

        <aside
          id="catalogo-filtros"
          className={`catalogo__sidebar ${
            filtrosAbiertos
              ? 'catalogo__sidebar--abierto'
              : ''
          }`}
          aria-label="Filtros del catálogo"
        >


          <div className="catalogo__grupoFiltro">

            <h3>
              Categorías
            </h3>


            <label className="catalogo__opcion">

              <input
                type="radio"
                name="categoria_id"
                value="Todos"
                checked={
                  filtrosBorrador.categoria_id ===
                  'Todos'
                }
                onChange={
                  manejarCambioFiltro
                }
              />

              Todos

            </label>


            {
              categorias.map(
                (
                  categoria
                ) => (

                  <label
                    key={
                      categoria.id
                    }
                    className="catalogo__opcion"
                  >

                    <input
                      type="radio"
                      name="categoria_id"
                      value={
                        categoria.id
                      }
                      checked={
                        filtrosBorrador.categoria_id ===
                        categoria.id
                      }
                      onChange={
                        manejarCambioFiltro
                      }
                    />

                    {
                      categoria.nombre ||
                      categoria.id
                    }

                  </label>

                )
              )
            }

          </div>


          <div className="catalogo__grupoFiltro">

            <h3>
              Marcas
            </h3>


            <label className="catalogo__opcion">

              <input
                type="radio"
                name="marca_id"
                value="Todos"
                checked={
                  filtrosBorrador.marca_id ===
                  'Todos'
                }
                onChange={
                  manejarCambioFiltro
                }
              />

              Todos

            </label>


            {
              marcas.map(
                (
                  marca
                ) => (

                  <label
                    key={
                      marca.id
                    }
                    className="catalogo__opcion"
                  >

                    <input
                      type="radio"
                      name="marca_id"
                      value={
                        marca.id
                      }
                      checked={
                        filtrosBorrador.marca_id ===
                        marca.id
                      }
                      onChange={
                        manejarCambioFiltro
                      }
                    />

                    {
                      marca.nombre ||
                      marca.id
                    }

                  </label>

                )
              )
            }

          </div>


          <div className="catalogo__grupoFiltro">

            <h3>
              Ordenar Por
            </h3>


            <label className="catalogo__opcion">

              <input
                type="radio"
                name="orden"
                value="mayor"
                checked={
                  filtrosBorrador.orden ===
                  'mayor'
                }
                onChange={
                  manejarCambioFiltro
                }
              />

              Mayor Precio

            </label>


            <label className="catalogo__opcion">

              <input
                type="radio"
                name="orden"
                value="menor"
                checked={
                  filtrosBorrador.orden ===
                  'menor'
                }
                onChange={
                  manejarCambioFiltro
                }
              />

              Menor Precio

            </label>

          </div>


          <div className="catalogo__grupoFiltro">

            <h3>
              Rango de Precio
            </h3>


            <div className="catalogo__rangoPrecios">

              <input
                type="number"
                name="precioMin"
                value={
                  filtrosBorrador.precioMin
                }
                onChange={
                  manejarCambioFiltro
                }
                min="0"
                className="catalogo__inputPrecio"
                aria-label="Precio mínimo"
              />


              <span aria-hidden="true">
                -
              </span>


              <input
                type="number"
                name="precioMax"
                value={
                  filtrosBorrador.precioMax
                }
                onChange={
                  manejarCambioFiltro
                }
                min="0"
                className="catalogo__inputPrecio"
                aria-label="Precio máximo"
              />

            </div>

          </div>


          <div className="catalogo__acciones">

            <button
              type="button"
              className="catalogo__btn catalogo__btn--aplicar"
              onClick={
                aplicarFiltros
              }
            >
              APLICAR FILTRO
            </button>


            <button
              type="button"
              className="catalogo__btn catalogo__btn--limpiar"
              onClick={
                limpiarFiltros
              }
            >
              LIMPIAR FILTRO
            </button>

          </div>

        </aside>


        {/* ================================================= */}
        {/* PRODUCTOS                                        */}
        {/* ================================================= */}

        <section
          className="catalogo__principal"
          aria-label="Listado de productos"
        >

          {
            productosPaginados.length > 0
              ? (
                <>

                  <div className="catalogo__grilla">

                    {
                      productosPaginados.map(
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
                      )
                    }

                  </div>


                  {
                    productosPaginados.length <
                    productosFiltrados.length && (

                      <button
                        type="button"
                        className="catalogo__btnVerMas"
                        onClick={() =>
                          setPagina(
                            (
                              prev
                            ) =>
                              prev + 1
                          )
                        }
                      >
                        VER MÁS PRODUCTOS
                      </button>

                    )
                  }

                </>
              )
              : (

                <div className="catalogo__vacio">

                  {
                    terminoBusqueda
                      ? (
                        <>

                          <h2>
                            No encontramos resultados
                          </h2>

                          <p>

                            No hay productos que coincidan con{' '}

                            <strong>
                              “{terminoBusqueda}”
                            </strong>

                            .

                          </p>


                          <button
                            type="button"
                            className="catalogo__volverProductos"
                            onClick={
                              limpiarBusqueda
                            }
                          >
                            VER TODOS LOS PRODUCTOS
                          </button>

                        </>
                      )
                      : mostrarSoloNuevos
                        ? (
                          <>

                            <h2>
                              No hay productos nuevos
                            </h2>

                            <p>
                              Actualmente no existen productos marcados como Nuevo Drop.
                            </p>

                            <button
                              type="button"
                              className="catalogo__volverProductos"
                              onClick={() =>
                                navegar(
                                  '/catalogo'
                                )
                              }
                            >
                              VER TODOS LOS PRODUCTOS
                            </button>

                          </>
                        )
                        : (
                          <p>
                            No se encontraron productos con estos filtros.
                          </p>
                        )
                  }

                </div>

              )
          }

        </section>

      </div>

    </div>
  );
}


export default Catalogo;