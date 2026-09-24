import CarruselHero from '../../componentes/cliente/CarruselHero';

import SeccionProductosDestacados from '../../componentes/cliente/SeccionProductosDestacados';

import SeccionMarcasOfertas from '../../componentes/cliente/SeccionMarcasOfertas';
import SeccionPromocionesPacks from '../../componentes/cliente/SeccionPromocionesPacks';

import SEO from '../../componentes/comun/SEO';

import {
  usarCarrusel,
} from '../../hooks/usarCarrusel';

import {
  usarProductosAleatorios,
} from '../../hooks/usarProductosAleatorios';

import './Inicio.css';


function Inicio() {
  const {
    diapositivas,

    cargando:
      cargandoCarrusel,
  } =
    usarCarrusel();


  const {
    productos,

    cargando:
      cargandoProductos,

    error,
  } =
    usarProductosAleatorios(
      4
    );


  return (
    <div>

      {/* =================================================
          SEO
      ================================================= */}

      <SEO
        titulo="Chapaco Sport | Ropa deportiva para hombre en Bolivia"
        descripcion="Chapaco Sport, tienda de ropa deportiva para hombre en Tarija con envíos a nivel Nacional (Bolivia). Explora camisetas, prendas de compresión, marcas, novedades y ofertas."
        ruta="/"
      />


      {/* =================================================
          HERO

          No esperamos a Productos.
      ================================================= */}

      {!cargandoCarrusel &&
        diapositivas.length >
          0 && (
        <CarruselHero
          diapositivas={
            diapositivas
          }
        />
      )}


      {cargandoCarrusel && (
        <div className="inicio__heroEsqueleto esqueleto" />
      )}

      <SeccionPromocionesPacks />


      {/* =================================================
          PRODUCTOS

          Carga independientemente.
      ================================================= */}

      <SeccionProductosDestacados
        productos={
          productos
        }
        cargando={
          cargandoProductos
        }
        error={
          error
        }
      />


      {/* =================================================
          BANNERS ESTÁTICOS

          No necesitan esperar Firebase.
      ================================================= */}

      <SeccionMarcasOfertas />

    </div>
  );
}


export default Inicio;
