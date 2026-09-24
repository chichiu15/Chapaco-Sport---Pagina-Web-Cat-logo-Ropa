import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import {
  db,
} from '../servicios/firebaseConfig';

import { ordenarVariantes } from '../utilidades/tallas';


export const ContextoCatalogoPublico =
  createContext(null);


// ======================================================
// NORMALIZAR BOOLEANO
// ======================================================

const convertirBooleano = (
  valor
) => {

  return (
    valor === true ||
    valor === 'true' ||
    valor === 1 ||
    valor === '1'
  );
};


// ======================================================
// OPTIMIZAR IMAGEN PARA TARJETAS
// ======================================================
//
// IMPORTANTE:
//
// - No modificamos Firestore.
// - No modificamos imágenes de Firebase Storage.
// - Solamente ajustamos imágenes de Unsplash para
//   que las tarjetas no descarguen archivos de 800 px.
//
// ======================================================

const optimizarImagenTarjeta = (
  url = ''
) => {

  if (
    !url ||
    typeof url !==
      'string'
  ) {
    return '';
  }


  try {

    const direccion =
      new URL(
        url
      );


    if (
      direccion.hostname !==
      'images.unsplash.com'
    ) {
      return url;
    }


    direccion.searchParams.set(
      'w',
      '480'
    );


    direccion.searchParams.set(
      'q',
      '75'
    );


    direccion.searchParams.set(
      'auto',
      'format'
    );


    direccion.searchParams.set(
      'fit',
      'crop'
    );


    return direccion.toString();

  } catch {

    return url;
  }
};


// ======================================================
// OBTENER VARIANTES
// ======================================================

