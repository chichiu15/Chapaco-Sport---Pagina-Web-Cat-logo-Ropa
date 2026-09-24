import { collection, getDocs, doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, firebaseConfig } from '../firebaseConfig';

// 1. OBTENER ROLES PARA EL SELECTOR
export const obtenerRoles = async () => {
  const snapshot = await getDocs(collection(db, 'roles'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 2. LISTAR USUARIOS
export const obtenerUsuarios = async () => {
  const snapshot = await getDocs(collection(db, 'usuarios'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 3. CREAR USUARIO (Auth + Firestore)
export const crearUsuario = async (datos) => {
  const appSecundaria = initializeApp(firebaseConfig, "AppSecundariaCreadora");
  const authSecundario = getAuth(appSecundaria);

  try {
    const userCred = await createUserWithEmailAndPassword(authSecundario, datos.correo, datos.contraseña);
    const uid = userCred.user.uid;
    
    await setDoc(doc(db, 'usuarios', uid), {
      nombre: datos.nombre,
      correo: datos.correo,
      rol: datos.rol,
      estado: datos.estado === 'true' || datos.estado === true,
      uid: uid
    });

    await authSecundario.signOut();
    return uid;
  } catch (error) {
    throw error;
  }
};

// 4. EDITAR USUARIO (Solo datos en Firestore, no contraseña)
export const editarUsuario = async (id, datos) => {
  const docRef = doc(db, 'usuarios', id);
  await updateDoc(docRef, {
    nombre: datos.nombre,
    rol: datos.rol,
    estado: datos.estado === 'true' || datos.estado === true
  });
};

// 5. ESCUCHA USUARIOS EN TIEMPO REAL
export const suscribirUsuarios = (callback) => {
  return onSnapshot(collection(db, 'usuarios'), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

// 6. ESCUCHA ROLES EN TIEMPO REAL
export const suscribirRoles = (callback) => {
  return onSnapshot(collection(db, 'roles'), (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};