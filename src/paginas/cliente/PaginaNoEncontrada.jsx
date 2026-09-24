import {
  Link,
  useLocation,
} from 'react-router-dom';

import SEO
  from '../../componentes/comun/SEO';

import './PaginaNoEncontrada.css';


function PaginaNoEncontrada() {

  const ubicacion =
    useLocation();


  return (
    <div className="pagina-404">

      <SEO
        titulo="Página no encontrada | Chapaco Sport"
        descripcion="La página que buscas no existe o cambió de dirección. Regresa al inicio o explora el catálogo de Chapaco Sport."
        ruta={
          ubicacion.pathname
        }
        tipo="website"
        datosEstructurados={
          null
        }
        noIndex
      />


      <section className="pagina-404__contenido">

        <span
          className="pagina-404__codigo"
          aria-hidden="true"
        >
          404
        </span>


        <h1 className="pagina-404__titulo">
          Página no encontrada
        </h1>


        <p className="pagina-404__descripcion">
          Parece que la página que estás buscando no existe,
          fue eliminada o cambió de dirección.
        </p>


        <div className="pagina-404__acciones">

          <Link
            to="/"
            className="pagina-404__boton pagina-404__boton--principal"
          >
            Volver al inicio
          </Link>


          <Link
            to="/catalogo"
            className="pagina-404__boton pagina-404__boton--secundario"
          >
            Ver catálogo
          </Link>

        </div>

      </section>

    </div>
  );
}


export default PaginaNoEncontrada;