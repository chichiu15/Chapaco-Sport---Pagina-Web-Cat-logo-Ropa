import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../servicios/firebaseConfig';
import CargandoPagina from '../componentes/comun/CargandoPagina';

function RutaPrivada({ children }) {
  const [cargando, setCargando] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const desuscribir = onAuthStateChanged(auth, (usuario) => {
      setAutenticado(!!usuario);
      setCargando(false);
    });
    return () => desuscribir();
  }, []);

  if (cargando) return <CargandoPagina />;
  if (!autenticado) return <Navigate to="/admin" replace />;

  return children;
}

export default RutaPrivada;