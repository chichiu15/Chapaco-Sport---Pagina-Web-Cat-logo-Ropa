import { useEffect, useState } from 'react';
import {
  Minus,
  Plus,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';

import usarCarrito from '../../hooks/usarCarrito';

function obtenerPrecioItem(item) {
  const precioBase = Number(item.producto?.precio) || 0;
  const precioOferta = Number(item.variante?.precio_oferta);

  if (
    item.variante?.en_oferta === true &&
    Number.isFinite(precioOferta)
  ) {
    return precioOferta;
  }

  return precioBase;
}

function ResumenCarrito() {
  const {
    itemsCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
  } = usarCarrito();

  // Producto que está esperando confirmación para ser eliminado
  const [itemAEliminar, setItemAEliminar] = useState(null);

  const abrirConfirmacionEliminar = (item) => {
    setItemAEliminar(item);
  };

  const cerrarConfirmacionEliminar = () => {
    setItemAEliminar(null);
  };

  const confirmarEliminacion = () => {
    if (!itemAEliminar) {
      return;
    }

    eliminarProducto(itemAEliminar.clave);
    setItemAEliminar(null);
  };

  // Permite cerrar el modal con ESC
  useEffect(() => {
    if (!itemAEliminar) {
      return undefined;
    }

    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') {
        cerrarConfirmacionEliminar();
      }
    };

    window.addEventListener('keydown', manejarTecla);

    return () => {
      window.removeEventListener('keydown', manejarTecla);
    };
  }, [itemAEliminar]);

  if (itemsCarrito.length === 0) {
    return (
      <div className="resumenCarrito__vacio">
        <p>Tu carrito está vacío.</p>

        <span>
          Agrega productos para comenzar tu pedido.
        </span>
      </div>
    );
  }

  const nombreEliminar =
    itemAEliminar?.producto?.nombre || 'Producto';

  const tallaEliminar =
    itemAEliminar?.variante?.talla || 'Sin talla';

  const colorEliminar =
    itemAEliminar?.variante?.color_estampado || 'Sin color';

  return (
    <>
      <div className="resumenCarrito">
        {itemsCarrito.map((item) => {
          const precioUnitario = obtenerPrecioItem(item);
          const subtotalItem =
            precioUnitario * item.cantidad;

          const imagen =
            item.producto?.imagenes?.[0] || '';

          const nombre =
            item.producto?.nombre || 'Producto';

          const talla =
            item.variante?.talla || 'Sin talla';

          const color =
            item.variante?.color_estampado || 'Sin color';

          const sku =
            item.variante?.cod_producto || '';

          return (
            <article
              key={item.clave}
              className="resumenCarrito__item"
            >
              <div className="resumenCarrito__imagen">
                {imagen ? (
                  <img
                    src={imagen}
                    alt={nombre}
                    loading="lazy"
                  />
                ) : (
                  <div className="resumenCarrito__sinImagen">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="resumenCarrito__info">
                <div className="resumenCarrito__filaSuperior">
                  <div>
                    <h3>{nombre}</h3>

                    <p className="resumenCarrito__variante">
                      Talla: {talla} · Color: {color}
                    </p>

                    {sku && (
                      <p className="resumenCarrito__sku">
                        SKU: {sku}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="resumenCarrito__eliminar"
                    onClick={() =>
                      abrirConfirmacionEliminar(item)
                    }
                    aria-label={`Eliminar ${nombre}`}
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="resumenCarrito__filaInferior">
                  <div className="resumenCarrito__cantidad">
                    <button
                      type="button"
                      onClick={() =>
                        disminuirCantidad(item.clave)
                      }
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={15} />
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      type="button"
                      onClick={() =>
                        aumentarCantidad(item.clave)
                      }
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <div className="resumenCarrito__precios">
                    <span className="resumenCarrito__precioUnitario">
                      Bs. {precioUnitario.toFixed(2)} c/u
                    </span>

                    <strong>
                      Bs. {subtotalItem.toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {itemAEliminar && (
        <div
          className="confirmarEliminar__overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarConfirmacionEliminar();
            }
          }}
          role="presentation"
        >
          <div
            className="confirmarEliminar"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmar-eliminar-titulo"
          >
            <button
              type="button"
              className="confirmarEliminar__cerrar"
              onClick={cerrarConfirmacionEliminar}
              aria-label="Cerrar confirmación"
            >
              <X size={20} />
            </button>

            <div className="confirmarEliminar__icono">
              <AlertTriangle
                size={34}
                strokeWidth={2.2}
              />
            </div>

            <span className="confirmarEliminar__marca">
              CHAPACO SPORT
            </span>

            <h2 id="confirmar-eliminar-titulo">
              ¿ELIMINAR DEL CARRITO?
            </h2>

            <p className="confirmarEliminar__descripcion">
              Estás a punto de eliminar este producto de tu
              carrito.
            </p>

            <div className="confirmarEliminar__producto">
              <strong>{nombreEliminar}</strong>

              <span>
                {colorEliminar}
                <b>•</b>
                Talla {tallaEliminar}
                <b>•</b>
                {itemAEliminar.cantidad}{' '}
                {itemAEliminar.cantidad === 1
                  ? 'unidad'
                  : 'unidades'}
              </span>
            </div>

            <div className="confirmarEliminar__acciones">
              <button
                type="button"
                className="confirmarEliminar__cancelar"
                onClick={cerrarConfirmacionEliminar}
              >
                CANCELAR
              </button>

              <button
                type="button"
                className="confirmarEliminar__confirmar"
                onClick={confirmarEliminacion}
              >
                <Trash2 size={17} />
                ELIMINAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResumenCarrito;  