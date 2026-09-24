import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../servicios/firebaseConfig';

export function usarCarrusel() {
  const [diapositivas, setDiapositivas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const consulta = query(collection(db, 'carrusel'), orderBy('orden', 'asc'));

    const desuscribir = onSnapshot(
      consulta,
      (snapshot) => {
        const datos = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              activo: data.activo !== false,
              orden: data.orden ?? 0,
              sintesis: data.sintesis || '',
              ganchoUno: data.ganchoUno || '',
              ganchoDos: data.ganchoDos || '',
              descripcion: data.descripcion || '',
              enlaceBoton: data.enlaceBoton || '',
              tipoEnlace: data.tipoEnlace || 'interno',
              enlace: data.enlace || '#',
              imagenFondo: data.imagenFondo || '',
            };
          })
          .filter((item) => item.activo);

        setDiapositivas(datos);
        setCargando(false);
      },
      (err) => {
        console.error('Error escuchando carrusel:', err);
        setError(err);
        setCargando(false);
      }
    );

    return () => desuscribir();
  }, []);

  return { diapositivas, cargando, error };
}