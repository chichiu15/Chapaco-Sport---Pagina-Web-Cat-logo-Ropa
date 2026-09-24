import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';


export const ContextoCarrito =
  createContext(null);


const CLAVE_LOCAL_STORAGE =
  'chapacoSport_carrito';


const obtenerCarritoGuardado =
  () => {
    try {
      const guardado =
        localStorage.getItem(
          CLAVE_LOCAL_STORAGE
        );


      if (!guardado) {
        return [];
      }


      const datos =
        JSON.parse(
          guardado
        );


      return Array.isArray(
        datos
      )
        ? datos
        : [];
    } catch (
      error
    ) {
      console.error(
        'Error recuperando carrito:',
        error
      );

      return [];
    }
  };


const obtenerPrecioItem =
  (item) => {
    const precioBase =
      Number(
        item.producto?.precio
      ) || 0;


    const precioOferta =
      Number(
        item.variante
          ?.precio_oferta
      );


    if (
      item.variante
        ?.en_oferta ===
        true &&
      Number.isFinite(
        precioOferta
      )
    ) {
      return precioOferta;
    }


    return precioBase;
  };


export function ProveedorCarrito({
  children,
}) {
  const [
    itemsCarrito,
    setItemsCarrito,
  ] =
    useState(
      obtenerCarritoGuardado
    );


  /*
    Persistencia local.
  */
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_LOCAL_STORAGE,

        JSON.stringify(
          itemsCarrito
        )
      );
    } catch (
      error
    ) {
      console.error(
        'Error guardando carrito:',
        error
      );
    }
  }, [itemsCarrito]);


  /*
    Sincronización entre pestañas.

    Si tienes Chapaco Sport abierto
    en dos pestañas, el carrito cambia
    también en la otra.
  */
  useEffect(() => {
    const manejarStorage =
      (evento) => {
        if (
          evento.key !==
          CLAVE_LOCAL_STORAGE
        ) {
          return;
        }


        try {
          const nuevosItems =
            evento.newValue
              ? JSON.parse(
                  evento.newValue
                )
              : [];


          setItemsCarrito(
            Array.isArray(
              nuevosItems
            )
              ? nuevosItems
              : []
          );
        } catch (
          error
        ) {
          console.error(
            'Error sincronizando carrito:',
            error
          );
        }
      };


    window.addEventListener(
      'storage',
      manejarStorage
    );


    return () => {
      window.removeEventListener(
        'storage',
        manejarStorage
      );
    };
  }, []);


  const agregarProducto =
    useCallback(
      (
        producto,
        variante = null,
        cantidad = 1
      ) => {
        if (!producto?.id) {
          console.error(
            'No se puede agregar un producto sin ID.'
          );

          return;
        }


        const cantidadNumerica =
          Number(
            cantidad
          );


        if (
          !Number.isFinite(
            cantidadNumerica
          ) ||
          cantidadNumerica <=
            0
        ) {
          return;
        }


        const clave =
          `${producto.id}__${
            variante?.id ??
            'sin-variante'
          }`;


        setItemsCarrito(
          (actual) => {
            const existente =
              actual.find(
                (item) =>
                  item.clave ===
                  clave
              );


            if (existente) {
              return actual.map(
                (item) =>
                  item.clave ===
                  clave
                    ? {
                        ...item,

                        cantidad:
                          item.cantidad +
                          cantidadNumerica,
                      }
                    : item
              );
            }


            return [
              ...actual,

              {
                clave,

                producto,

                variante,

                cantidad:
                  cantidadNumerica,
              },
            ];
          }
        );
      },
      []
    );


  const eliminarProducto =
    useCallback(
      (clave) => {
        setItemsCarrito(
          (actual) =>
            actual.filter(
              (item) =>
                item.clave !==
                clave
            )
        );
      },
      []
    );


  const cambiarCantidad =
    useCallback(
      (
        clave,
        nuevaCantidad
      ) => {
        const cantidad =
          Number(
            nuevaCantidad
          );


        setItemsCarrito(
          (actual) => {
            if (
              !Number.isFinite(
                cantidad
              ) ||
              cantidad <=
                0
            ) {
              return actual.filter(
                (item) =>
                  item.clave !==
                  clave
              );
            }


            return actual.map(
              (item) =>
                item.clave ===
                clave
                  ? {
                      ...item,

                      cantidad,
                    }
                  : item
            );
          }
        );
      },
      []
    );


  const aumentarCantidad =
    useCallback(
      (clave) => {
        setItemsCarrito(
          (actual) =>
            actual.map(
              (item) =>
                item.clave ===
                clave
                  ? {
                      ...item,

                      cantidad:
                        item.cantidad +
                        1,
                    }
                  : item
            )
        );
      },
      []
    );


  const disminuirCantidad =
    useCallback(
      (clave) => {
        setItemsCarrito(
          (actual) =>
            actual
              .map(
                (item) =>
                  item.clave ===
                  clave
                    ? {
                        ...item,

                        cantidad:
                          item.cantidad -
                          1,
                      }
                    : item
              )
              .filter(
                (item) =>
                  item.cantidad >
                  0
              )
        );
      },
      []
    );


  const vaciarCarrito =
    useCallback(() => {
      setItemsCarrito(
        []
      );
    }, []);


  const cantidadTotal =
    useMemo(
      () =>
        itemsCarrito.reduce(
          (
            total,
            item
          ) =>
            total +
            item.cantidad,
          0
        ),
      [
        itemsCarrito,
      ]
    );


  const subtotal =
    useMemo(
      () =>
        itemsCarrito.reduce(
          (
            total,
            item
          ) => {
            const precio =
              obtenerPrecioItem(
                item
              );


            return (
              total +
              precio *
                item.cantidad
            );
          },
          0
        ),
      [
        itemsCarrito,
      ]
    );


  const valor =
    useMemo(
      () => ({
        itemsCarrito,

        agregarProducto,

        eliminarProducto,

        cambiarCantidad,

        aumentarCantidad,

        disminuirCantidad,

        vaciarCarrito,

        cantidadTotal,

        subtotal,
      }),
      [
        itemsCarrito,
        agregarProducto,
        eliminarProducto,
        cambiarCantidad,
        aumentarCantidad,
        disminuirCantidad,
        vaciarCarrito,
        cantidadTotal,
        subtotal,
      ]
    );


  return (
    <ContextoCarrito.Provider
      value={valor}
    >
      {children}
    </ContextoCarrito.Provider>
  );
}