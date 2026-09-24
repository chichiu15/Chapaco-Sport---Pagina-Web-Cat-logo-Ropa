import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  app,
  db,
} from '../servicios/firebaseConfig';

import {
  normalizarPermisosRol,
  PERMISOS_INICIALES,
} from '../servicios/admin/rolesServicio';


export const ContextoPermisosAdmin =
  createContext(null);


function ProveedorPermisosAdmin({
  children,
}) {
  const [
    cargandoPermisos,
    setCargandoPermisos,
  ] = useState(true);

  const [
    usuarioAdmin,
    setUsuarioAdmin,
  ] = useState(null);

  const [
    rolActual,
    setRolActual,
  ] = useState(null);

  const [
    errorPermisos,
    setErrorPermisos,
  ] = useState('');


  useEffect(() => {
    const auth =
      getAuth(
        app
      );


    let desuscribirUsuarioFirestore =
      null;

    let desuscribirRol =
      null;


    const limpiarSuscripciones =
      () => {
        if (
          desuscribirUsuarioFirestore
        ) {
          desuscribirUsuarioFirestore();

          desuscribirUsuarioFirestore =
            null;
        }


        if (
          desuscribirRol
        ) {
          desuscribirRol();

          desuscribirRol =
            null;
        }
      };


    const desuscribirAuth =
      onAuthStateChanged(
        auth,

        (usuarioAuth) => {
          limpiarSuscripciones();

          setUsuarioAdmin(
            null
          );

          setRolActual(
            null
          );

          setErrorPermisos(
            ''
          );


          if (
            !usuarioAuth
          ) {
            setCargandoPermisos(
              false
            );

            return;
          }


          setCargandoPermisos(
            true
          );


          /*
            IMPORTANTE:

            Buscamos por campo uid y NO
            asumimos que el ID del documento
            usuarios sea necesariamente el UID.

            Esto soporta también tus usuarios
            antiguos.
          */
          const consultaUsuario =
            query(
              collection(
                db,
                'usuarios'
              ),

              where(
                'uid',
                '==',
                usuarioAuth.uid
              ),

              limit(
                1
              )
            );


          desuscribirUsuarioFirestore =
            onSnapshot(
              consultaUsuario,

              (snapshot) => {
                if (
                  snapshot.empty
                ) {
                  if (
                    desuscribirRol
                  ) {
                    desuscribirRol();

                    desuscribirRol =
                      null;
                  }


                  setUsuarioAdmin(
                    null
                  );

                  setRolActual(
                    null
                  );

                  setErrorPermisos(
                    'Tu cuenta no tiene un perfil administrativo asociado.'
                  );

                  setCargandoPermisos(
                    false
                  );

                  return;
                }


                const documento =
                  snapshot.docs[
                    0
                  ];


                const datosUsuario = {
                  id:
                    documento.id,

                  ...documento.data(),
                };


                setUsuarioAdmin(
                  datosUsuario
                );


                if (
                  desuscribirRol
                ) {
                  desuscribirRol();

                  desuscribirRol =
                    null;
                }


                if (
                  !datosUsuario.rol
                ) {
                  setRolActual(
                    null
                  );

                  setErrorPermisos(
                    'Tu usuario no tiene un rol asignado.'
                  );

                  setCargandoPermisos(
                    false
                  );

                  return;
                }


                const referenciaRol =
                  doc(
                    db,
                    'roles',
                    datosUsuario.rol
                  );


                desuscribirRol =
                  onSnapshot(
                    referenciaRol,

                    (
                      snapshotRol
                    ) => {
                      if (
                        !snapshotRol.exists()
                      ) {
                        setRolActual(
                          null
                        );

                        setErrorPermisos(
                          'El rol asignado a tu usuario ya no existe.'
                        );

                        setCargandoPermisos(
                          false
                        );

                        return;
                      }


                      setRolActual({
                        id:
                          snapshotRol.id,

                        ...snapshotRol.data(),
                      });


                      setErrorPermisos(
                        ''
                      );

                      setCargandoPermisos(
                        false
                      );
                    },

                    (error) => {
                      console.error(
                        'Error leyendo rol:',
                        error
                      );

                      setErrorPermisos(
                        'No se pudieron comprobar los permisos del rol.'
                      );

                      setCargandoPermisos(
                        false
                      );
                    }
                  );
              },

              (error) => {
                console.error(
                  'Error leyendo usuario administrativo:',
                  error
                );

                setErrorPermisos(
                  'No se pudo comprobar el acceso administrativo.'
                );

                setCargandoPermisos(
                  false
                );
              }
            );
        }
      );


    return () => {
      limpiarSuscripciones();

      desuscribirAuth();
    };
  }, []);


  const permisos =
    useMemo(
      () => {
        /*
          Tanto usuario como rol deben
          estar habilitados.

          Un rol viejo sin campo estado
          se considera activo para no
          bloquear los datos existentes.
        */
        const usuarioActivo =
          usuarioAdmin?.estado ===
          true;

        const rolActivo =
          rolActual &&
          rolActual.estado !==
            false;


        if (
          !usuarioActivo ||
          !rolActivo
        ) {
          return {
            ...PERMISOS_INICIALES,
          };
        }


        return normalizarPermisosRol(
          rolActual
        );
      },
      [
        usuarioAdmin,
        rolActual,
      ]
    );


  const usuarioActivo =
    usuarioAdmin?.estado ===
    true;


  const rolActivo =
    Boolean(
      rolActual &&
      rolActual.estado !==
        false
    );


  const tieneAccesoAdmin =
    Boolean(
      usuarioActivo &&
      rolActivo
    );


  const tienePermiso =
    (permiso) =>
      tieneAccesoAdmin &&
      permisos[
        permiso
      ] ===
        true;


  const valor = {
    cargandoPermisos,

    usuarioAdmin,

    rolActual,

    permisos,

    usuarioActivo,

    rolActivo,

    tieneAccesoAdmin,

    errorPermisos,

    tienePermiso,
  };


  return (
    <ContextoPermisosAdmin.Provider
      value={valor}
    >
      {children}
    </ContextoPermisosAdmin.Provider>
  );
}


export default ProveedorPermisosAdmin;