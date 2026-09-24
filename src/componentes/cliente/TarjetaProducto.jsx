import {
  Link,
} from 'react-router-dom';

import {
  formatearPrecio,
} from '../../utilidades/formatearPrecio';

import './TarjetaProducto.css';


function TarjetaProducto({
  producto,
  prioridad = false,
}) {

  const {
    id,
    nombre,
    precio,
    imagen,
    esNuevo,
    etiqueta,
    oferta,
  } =
    producto;


  const nombreProducto =
    nombre ||
    'Producto Chapaco Sport';


  return (
    <Link
      to={`/producto/${id}`}
      className="tarjetaProducto"
    >

      <div className="tarjetaProducto__imagenContenedor">

        <img
          src={
            imagen
          }
          alt={
            nombreProducto
          }
          loading={
            prioridad
              ? 'eager'
              : 'lazy'
          }
          decoding="async"
          fetchPriority={
            prioridad
              ? 'high'
              : 'auto'
          }
        />


        {oferta ? (

          <span className="tarjetaProducto__insignia tarjetaProducto__insignia--oferta">
            OFERTA
          </span>

        ) : (

          esNuevo && (

            <span className="tarjetaProducto__insignia tarjetaProducto__insignia--nuevo">
              NUEVO
            </span>

          )

        )}

      </div>


      {etiqueta && (

        <p className="tarjetaProducto__etiqueta">
          {etiqueta}
        </p>

      )}


      <h3 className="tarjetaProducto__nombre">
        {nombreProducto}
      </h3>


      {oferta ? (

        <p className="tarjetaProducto__precios">

          <span className="tarjetaProducto__precioOferta">
            {formatearPrecio(
              oferta.precioOferta
            )}
          </span>


          <span className="tarjetaProducto__precioTachado">
            {formatearPrecio(
              precio
            )}
          </span>


          <span className="tarjetaProducto__descuento">
            -
            {
              oferta.porcentajeDescuento
            }
            %
          </span>

        </p>

      ) : (

        <p className="tarjetaProducto__precio">
          {formatearPrecio(
            precio
          )}
        </p>

      )}

    </Link>
  );
}


export default TarjetaProducto;