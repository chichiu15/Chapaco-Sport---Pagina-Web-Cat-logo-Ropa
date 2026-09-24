import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import {
  db,
} from '../firebaseConfig';


const coleccionRoles =
  collection(
    db,
    'roles'
  );


export const GRUPOS_PERMISOS = [
  {
    titulo: 'Productos',

    descripcion:
      'Control sobre catálogo, creación, edición y eliminación de productos.',

    permisos: [
      {
        clave:
          'productos_ver',

        nombre:
          'Ver productos',

        descripcion:
          'Puede ingresar al listado administrativo de productos.',
      },

      {
        clave:
          'productos_crear',

        nombre:
          'Crear productos',

        descripcion:
          'Puede registrar productos, variantes e imágenes.',
      },

      {
        clave:
          'productos_editar',

        nombre:
          'Editar productos',

        descripcion:
          'Puede modificar datos, variantes, precios e imágenes.',
      },

      {
        clave:
          'productos_eliminar',

        nombre:
          'Eliminar productos',

        descripcion:
          'Puede eliminar productos del sistema.',
      },
    ],
  },

  {
    titulo:
      'Catálogo',

    descripcion:
      'Administración de categorías y marcas.',

    permisos: [
      {
        clave:
          'categorias_gestionar',

        nombre:
          'Gestionar categorías',

        descripcion:
          'Puede crear, editar y eliminar categorías.',
      },

      {
        clave:
          'marcas_gestionar',

        nombre:
          'Gestionar marcas',

        descripcion:
          'Puede crear, editar y eliminar marcas y sus guías.',
      },
    ],
  },

  {
    titulo:
      'Contenido',

    descripcion:
      'Contenido visual y promocional de la tienda.',

    permisos: [
      {
        clave:
          'anuncios_gestionar',

        nombre:
          'Gestionar anuncios',

        descripcion:
          'Puede administrar la barra de anuncios.',
      },

      {
        clave:
          'carrusel_gestionar',

        nombre:
          'Gestionar carrusel',

        descripcion:
          'Puede administrar diapositivas del carrusel principal.',
      },
      {
        clave:
          'promociones_gestionar',

        nombre:
          'Gestionar promociones',

        descripcion:
          'Puede crear packs automáticos y códigos de descuento.',
      },
    ],
  },

  {
    titulo:
      'Configuración del negocio',

    descripcion:
      'Información comercial, redes sociales, ubicaciones y canales de contacto.',

    permisos: [
      {
        clave:
          'configuracion_negocio_gestionar',

        nombre:
          'Gestionar configuración del negocio',

        descripcion:
          'Puede administrar la descripción del footer, redes sociales, ubicaciones y operadores de WhatsApp.',
      },
    ],
  },

  {
    titulo:
      'Personal y seguridad',

    descripcion:
      'Usuarios, roles y permisos administrativos.',

    permisos: [
      {
        clave:
          'usuarios_gestionar',

        nombre:
          'Gestionar usuarios',

        descripcion:
          'Puede crear, editar, activar y bloquear usuarios administrativos.',
      },

      {
        clave:
          'roles_gestionar',

        nombre:
          'Gestionar roles y permisos',

        descripcion:
          'Puede crear, editar, activar y eliminar roles.',
      },
    ],
  },
];


export const PERMISOS_INICIALES =
  GRUPOS_PERMISOS.reduce(
    (
      acumulado,
      grupo
    ) => {
      grupo.permisos.forEach(
        (permiso) => {
          acumulado[
            permiso.clave
          ] = false;
        }
      );

      return acumulado;
    },
    {}
  );


// ======================================================
// COMPATIBILIDAD CON LOS PERMISOS VIEJOS
// ======================================================

export const normalizarPermisosRol = (
  rol
) => {
  const permisos =
    rol?.permisos || {};


  return {
    productos_ver:
      permisos.productos_ver ??
      permisos.crear_producto ??
      permisos.editar_baja_producto ??
      false,

    productos_crear:
      permisos.productos_crear ??
      permisos.crear_producto ??
      false,

    productos_editar:
      permisos.productos_editar ??
      permisos.editar_baja_producto ??
      false,

    productos_eliminar:
      permisos.productos_eliminar ??
      permisos.editar_baja_producto ??
      false,

    categorias_gestionar:
      permisos.categorias_gestionar ??
      permisos.crear_categoria_marca ??
      permisos.editar_categoria_marca ??
      false,

    marcas_gestionar:
      permisos.marcas_gestionar ??
      permisos.crear_categoria_marca ??
      permisos.editar_categoria_marca ??
      false,

    usuarios_gestionar:
      permisos.usuarios_gestionar ??
      permisos.crear_editar_usuarios ??
      false,

    roles_gestionar:
      permisos.roles_gestionar ??
      permisos.crear_editar_roles ??
      false,

    anuncios_gestionar:
      permisos.anuncios_gestionar ??
      permisos.crear_editar_pagina ??
      false,

    carrusel_gestionar:
      permisos.carrusel_gestionar ??
      permisos.crear_editar_pagina ??
      false,

    promociones_gestionar:
      permisos.promociones_gestionar ??
      permisos.crear_editar_pagina ??
      permisos.anuncios_gestionar ??
      false,

    configuracion_negocio_gestionar:
      permisos.configuracion_negocio_gestionar ??
      false,
  };
};


// ======================================================
// ESCUCHAR ROLES EN TIEMPO REAL
// ======================================================

export const suscribirRoles = (
  callback
) => {
  return onSnapshot(
    coleccionRoles,

    (snapshot) => {
      callback(
        snapshot.docs.map(
          (documento) => ({
            id:
              documento.id,

            ...documento.data(),
          })
        )
      );
    }
  );
};


// ======================================================
// CREAR ROL
// ======================================================

export const crearRol = async (
  datos
) => {
  const referencia =
    await addDoc(
      coleccionRoles,
      {
        nombre:
          datos.nombre.trim(),

        estado:
          datos.estado !==
          false,

        permisos: {
          ...PERMISOS_INICIALES,

          ...datos.permisos,
        },
      }
    );


  return referencia.id;
};


// ======================================================
// EDITAR ROL
// ======================================================

export const editarRol = async (
  rolId,
  datos
) => {
  const referencia =
    doc(
      db,
      'roles',
      rolId
    );


  await updateDoc(
    referencia,
    {
      nombre:
        datos.nombre.trim(),

      estado:
        datos.estado ===
        true,

      permisos: {
        ...PERMISOS_INICIALES,

        ...datos.permisos,
      },
    }
  );


  return true;
};


// ======================================================
// SABER SI UN ROL TIENE USUARIOS
// ======================================================

export const obtenerUsuariosConRol =
  async (
    rolId
  ) => {
    const consulta =
      query(
        collection(
          db,
          'usuarios'
        ),

        where(
          'rol',
          '==',
          rolId
        )
      );


    const snapshot =
      await getDocs(
        consulta
      );


    return snapshot.docs.map(
      (documento) => ({
        id:
          documento.id,

        ...documento.data(),
      })
    );
  };


// ======================================================
// ELIMINAR ROL
// ======================================================

export const eliminarRol = async (
  rolId
) => {
  const usuarios =
    await obtenerUsuariosConRol(
      rolId
    );


  if (
    usuarios.length >
    0
  ) {
    throw new Error(
      `Este rol está asignado a ${usuarios.length} usuario(s). Reasígnalos antes de eliminarlo.`
    );
  }


  await deleteDoc(
    doc(
      db,
      'roles',
      rolId
    )
  );


  return true;
};
