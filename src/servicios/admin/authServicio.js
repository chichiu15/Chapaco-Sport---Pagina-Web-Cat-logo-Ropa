import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { app, db } from '../firebaseConfig';

const auth = getAuth(app);

export const iniciarSesion = async (correo, password) => {
  try {
    // 1. Autenticar en Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, correo, password);
    const uid = userCredential.user.uid;

    // 2. Verificar si este usuario existe en nuestra colección "usuarios"
    const q = query(collection(db, 'usuarios'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await signOut(auth);
      throw new Error('Acceso denegado: No tienes permisos de administrador.');
    }

    const userData = querySnapshot.docs[0].data();
    
    // Si el estado del usuario es false (inactivo)
    if (!userData.estado) {
      await signOut(auth);
      throw new Error('Tu cuenta se encuentra desactivada. Contacta a gerencia.');
    }

    return { user: userCredential.user, dbData: userData };
  } catch (error) {
    // Traducción de errores comunes de Firebase Auth
    if (
      error.code === 'auth/invalid-credential' || 
      error.code === 'auth/user-not-found' || 
      error.code === 'auth/wrong-password'
    ) {
      throw new Error('Correo o contraseña incorrectos. Verifica tus credenciales.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El formato del correo electrónico no es válido.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos fallidos. Inténtalo más tarde.');
    }
    
    throw error;
  }
};

export const solicitarCambioPassword = async (correo) => {
  try {
    await sendPasswordResetEmail(auth, correo);
    return true;
  } catch (error) {
    throw error;
  }
};

export const cerrarSesion = async () => {
  return await signOut(auth);
};