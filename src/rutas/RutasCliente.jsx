import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutCliente from '../componentes/cliente/LayoutCliente';
import CargandoPagina from '../componentes/comun/CargandoPagina';

const Inicio = lazy(() =>
  import('../paginas/cliente/Inicio')
);

const Catalogo = lazy(() =>
  import('../paginas/cliente/Catalogo')
);

const DetalleProducto = lazy(() =>
  import('../paginas/cliente/DetalleProducto')
);

const Ofertas = lazy(() =>
  import('../paginas/cliente/Ofertas')
);

const Marcas = lazy(() =>
  import('../paginas/cliente/Marcas')
);

const Promociones = lazy(() =>
  import('../paginas/cliente/Promociones')
);

const PaginaNoEncontrada = lazy(() =>
  import('../paginas/cliente/PaginaNoEncontrada')
);

function RutasCliente() {
  return (
    <Routes>
      <Route element={<LayoutCliente />}>

        {/* INICIO */}
        <Route
          index
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Inicio />
            </Suspense>
          }
        />

        {/* CATÁLOGO */}
        <Route
          path="catalogo"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Catalogo />
            </Suspense>
          }
        />

        {/* MARCAS */}
        <Route
          path="marcas"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Marcas />
            </Suspense>
          }
        />

        {/* OFERTAS */}
        <Route
          path="ofertas"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Ofertas />
            </Suspense>
          }
        />

        {/* BÚSQUEDA */}
        <Route
          path="promociones"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Promociones />
            </Suspense>
          }
        />

        {/* BÚSQUEDA */}
        <Route
          path="busqueda"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <Catalogo />
            </Suspense>
          }
        />

        {/* DETALLE DE PRODUCTO */}
        <Route
          path="producto/:idProducto"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <DetalleProducto />
            </Suspense>
          }
        />

        {/* 404 - CUALQUIER RUTA INEXISTENTE */}
        <Route
          path="*"
          element={
            <Suspense fallback={<CargandoPagina />}>
              <PaginaNoEncontrada />
            </Suspense>
          }
        />

      </Route>
    </Routes>
  );
}

export default RutasCliente;
