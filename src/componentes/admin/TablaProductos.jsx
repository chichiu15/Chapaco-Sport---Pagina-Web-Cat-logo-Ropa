import { ordenarVariantes } from '../../utilidades/tallas';

function TablaProductos({
  productos,
  categorias,
  onEditar,
  onEliminar,
}) {

  const obtenerVariantes = (
    producto
  ) => {
    return ordenarVariantes(Object.values(
      producto.subcolecciones
        ?.variantes || {}
    ));
  };


  const obtenerSku = (
    producto
  ) => {
    const variantes =
      obtenerVariantes(
        producto
      );

    if (
      variantes.length ===
      0
    ) {
      return '—';
    }

    const primerSku =
      variantes[0]
        ?.cod_producto ||
      '—';

    if (
      variantes.length ===
      1
    ) {
      return primerSku;
    }

    return `${primerSku} +${variantes.length - 1}`;
  };


  const obtenerStock = (
    producto
  ) => {
    const variantes =
      obtenerVariantes(
        producto
      );

    const disponibles =
      variantes.filter(
        (variante) =>
          variante.disponible ===
          true
      ).length;

    return {
      disponibles,

      total:
        variantes.length,
    };
  };


  const obtenerEstadoProducto = (
    producto
  ) => {
    if (
      producto.estado !==
      'activo'
    ) {
      return {
        texto:
          'INACTIVO',

        clase:
          'badge-inactivo',
      };
    }

    const variantes =
      obtenerVariantes(
        producto
      );

    const existeDisponible =
      variantes.some(
        (variante) =>
          variante.disponible ===
          true
      );

    if (
      variantes.length >
        0 &&
      !existeDisponible
    ) {
      return {
        texto:
          'SOLD OUT',

        clase:
          'badge-soldout',
      };
    }

    return {
      texto:
        'ACTIVO',

      clase:
        'badge-activo',
    };
  };


  const obtenerCategoria = (
    categoriaId
  ) => {
    const categoria =
      categorias.find(
        (cat) =>
          cat.id ===
          categoriaId
      );

    return (
      categoria?.nombre ||
      categoriaId ||
      '—'
    );
  };


  const puedeEditar =
    typeof onEditar ===
    'function';

  const puedeEliminar =
    typeof onEliminar ===
    'function';

  const tieneAcciones =
    puedeEditar ||
    puedeEliminar;


  if (
    productos.length ===
    0
  ) {
    return (
      <div className="admin-productos-vacio">
        No existen productos registrados.
      </div>
    );
  }


  return (
    <div className="admin-table-container">

      <table className="admin-table admin-productos-table">

        <thead>
          <tr>
            <th>
              Producto
            </th>

            <th>
              SKU
            </th>

            <th>
              Categoría
            </th>

            <th>
              Precio
            </th>

            <th>
              Stock
            </th>

            <th>
              Estado
            </th>

            {tieneAcciones && (
              <th>
                Acciones
              </th>
            )}
          </tr>
        </thead>


        <tbody>

          {productos.map(
            (
              producto
            ) => {

              const stock =
                obtenerStock(
                  producto
                );

              const estado =
                obtenerEstadoProducto(
                  producto
                );

              const imagen =
                Array.isArray(
                  producto.imagenes
                ) &&
                producto.imagenes.length >
                  0
                  ? producto.imagenes[
                      0
                    ]
                  : null;


              return (
                <tr
                  key={
                    producto.id
                  }
                >

                  {/* PRODUCTO */}

                  <td>
                    <div className="producto-admin__info">

                      <div className="producto-admin__miniatura">

                        {imagen ? (
                          <img
                            src={
                              imagen
                            }
                            alt={
                              producto.nombre
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="producto-admin__sinImagen">
                            SIN FOTO
                          </div>
                        )}

                      </div>


                      <div className="producto-admin__datos">

                        <strong>
                          {producto.nombre}
                        </strong>

                        <span>
                          {producto.id}
                        </span>

                      </div>

                    </div>
                  </td>


                  {/* SKU */}

                  <td>
                    <span className="producto-admin__sku">
                      {obtenerSku(
                        producto
                      )}
                    </span>
                  </td>


                  {/* CATEGORÍA */}

                  <td>
                    {obtenerCategoria(
                      producto.categoria_id
                    )}
                  </td>


                  {/* PRECIO */}

                  <td>
                    <strong>
                      Bs.{' '}
                      {producto.precio}
                    </strong>
                  </td>


                  {/* STOCK */}

                  <td>
                    <div className="producto-admin__stock">

                      <strong>
                        {stock.disponibles}
                      </strong>

                      <span>
                        / {stock.total}{' '}
                        variantes
                      </span>

                    </div>
                  </td>


                  {/* ESTADO */}

                  <td>
                    <span
                      className={
                        `badge-estado ${estado.clase}`
                      }
                    >
                      {estado.texto}
                    </span>
                  </td>


                  {/* ACCIONES */}

                  {tieneAcciones && (
                    <td>
                      <div className="producto-admin__acciones">

                        {puedeEditar && (
                          <button
                            type="button"
                            className="btn-icon"
                            title="Editar producto"
                            aria-label={
                              `Editar ${producto.nombre}`
                            }
                            onClick={() =>
                              onEditar(
                                producto
                              )
                            }
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 20h9" />

                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>
                        )}


                        {puedeEliminar && (
                          <button
                            type="button"
                            className="btn-icon btn-icon--delete"
                            title="Eliminar producto"
                            aria-label={
                              `Eliminar ${producto.nombre}`
                            }
                            onClick={() =>
                              onEliminar(
                                producto
                              )
                            }
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />

                              <path d="M19 6l-1 14H6L5 6" />

                              <path d="M10 11v6" />

                              <path d="M14 11v6" />

                              <path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                        )}

                      </div>
                    </td>
                  )}

                </tr>
              );
            }
          )}

        </tbody>

      </table>

    </div>
  );
}


export default TablaProductos;
