import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  Share2,
  Check,
} from 'lucide-react';

import {
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../../servicios/firebaseConfig';

import GaleriaImagenes
  from '../../componentes/cliente/GaleriaImagenes';

import SEO
  from '../../componentes/comun/SEO';

import usarCarrito
  from '../../hooks/usarCarrito';

import './DetalleProducto.css';

import {
  ordenarTallas,
  ordenarVariantes,
} from '../../utilidades/tallas';


// ======================================================
// OBTENER URL DE UNA IMAGEN
// ======================================================

const obtenerUrlImagen = (
  imagen
) => {

  if (!imagen) {
    return '';
  }


  if (
    typeof imagen ===
    'string'
  ) {
    return imagen;
  }


  if (
    typeof imagen ===
    'object'
  ) {
    return (
      imagen.url ||
      imagen.URL ||
      imagen.src ||
      ''
    );
  }


  return '';
};


function DetalleProducto() {
  const {
    idProducto,
  } =
    useParams();


  // ======================================================
  // PRODUCTO Y VARIANTES
  // ======================================================

  const [
    producto,
    setProducto,
  ] =
    useState(null);


  const [
    tallaSeleccionada,
    setTallaSeleccionada,
  ] =
    useState('');


  const [
    colorSeleccionado,
    setColorSeleccionado,
  ] =
    useState('');


  // ======================================================
  // INFORMACIÓN ADICIONAL
  // ======================================================

  const [
    nombreMarca,
    setNombreMarca,
  ] =
    useState('');


  const [
    guiaTallasCategoriaUrl,
    setGuiaTallasCategoriaUrl,
  ] =
    useState('');


  const [
    cantidad,
    setCantidad,
  ] =
    useState(1);


  const [
    guiaTallasAbierta,
    setGuiaTallasAbierta,
  ] =
    useState(false);


  const [
    mensajeCompartir,
    setMensajeCompartir,
  ] =
    useState('');


  // ======================================================
  // NOTIFICACIÓN DEL CARRITO
  // ======================================================

  const [
    notificacionCarrito,
    setNotificacionCarrito,
  ] =
    useState(null);


  // ======================================================
  // ESTADO GENERAL
  // ======================================================

  const [
    cargando,
    setCargando,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState(null);


  // ======================================================
  // CARRITO
  // ======================================================

  const {
    agregarProducto,
  } =
    usarCarrito();


  // ======================================================
  // SEO + OPEN GRAPH + SCHEMA.ORG
  // ======================================================

  const seo =
    useMemo(
      () => {

        const rutaProducto =
          `/producto/${idProducto || ''}`;


        if (!producto) {

          return {
            titulo:
              'Producto | Chapaco Sport',

            descripcion:
              'Consulta los detalles, tallas, colores y disponibilidad de productos de ropa deportiva para hombre en Chapaco Sport.',

            ruta:
              rutaProducto,

            imagen:
              undefined,

            tipo:
              'website',

            imagenAlt:
              'Chapaco Sport — Viste tu pasión',

            datosEstructurados:
              null,
          };
        }


        const nombreProducto =
          producto.nombre ||
          'Producto';


        const descripcionProducto =
          producto.descripcion_corta ||
          `Descubre ${nombreProducto} en Chapaco Sport. Consulta tallas, colores, precio y disponibilidad.`;


        const imagenesProducto =
          Array.isArray(
            producto.imagenes
          )
            ? producto.imagenes
                .map(
                  obtenerUrlImagen
                )
                .filter(
                  Boolean
                )
            : [];


        const imagenProducto =
          imagenesProducto[0] ||
          undefined;


        const precioBase =
          Number(
            producto.precio
          ) ||
          0;


        const variantesProducto =
          Object.values(
            producto?.subcolecciones?.variantes ||
            {}
          );


        const variantesDisponibles =
          variantesProducto.filter(
            (
              variante
            ) =>
              variante.disponible ===
              true
          );


        const productoDisponible =
          variantesDisponibles.length >
          0;


        const preciosOferta =
          variantesDisponibles
            .filter(
              (
                variante
              ) =>
                variante.en_oferta ===
                  true &&
                Number.isFinite(
                  Number(
                    variante.precio_oferta
                  )
                ) &&
                Number(
                  variante.precio_oferta
                ) >
                  0
            )
            .map(
              (
                variante
              ) =>
                Number(
                  variante.precio_oferta
                )
            );


        const precioSchema =
          preciosOferta.length >
            0
            ? Math.min(
                ...preciosOferta
              )
            : precioBase;


        const skuSchema =
          variantesDisponibles.find(
            (
              variante
            ) =>
              variante.cod_producto
          )?.cod_producto ||
          producto.id ||
          idProducto ||
          '';


        const nombreMarcaSchema =
          nombreMarca ||
          producto.marca_id ||
          'Chapaco Sport';


        const urlProducto =
          `https://chapacosport.com${rutaProducto}`;


        const datosEstructurados = {
          '@context':
            'https://schema.org',

          '@type':
            'Product',

          '@id':
            `${urlProducto}#producto`,

          name:
            nombreProducto,

          description:
            descripcionProducto,

          url:
            urlProducto,

          image:
            imagenesProducto.length >
              0
              ? imagenesProducto
              : undefined,

          sku:
            skuSchema,

          brand: {
            '@type':
              'Brand',

            name:
              nombreMarcaSchema,
          },

          offers: {
            '@type':
              'Offer',

            url:
              urlProducto,

            priceCurrency:
              'BOB',

            price:
              Number(
                precioSchema
              ).toFixed(
                2
              ),

            availability:
              productoDisponible
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',

            itemCondition:
              'https://schema.org/NewCondition',
          },
        };


        return {
          titulo:
            `${nombreProducto} | Chapaco Sport`,

          descripcion:
            descripcionProducto,

          ruta:
            rutaProducto,

          imagen:
            imagenProducto,

          tipo:
            'product',

          imagenAlt:
            `${nombreProducto} - Chapaco Sport`,

          datosEstructurados,
        };

      },
      [
        producto,
        idProducto,
        nombreMarca,
      ]
    );


  // ======================================================
  // PRODUCTO EN TIEMPO REAL
  // ======================================================

  useEffect(() => {

    if (!idProducto) {
      return undefined;
    }


    setCargando(
      true
    );


    setProducto(
      null
    );


    setError(
      null
    );


    const referenciaProducto =
      doc(
        db,
        'productos',
        idProducto
      );


    const cancelarEscucha =
      onSnapshot(
        referenciaProducto,

        (
          snapshot
        ) => {

          if (
            !snapshot.exists()
          ) {

            setProducto(
              null
            );

            setError(
              'El producto no existe.'
            );

            setCargando(
              false
            );

            return;
          }


          setProducto({
            id:
              snapshot.id,

            ...snapshot.data(),
          });


          setError(
            null
          );


          setCargando(
            false
          );
        },

        (
          errorFirestore
        ) => {

          console.error(
            'Error escuchando producto:',
            errorFirestore
          );


          setProducto(
            null
          );


          setError(
            'No se pudo cargar el producto.'
          );


          setCargando(
            false
          );
        }
      );


    return () => {
      cancelarEscucha();
    };

  }, [
    idProducto
  ]);


  // ======================================================
  // OBTENER NOMBRE DE LA MARCA
  // ======================================================

  useEffect(() => {

    async function cargarMarca() {

      if (!producto) {
        return;
      }


      const marcaId =
        producto.marca_id;


      if (!marcaId) {

        setNombreMarca(
          ''
        );

        return;
      }


      try {

        const marcaDoc =
          await getDoc(
            doc(
              db,
              'marcas',
              marcaId
            )
          );


        if (
          marcaDoc.exists()
        ) {

          setNombreMarca(
            marcaDoc.data().nombre ||
            ''
          );

        } else {

          setNombreMarca(
            ''
          );
        }

      } catch (
        errorMarca
      ) {

        console.error(
          'Error cargando marca:',
          errorMarca
        );


        setNombreMarca(
          ''
        );
      }
    }


    cargarMarca();

  }, [
    producto?.marca_id,
    producto?.marcaId,
  ]);


  // ======================================================
  // GUÍA DE TALLAS
  // ======================================================

  useEffect(() => {

    const categoriaId =
      producto?.categoria_id ||
      '';


    if (!categoriaId) {

      setGuiaTallasCategoriaUrl(
        ''
      );

      return undefined;
    }


    const referenciaCategoria =
      doc(
        db,
        'categorias',
        categoriaId
      );


    const cancelarEscucha =
      onSnapshot(
        referenciaCategoria,

        (
          snapshot
        ) => {

          if (
            !snapshot.exists()
          ) {

            setGuiaTallasCategoriaUrl(
              ''
            );

            return;
          }


          const datosCategoria =
            snapshot.data();


          setGuiaTallasCategoriaUrl(
            datosCategoria.guia_tallas_url ||
            ''
          );
        },

        (
          errorCategoria
        ) => {

          console.error(
            'Error cargando guía de tallas de la categoría:',
            errorCategoria
          );


          setGuiaTallasCategoriaUrl(
            ''
          );
        }
      );


    return () => {
      cancelarEscucha();
    };

  }, [
    producto?.categoria_id,
    producto?.categoriaId,
  ]);


  // ======================================================
  // CERRAR GUÍA CON ESC
  // ======================================================

  useEffect(() => {

    if (
      !guiaTallasAbierta
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

          setGuiaTallasAbierta(
            false
          );
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
    guiaTallasAbierta
  ]);


  // ======================================================
  // VARIANTES
  // ======================================================

  const variantes =
    useMemo(
      () => {

        const mapaVariantes =
          producto?.subcolecciones?.variantes ||
          {};


        return ordenarVariantes(Object.entries(
          mapaVariantes
        ).map(
          (
            [
              id,
              variante
            ]
          ) => ({
            id,
            ...variante,
          })
        ));

      },
      [
        producto
      ]
    );


  const varianteSeleccionada =
    useMemo(
      () => {

        if (
          !colorSeleccionado ||
          !tallaSeleccionada
        ) {
          return null;
        }


        return (
          variantes.find(
            (
              variante
            ) =>
              variante.color_estampado ===
                colorSeleccionado &&
              variante.talla ===
                tallaSeleccionada
          ) ||
          null
        );

      },
      [
        variantes,
        colorSeleccionado,
        tallaSeleccionada,
      ]
    );


  // ======================================================
  // SELECCIÓN INICIAL
  // ======================================================

  useEffect(() => {

    if (
      variantes.length ===
      0
    ) {

      setColorSeleccionado(
        ''
      );

      setTallaSeleccionada(
        ''
      );

      return;
    }


    const seleccionActualValida =
      variantes.find(
        (
          variante
        ) =>
          variante.color_estampado ===
            colorSeleccionado &&
          variante.talla ===
            tallaSeleccionada &&
          variante.disponible ===
            true
      );


    if (
      seleccionActualValida
    ) {
      return;
    }


    const primeraDisponible =
      variantes.find(
        (
          variante
        ) =>
          variante.disponible ===
          true
      );


    const varianteInicial =
      primeraDisponible ||
      variantes[0];


    setColorSeleccionado(
      varianteInicial?.color_estampado ||
      ''
    );


    setTallaSeleccionada(
      varianteInicial?.talla ||
      ''
    );


    setCantidad(
      1
    );

  }, [
    variantes,
    colorSeleccionado,
    tallaSeleccionada,
  ]);


  // ======================================================
  // SELECCIONAR COLOR
  // ======================================================

  const seleccionarColor =
    (
      color
    ) => {

      const variantesDelColor =
        variantes.filter(
          (
            variante
          ) =>
            variante.color_estampado ===
            color
        );


      const disponiblesDelColor =
        variantesDelColor.filter(
          (
            variante
          ) =>
            variante.disponible ===
            true
        );


      if (
        disponiblesDelColor.length ===
        0
      ) {
        return;
      }


      const mismaTallaDisponible =
        disponiblesDelColor.find(
          (
            variante
          ) =>
            variante.talla ===
            tallaSeleccionada
        );


      const nuevaVariante =
        mismaTallaDisponible ||
        disponiblesDelColor[0];


      setColorSeleccionado(
        color
      );


      setTallaSeleccionada(
        nuevaVariante.talla
      );


      setCantidad(
        1
      );
    };


  // ======================================================
  // SELECCIONAR TALLA
  // ======================================================

  const seleccionarTalla =
    (
      talla
    ) => {

      const varianteExacta =
        variantes.find(
          (
            variante
          ) =>
            variante.color_estampado ===
              colorSeleccionado &&
          variante.talla ===
            talla
        );


      if (
        !varianteExacta ||
        varianteExacta.disponible !==
          true
      ) {
        return;
      }


      setTallaSeleccionada(
        talla
      );


      setCantidad(
        1
      );
    };


  // ======================================================
  // DISPONIBILIDAD
  // ======================================================

  const tallaEstaDisponible =
    (
      talla
    ) => {

      if (
        !colorSeleccionado
      ) {
        return false;
      }


      return variantes.some(
        (
          variante
        ) =>
          variante.color_estampado ===
            colorSeleccionado &&
          variante.talla ===
            talla &&
          variante.disponible ===
            true
      );
    };


  const colorEstaDisponible =
    (
      color
    ) => {

      return variantes.some(
        (
          variante
        ) =>
          variante.color_estampado ===
            color &&
          variante.disponible ===
            true
      );
    };


  const productoAgotado =
    variantes.length ===
      0 ||
    !variantes.some(
      (
        variante
      ) =>
        variante.disponible ===
        true
    );


  const combinacionAgotada =
    !varianteSeleccionada ||
    varianteSeleccionada.disponible !==
      true;


  // ======================================================
  // CANTIDAD
  // ======================================================

  const aumentarCantidad =
    () => {

      setCantidad(
        (
          cantidadActual
        ) =>
          cantidadActual +
          1
      );
    };


  const disminuirCantidad =
    () => {

      setCantidad(
        (
          cantidadActual
        ) =>
          Math.max(
            1,
            cantidadActual -
              1
          )
      );
    };


  // ======================================================
  // COMPARTIR
  // ======================================================

  const manejarCompartir =
    async () => {

      if (!producto) {
        return;
      }


      const urlProducto =
        window.location.href;


      const datosCompartir = {
        title:
          producto.nombre,

        text:
          `Mira ${producto.nombre} en Chapaco Sport`,

        url:
          urlProducto,
      };


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            datosCompartir
          );

          return;
        }


        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {

          await navigator.clipboard.writeText(
            urlProducto
          );


          setMensajeCompartir(
            'Enlace copiado'
          );


          setTimeout(
            () => {

              setMensajeCompartir(
                ''
              );

            },
            2000
          );


          return;
        }


        window.prompt(
          'Copia el enlace del producto:',
          urlProducto
        );

      } catch (
        errorCompartir
      ) {

        if (
          errorCompartir?.name !==
          'AbortError'
        ) {

          console.error(
            'Error compartiendo producto:',
            errorCompartir
          );
        }
      }
    };


  // ======================================================
  // AGREGAR AL CARRITO
  // ======================================================

  const manejarAgregarCarrito =
    () => {

      if (!producto) {
        return;
      }


      if (
        !varianteSeleccionada
      ) {
        return;
      }


      if (
        varianteSeleccionada.disponible !==
        true
      ) {
        return;
      }


      agregarProducto(
        producto,
        varianteSeleccionada,
        cantidad
      );


      setNotificacionCarrito({
        nombre:
          producto.nombre ||
          'Producto',

        color:
          varianteSeleccionada.color_estampado ||
          varianteSeleccionada.color ||
          'Sin color',

        talla:
          varianteSeleccionada.talla ||
          'Sin talla',

        cantidad,
      });


      setTimeout(
        () => {

          setNotificacionCarrito(
            null
          );

        },
        3000
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
          titulo={
            seo.titulo
          }
          descripcion={
            seo.descripcion
          }
          ruta={
            seo.ruta
          }
          imagen={
            seo.imagen
          }
          tipo={
            seo.tipo
          }
          imagenAlt={
            seo.imagenAlt
          }
          datosEstructurados={
            seo.datosEstructurados
          }
        />


        <div className="detalleProducto__cargando">

          <h1>
            Cargando producto...
          </h1>

        </div>
      </>
    );
  }


  // ======================================================
  // ERROR
  // ======================================================

  if (
    error ||
    !producto
  ) {
    return (
      <>

        <SEO
          titulo="Producto no encontrado | Chapaco Sport"
          descripcion="El producto solicitado no está disponible. Explora el catálogo de Chapaco Sport para encontrar ropa deportiva para hombre."
          ruta={
            `/producto/${idProducto || ''}`
          }
          tipo="website"
          imagenAlt="Chapaco Sport — Viste tu pasión"
          datosEstructurados={
            null
          }
        />


        <div className="detalleProducto__error">

          <h1>

            {
              error ||
              'Producto no encontrado.'
            }

          </h1>


          <Link
            to="/catalogo"
          >
            Volver al catálogo
          </Link>

        </div>

      </>
    );
  }


  // ======================================================
  // DATOS PARA MOSTRAR
  // ======================================================

  const imagenes =
    Array.isArray(
      producto.imagenes
    )
      ? producto.imagenes.filter(
          Boolean
        )
      : [];


  const tallasDisponibles = ordenarTallas([
    ...new Set(
      variantes
        .map(
          (
            variante
          ) =>
            variante.talla
        )
        .filter(
          Boolean
        )
    ),
  ]);


  const coloresDisponibles = [
    ...new Set(
      variantes
        .map(
          (
            variante
          ) =>
            variante.color_estampado ||
            variante.color
        )
        .filter(
          Boolean
        )
    ),
  ].sort((a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' }));


  const precioOriginal =
    Number(
      producto.precio
    ) ||
    0;


  const precioOfertaVariante =
    Number(
      varianteSeleccionada
        ?.precio_oferta
    );


  const tieneOferta =
    varianteSeleccionada
      ?.en_oferta ===
      true &&
    Number.isFinite(
      precioOfertaVariante
    ) &&
    precioOfertaVariante >
      0 &&
    precioOfertaVariante <
      precioOriginal;


  const precioActual =
    tieneOferta
      ? precioOfertaVariante
      : precioOriginal;


  const porcentajeOferta =
    tieneOferta
      ? Math.round(
          100 -
          (
            precioOfertaVariante /
            precioOriginal
          ) *
          100
        )
      : 0;


  const sku =
    varianteSeleccionada
      ?.cod_producto ||
    'SIN SKU';


  const descripcion =
    producto.descripcion_corta ||
    'Descripción no disponible.';


  // ======================================================
  // GUÍA DE TALLAS
  // ======================================================

  const guiaTallasUrl =
    guiaTallasCategoriaUrl ||
    null;


  const tieneGuiaTallas =
    Boolean(
      guiaTallasUrl
    );


  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="detalleProducto">

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
        imagen={
          seo.imagen
        }
        tipo={
          seo.tipo
        }
        imagenAlt={
          seo.imagenAlt
        }
        datosEstructurados={
          seo.datosEstructurados
        }
      />


      <div className="detalleProducto__contenido">

        <div className="detalleProducto__encabezadoPagina">

          <span>
            DETALLE DEL PRODUCTO
          </span>

        </div>


        <div className="detalleProducto__grid">

          <GaleriaImagenes
            imagenes={
              imagenes
            }
            nombreProducto={
              producto.nombre
            }
          />


          <section
            className="detalleProducto__informacion"
            aria-labelledby="detalle-producto-titulo"
          >

            <h1
              id="detalle-producto-titulo"
              className="detalleProducto__titulo"
            >
              {producto.nombre}
            </h1>


            <p className="detalleProducto__marca">

              {
                nombreMarca
                  ? nombreMarca.toUpperCase()
                  : 'CHAPACO SPORT'
              }

            </p>


            <div className="detalleProducto__precios">

              <span className="detalleProducto__precioActual">

                Bs. {
                  precioActual.toFixed(
                    2
                  )
                }

              </span>


              {
                tieneOferta && (

                  <span className="detalleProducto__precioOriginal">

                    Bs. {
                      precioOriginal.toFixed(
                        2
                      )
                    }

                  </span>

                )
              }


              {
                tieneOferta && (

                  <span className="detalleProducto__badgeOferta">

                    -
                    {
                      porcentajeOferta
                    }
                    %

                  </span>

                )
              }

            </div>


            {
              coloresDisponibles.length >
                0 && (

                <div
                  className="detalleProducto__grupoSeleccion"
                  role="group"
                  aria-labelledby="detalle-colores-label"
                >

                  <span
                    id="detalle-colores-label"
                    className="detalleProducto__label"
                  >
                    COLORES
                  </span>


                  <div className="detalleProducto__opcionesColor">

                    {
                      coloresDisponibles.map(
                        (
                          color
                        ) => {

                          const activo =
                            colorSeleccionado ===
                            color;


                          const agotado =
                            !colorEstaDisponible(
                              color
                            );


                          return (

                            <button
                              key={
                                color
                              }
                              type="button"
                              disabled={
                                agotado
                              }
                              aria-pressed={
                                activo
                              }
                              className={`detalleProducto__btnColor ${
                                activo
                                  ? 'detalleProducto__btnColor--activo'
                                  : ''
                              } ${
                                agotado
                                  ? 'detalleProducto__btnColor--desactivado'
                                  : ''
                              }`}
                              onClick={() =>
                                seleccionarColor(
                                  color
                                )
                              }
                              title={
                                agotado
                                  ? `${color} agotado`
                                  : `Seleccionar color ${color}`
                              }
                            >

                              <span>
                                {color}
                              </span>


                              {
                                agotado && (

                                  <small>
                                    AGOTADO
                                  </small>

                                )
                              }

                            </button>

                          );
                        }
                      )
                    }

                  </div>

                </div>

              )
            }


            {
              tallasDisponibles.length >
                0 && (

                <div
                  className="detalleProducto__grupoSeleccion"
                  role="group"
                  aria-labelledby="detalle-tallas-label"
                >

                  <div className="detalleProducto__labelHeader">

                    <span
                      id="detalle-tallas-label"
                    >
                      TALLAS
                    </span>


                    {
                      tieneGuiaTallas && (

                        <button
                          type="button"
                          className="detalleProducto__guiaTallasBtn"
                          onClick={() =>
                            setGuiaTallasAbierta(
                              true
                            )
                          }
                        >
                          Guía de tallas
                        </button>

                      )
                    }

                  </div>


                  <div className="detalleProducto__opcionesTalla">

                    {
                      tallasDisponibles.map(
                        (
                          talla
                        ) => {

                          const activa =
                            tallaSeleccionada ===
                            talla;


                          const agotada =
                            !tallaEstaDisponible(
                              talla
                            );


                          return (

                            <button
                              key={
                                talla
                              }
                              type="button"
                              disabled={
                                agotada
                              }
                              aria-pressed={
                                activa
                              }
                              className={`detalleProducto__btnTalla ${
                                activa
                                  ? 'detalleProducto__btnTalla--activo'
                                  : ''
                              } ${
                                agotada
                                  ? 'detalleProducto__btnTalla--desactivado'
                                  : ''
                              }`}
                              onClick={() =>
                                seleccionarTalla(
                                  talla
                                )
                              }
                              title={
                                agotada
                                  ? 'Talla agotada'
                                  : `Seleccionar talla ${talla}`
                              }
                            >

                              <span>
                                {talla}
                              </span>


                              {
                                agotada && (

                                  <small>
                                    AGOTADO
                                  </small>

                                )
                              }

                            </button>

                          );
                        }
                      )
                    }

                  </div>


                  <div
                    className={`detalleProducto__estadoVariante ${
                      combinacionAgotada
                        ? 'detalleProducto__estadoVariante--agotado'
                        : 'detalleProducto__estadoVariante--disponible'
                    }`}
                    role="status"
                    aria-live="polite"
                  >

                    {
                      productoAgotado
                        ? 'Producto agotado'
                        : combinacionAgotada
                          ? 'Agotado'
                          : `Disponible · ${colorSeleccionado} / ${tallaSeleccionada}`
                    }

                  </div>

                </div>

              )
            }


            <div className="detalleProducto__filaAcciones">

              <div className="detalleProducto__cantidad">

                <span className="detalleProducto__label">
                  CANTIDAD
                </span>


                <div
                  className="detalleProducto__cantidadControl"
                  role="group"
                  aria-label="Seleccionar cantidad"
                >

                  <button
                    type="button"
                    onClick={
                      disminuirCantidad
                    }
                    disabled={
                      cantidad <=
                      1
                    }
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>


                  <span
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {cantidad}
                  </span>


                  <button
                    type="button"
                    onClick={
                      aumentarCantidad
                    }
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>

                </div>

              </div>


              <div className="detalleProducto__compartir">

                <span
                  className="detalleProducto__label"
                  aria-hidden="true"
                >
                  &nbsp;
                </span>


                <button
                  type="button"
                  className="detalleProducto__btnCompartir"
                  onClick={
                    manejarCompartir
                  }
                >

                  <Share2
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                  />


                  <span>
                    COMPARTIR
                  </span>

                </button>


                {
                  mensajeCompartir && (

                    <small
                      className="detalleProducto__mensajeCompartir"
                      role="status"
                      aria-live="polite"
                    >
                      {mensajeCompartir}
                    </small>

                  )
                }

              </div>

            </div>


            <button
              type="button"
              className="detalleProducto__btnAgregar"
              onClick={
                manejarAgregarCarrito
              }
              disabled={
                productoAgotado ||
                combinacionAgotada
              }
            >

              {
                productoAgotado ||
                combinacionAgotada
                  ? 'AGOTADO'
                  : 'AGREGAR AL CARRITO'
              }

            </button>


            <div className="detalleProducto__descripcion">

              <h2>
                DESCRIPCIÓN
              </h2>


              <p>
                {descripcion}
              </p>


              <span className="detalleProducto__sku">

                SKU:{' '}

                <strong>
                  {sku}
                </strong>

              </span>

            </div>

          </section>

        </div>

      </div>


      {/* =================================================
          POP-UP GUÍA DE TALLAS
      ================================================= */}

      {
        guiaTallasAbierta &&
        tieneGuiaTallas && (

          <div
            className="guiaTallasModal"
            onClick={() =>
              setGuiaTallasAbierta(
                false
              )
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="guia-tallas-titulo"
          >

            <div
              className="guiaTallasModal__contenido"
              onClick={
                (
                  evento
                ) =>
                  evento.stopPropagation()
              }
            >

              <button
                type="button"
                className="guiaTallasModal__cerrar"
                onClick={() =>
                  setGuiaTallasAbierta(
                    false
                  )
                }
                aria-label="Cerrar guía de tallas"
              >
                ×
              </button>


              <div className="guiaTallasModal__encabezado">

                <span className="guiaTallasModal__marca">

                  {
                    nombreMarca
                      ? nombreMarca.toUpperCase()
                      : 'CHAPACO SPORT'
                  }

                </span>


                <h2 id="guia-tallas-titulo">
                  GUÍA DE TALLAS
                </h2>


                <p>
                  {producto.nombre}
                </p>

              </div>


              <div className="guiaTallasModal__imagenContenedor">

                <img
                  src={
                    guiaTallasUrl
                  }
                  alt={
                    `Guía de tallas para ${producto.nombre}`
                  }
                  className="guiaTallasModal__imagen"
                  loading="eager"
                  decoding="async"
                />

              </div>


              <p className="guiaTallasModal__nota">
                Consulta las medidas antes
                de seleccionar tu talla.
              </p>

            </div>

          </div>

        )
      }


      {/* =================================================
          PRODUCTO AGREGADO
      ================================================= */}

      {
        notificacionCarrito && (

          <div
            className="detalleProducto__popupCarritoOverlay"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >

            <div className="detalleProducto__popupCarrito">

              <div className="detalleProducto__popupCarritoIcono">

                <Check
                  size={42}
                  strokeWidth={3}
                  aria-hidden="true"
                />

              </div>


              <div className="detalleProducto__popupCarritoContenido">

                <span className="detalleProducto__popupCarritoEtiqueta">
                  CHAPACO SPORT
                </span>


                <h2>
                  ¡AGREGADO AL CARRITO!
                </h2>


                <strong className="detalleProducto__popupCarritoProducto">
                  {notificacionCarrito.nombre}
                </strong>


                <p>

                  {notificacionCarrito.color}

                  <span aria-hidden="true">
                    •
                  </span>

                  Talla {
                    notificacionCarrito.talla
                  }

                  <span aria-hidden="true">
                    •
                  </span>

                  {
                    notificacionCarrito.cantidad
                  }{' '}

                  {
                    notificacionCarrito.cantidad ===
                    1
                      ? 'unidad'
                      : 'unidades'
                  }

                </p>

              </div>


              <div
                className="detalleProducto__popupCarritoBarra"
                aria-hidden="true"
              />

            </div>

          </div>

        )
      }

    </div>
  );
}


export default DetalleProducto;
