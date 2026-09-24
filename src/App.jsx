import {
  lazy,
  Suspense,
} from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import RutasCliente from './rutas/RutasCliente';

import CargandoPagina from './componentes/comun/CargandoPagina';


/*
  Admin completamente separado del
  bundle inicial del cliente.
*/
const RutasAdmin =
  lazy(
    () =>
      import(
        './rutas/RutasAdmin'
      )
  );


function App() {
  return (
    <BrowserRouter>

      <Suspense
        fallback={
          <CargandoPagina />
        }
      >
        <Routes>

          <Route
            path="/admin/*"
            element={
              <RutasAdmin />
            }
          />


          <Route
            path="/*"
            element={
              <RutasCliente />
            }
          />


          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </Suspense>

    </BrowserRouter>
  );
}


export default App;