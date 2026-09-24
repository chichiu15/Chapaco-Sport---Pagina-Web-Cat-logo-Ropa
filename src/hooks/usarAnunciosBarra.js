import {
  useEffect,
  useState,
} from 'react';

import {
  suscribirAnunciosBarra,
} from '../servicios/cliente/barraAnunciosPublicoServicio';


export function usarAnunciosBarra() {
  const [
    anuncios,
    setAnuncios,
  ] =
    useState([]);

  const [
    cargando,
    setCargando,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState(null);


  useEffect(() => {
    const desuscribir =
      suscribirAnunciosBarra(
        (datos) => {
          setAnuncios(
            datos
          );

          setError(
            null
          );

          setCargando(
            false
          );
        },

        (err) => {
          setError(
            err
          );

          setCargando(
            false
          );
        }
      );


    return () => {
      desuscribir();
    };
  }, []);


  return {
    anuncios,

    cargando,

    error,
  };
}