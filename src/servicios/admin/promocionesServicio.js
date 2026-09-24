import {
  collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const limpiarId = (valor = '') => String(valor).normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const normalizarCodigoDescuento = (valor = '') => String(valor).trim().toUpperCase()
  .replace(/\s+/g, '').replace(/[^A-Z0-9_-]/g, '');

const suscribir = (nombre, callback, onError) => onSnapshot(
  collection(db, nombre),
  (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => String(a.nombre || a.codigo).localeCompare(String(b.nombre || b.codigo), 'es'))),
  onError
);

export const suscribirPacks = (callback, onError) => suscribir('packs_ofertas', callback, onError);
export const suscribirCodigos = (callback, onError) => suscribir('codigos_descuento', callback, onError);

export const guardarPack = async (datos) => {
  const id = datos.id || `${limpiarId(datos.nombre)}-${Date.now().toString(36)}`;
  const datosGuardables = { ...datos };
  delete datosGuardables.id;
  delete datosGuardables.es_prueba;
  await setDoc(doc(db, 'packs_ofertas', id), {
    ...datosGuardables, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(),
    actualizado_en: serverTimestamp(), ...(datos.id ? {} : { creado_en: serverTimestamp() }),
  }, { merge: true });
  return id;
};

export const eliminarPack = (id) => deleteDoc(doc(db, 'packs_ofertas', id));

export const guardarCodigo = async (datos, idAnterior = '') => {
  const id = normalizarCodigoDescuento(datos.codigo);
  if (!id) throw new Error('El código no es válido.');
  const datosGuardables = { ...datos };
  delete datosGuardables.id;
  delete datosGuardables.es_prueba;
  await setDoc(doc(db, 'codigos_descuento', id), {
    ...datosGuardables, codigo: id, actualizado_en: serverTimestamp(),
    ...(!idAnterior || idAnterior !== id ? { creado_en: serverTimestamp() } : {}),
  }, { merge: true });
  if (idAnterior && idAnterior !== id) await deleteDoc(doc(db, 'codigos_descuento', idAnterior));
  return id;
};

export const eliminarCodigo = (id) => deleteDoc(doc(db, 'codigos_descuento', id));
