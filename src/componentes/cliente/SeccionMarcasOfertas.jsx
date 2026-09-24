import {
  Link,
} from 'react-router-dom';

import {
  BANNERS_MARCAS_OFERTAS,
} from '../../utilidades/datosEstaticosInicio';

import './SeccionMarcasOfertas.css';


function SeccionMarcasOfertas() {
  return (
    <section className="seccionMarcasOfertas">

      {BANNERS_MARCAS_OFERTAS.map(
        (banner) => (

          <Link
            key={
              banner.id
            }
            to={
              banner.ruta
            }
            className="seccionMarcasOfertas__banner"
          >

            <img
              src={
                banner.imagenFondo
              }
              alt=""
              aria-hidden="true"
              className="seccionMarcasOfertas__imagen"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />


            <div className="seccionMarcasOfertas__overlay" />


            <div className="seccionMarcasOfertas__contenido">

              <h3 className="seccionMarcasOfertas__titulo">
                {
                  banner.titulo
                }
              </h3>

              <span className="seccionMarcasOfertas__boton">
                EXPLORAR
              </span>

            </div>

          </Link>

        )
      )}

    </section>
  );
}


export default SeccionMarcasOfertas;