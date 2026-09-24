import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { promocionVigente } from '../../utilidades/descuentos';
import { normalizarCodigoDescuento } from '../admin/promocionesServicio';

export const suscribirPacksActivos = (callback, onError) => onSnapshot(
  collection(db, 'packs_ofertas'),
  (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .filter(promocionVigente).sort((a, b) => Number(b.porcentaje_descuento) - Number(a.porcentaje_descuento))),
  onError
);

export const obtenerCodigoDescuento = async (codigo) => {
  const id = normalizarCodigoDescuento(codigo);
  if (!id) return null;
  const snapshot = await getDoc(doc(db, 'codigos_descuento', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};
