import { useContext } from 'react';
import { ContextoCarrito } from '../contextos/ContextoCarrito';

function usarCarrito() {
  const contexto = useContext(ContextoCarrito);

  if (!contexto) {
    throw new Error(
      'usarCarrito debe utilizarse dentro de ProveedorCarrito'
    );
  }

  return contexto;
}

export default usarCarrito;