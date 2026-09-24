import {
  lazy,
  Suspense,
  useCallback,
  useState,
} from 'react';

import {
  Outlet,
} from 'react-router-dom';

import BarraAnuncios from './BarraAnuncios';
import Cabecera from './Cabecera';
import PieDePagina from './PieDePagina';

import ProveedorCatalogoPublico from '../../contextos/ContextoCatalogoPublico';


const MiCarrito =
  lazy(
    () =>
      import(
        '../../paginas/cliente/MiCarrito'
      )
  );


function LayoutCliente() {
  const [
    carritoAbierto,
    setCarritoAbierto,
  ] =
    useState(false);


  const abrirCarrito =
    useCallback(() => {
      setCarritoAbierto(
        true
      );
    }, []);


  const cerrarCarrito =
    useCallback(() => {
      setCarritoAbierto(
        false
      );
    }, []);


  return (
    <ProveedorCatalogoPublico>

      <BarraAnuncios />


      <Cabecera
        alAbrirCarrito={
          abrirCarrito
        }
      />


      <main className="contenidoPrincipal">
        <Outlet />
      </main>


      <PieDePagina />


      {/*
        MiCarrito se descarga/monta únicamente
        cuando el cliente lo abre por primera vez.
      */}
      {carritoAbierto && (
        <Suspense fallback={null}>
          <MiCarrito
            abierto
            alCerrar={
              cerrarCarrito
            }
          />
        </Suspense>
      )}

    </ProveedorCatalogoPublico>
  );
}


export default LayoutCliente;