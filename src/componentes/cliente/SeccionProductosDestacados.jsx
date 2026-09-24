import {
  Link,
} from 'react-router-dom';

import TarjetaProducto from './TarjetaProducto';

import './SeccionProductosdestacados.css';


function SeccionProductosDestacados({
  productos = [],
  error,
  cargando = false,
}) {
  return (
    <section className="contenedor seccionProductos">

      <div className="seccionProductos__cabecera">

        <div>

          <h2 className="seccionProductos__titulo">
            NUESTROS PRODUCTOS
          </h2>

          <p className="seccionProductos__subtitulo">
            EXPLORA NUESTRAS CATEGORÍAS
          </p>

        </div>


        <Link
          to="/catalogo"
          className="seccionProductos__verTodos"
        >
          VER TODOS LOS PRODUCTOS
        </Link>

      </div>


      {error && (
        <p className="seccionProductos__error">
          No pudimos cargar los productos.
          Intenta recargar la página.
        </p>
      )}


      {!error &&
        cargando && (
        <div className="seccionProductos__grid">

          {Array.from({
            length: 4,
          }).map(
            (
              _,
              indice
            ) => (
              <div
                key={
                  indice
                }
                className="tarjetaProducto--esqueleto esqueleto"
              />
            )
          )}

        </div>
      )}


      {!error &&
        !cargando && (
        <div className="seccionProductos__grid">

          {productos.map(
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
      )}

    </section>
  );
}


export default SeccionProductosDestacados;