const obtenerVariantes = (
  producto
) => {

  const mapa =
    producto.subcolecciones
      ?.variantes;


  if (
    !mapa ||
    typeof mapa !==
      'object'
  ) {
    return [];
  }


  return ordenarVariantes(Object.entries(
    mapa
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
};


// ======================================================
// OBTENER MEJOR OFERTA
// ======================================================

const obtenerMejorOferta = (
  producto,
  precioBase
) => {

  const variantes =
    obtenerVariantes(
      producto
    );


  let mejorOferta =
    null;


  variantes.forEach(
    (
      variante
    ) => {

      if (
        variante.disponible !==
          true ||
        variante.en_oferta !==
          true
      ) {
        return;
      }


      const precioOferta =
        Number(
          variante.precio_oferta
        );


      if (
        !Number.isFinite(
          precioOferta
        ) ||
        precioOferta <=
          0
      ) {
        return;
      }


      if (
        !mejorOferta ||
        precioOferta <
          mejorOferta.precioOferta
      ) {

        mejorOferta = {
          precioOferta,

          porcentajeDescuento:
            Number(
              precioBase
            ) >
            0
              ? Math.round(
                  100 -
                    (
                      precioOferta /
                      Number(
                        precioBase
                      )
                    ) *
                      100
                )
              : 0,
        };
      }
    }
  );


  return mejorOferta;
};


// ======================================================
// PROVEEDOR
// ======================================================

function ProveedorCatalogoPublico({
  children,
}) {

  const [
    productosBase,
    setProductosBase,
  ] =
    useState([]);


  const [
    categorias,
    setCategorias,
  ] =
    useState([]);


  const [
    marcas,
    setMarcas,
  ] =
    useState([]);


  const [
    cargandoProductos,
    setCargandoProductos,
  ] =
    useState(true);


  const [
    cargandoCategorias,
    setCargandoCategorias,
  ] =
    useState(true);


  const [
    cargandoMarcas,
    setCargandoMarcas,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState(null);


  // ======================================================
  // LISTENERS FIRESTORE
  // ======================================================

  useEffect(
    () => {

      // ==================================================
      // PRODUCTOS
      // ==================================================

      const consultaProductos =
        query(
          collection(
            db,
            'productos'
          ),

          where(
            'estado',
            '==',
            'activo'
          )
        );


      const desuscribirProductos =
        onSnapshot(
          consultaProductos,

          (
            snapshot
          ) => {

            setProductosBase(
              snapshot.docs.map(
                (
                  documento
                ) => ({
                  id:
                    documento.id,

                  ...documento.data(),
                })
              )
            );


            setCargandoProductos(
              false
            );
          },

          (
            err
          ) => {

            console.error(
              'Error escuchando productos públicos:',
              err
            );


            setError(
              err
            );


            setCargandoProductos(
              false
            );
          }
        );


      // ==================================================
      // CATEGORÍAS
      // ==================================================

      const desuscribirCategorias =
        onSnapshot(
          collection(
            db,
            'categorias'
          ),

          (
            snapshot
          ) => {

            setCategorias(
              snapshot.docs.map(
                (
                  documento
                ) => ({
                  id:
                    documento.id,

                  ...documento.data(),
                })
              )
            );


            setCargandoCategorias(
              false
            );
          },

          (
            err
          ) => {

            console.error(
              'Error escuchando categorías:',
              err
            );


            setError(
              err
            );


            setCargandoCategorias(
              false
            );
          }
        );


      // ==================================================
      // MARCAS
      // ==================================================

      const desuscribirMarcas =
        onSnapshot(
          collection(
            db,
            'marcas'
          ),

          (
            snapshot
          ) => {

            setMarcas(
              snapshot.docs.map(
                (
                  documento
                ) => ({
                  id:
                    documento.id,

                  ...documento.data(),
                })
              )
            );


            setCargandoMarcas(
              false
            );
          },

          (
            err
          ) => {

            console.error(
              'Error escuchando marcas:',
              err
            );


            setError(
              err
            );


            setCargandoMarcas(
              false
            );
          }
        );


      return () => {

        desuscribirProductos();

        desuscribirCategorias();

        desuscribirMarcas();
      };

    },
    []
  );


  // ======================================================
  // MAPA DE MARCAS
  // ======================================================

  const mapaMarcas =
    useMemo(
      () => {

        return marcas.reduce(
          (
            mapa,
            marca
          ) => {

            mapa[
              marca.id
            ] =
              marca.nombre ||
              marca.id;


            return mapa;
          },
          {}
        );

      },
      [
        marcas
      ]
    );


  // ======================================================
  // MAPA DE CATEGORÍAS
  // ======================================================

  const mapaCategorias =
    useMemo(
      () => {

        return categorias.reduce(
          (
            mapa,
            categoria
          ) => {

            mapa[
              categoria.id
            ] =
              categoria.nombre ||
              categoria.id;


            return mapa;
          },
          {}
        );

      },
      [
        categorias
      ]
    );


  // ======================================================
  // NORMALIZAR PRODUCTOS
  // ======================================================

  const productos =
    useMemo(
      () => {

        return productosBase.map(
          (
            data
          ) => {

            const precioBase =
              Number(
                data.precio
              ) ||
              0;


            const variantes =
              obtenerVariantes(
                data
              );


            const oferta =
              obtenerMejorOferta(
                data,
                precioBase
              );


            const precioEfectivo =
              oferta?.precioOferta ??
              precioBase;


            const imagenOriginal =
              Array.isArray(
                data.imagenes
              ) &&
              data.imagenes.length >
                0
                ? data.imagenes[
                    0
                  ]
                : '';


            return {
              ...data,


              // ============================================
              // IMAGEN PRINCIPAL OPTIMIZADA PARA TARJETA
              // ============================================

              imagen:
                optimizarImagenTarjeta(
                  imagenOriginal
                ),


              // ============================================
              // NUEVO DROP
              // ============================================

              esNuevo:
                convertirBooleano(
                  data.es_nuevo
                ),


              // ============================================
              // MARCA
              // ============================================

              etiqueta:
                mapaMarcas[
                  data.marca_id
                ]?.toUpperCase() ||
                data.marca_id
                  ?.toUpperCase() ||
                '',


              nombreMarca:
                mapaMarcas[
                  data.marca_id
                ] ||
                data.marca_id ||
                '',


              // ============================================
              // CATEGORÍA
              // ============================================

              nombreCategoria:
                mapaCategorias[
                  data.categoria_id
                ] ||
                data.categoria_id ||
                '',


              // ============================================
              // VARIANTES Y PRECIO
              // ============================================

              variantes,

              oferta,

              precioEfectivo,
            };
          }
        );

      },
      [
        productosBase,
        mapaMarcas,
        mapaCategorias,
      ]
    );


  // ======================================================
  // RANGO GLOBAL DE PRECIOS
  // ======================================================

  const rangoPreciosGlobal =
    useMemo(
      () => {

        if (
          productos.length ===
          0
        ) {

          return {
            min:
              0,

            max:
              10000,
          };
        }


        const precios =
          productos
            .map(
              (
                producto
              ) =>
                Number(
                  producto.precioEfectivo
                )
            )
            .filter(
              Number.isFinite
            );


        if (
          precios.length ===
          0
        ) {

          return {
            min:
              0,

            max:
              10000,
          };
        }


        return {
          min:
            Math.min(
              ...precios
            ),

          max:
            Math.max(
              ...precios
            ),
        };

      },
      [
        productos
      ]
    );


  // ======================================================
  // ESTADO DE CARGA
  // ======================================================

  const cargando =
    cargandoProductos ||
    cargandoCategorias ||
    cargandoMarcas;


  // ======================================================
  // VALOR DEL CONTEXTO
  // ======================================================

  const valor =
    useMemo(
      () => ({
        productos,

        categorias,

        marcas,

        rangoPreciosGlobal,

        cargando,

        error,
      }),

      [
        productos,
        categorias,
        marcas,
        rangoPreciosGlobal,
        cargando,
        error,
      ]
    );


  return (
    <ContextoCatalogoPublico.Provider
      value={
        valor
      }
    >

      {
        children
      }

    </ContextoCatalogoPublico.Provider>
  );
}


export default ProveedorCatalogoPublico;
