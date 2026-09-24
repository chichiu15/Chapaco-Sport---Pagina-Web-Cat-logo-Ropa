import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

import {
  storage,
} from '../firebaseConfig';


// ======================================================
// LIMPIAR NOMBRE DEL ARCHIVO
// ======================================================

const limpiarNombreArchivo = (
  nombre = ''
) => {

  return String(nombre)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
    .replace(
      /\s+/g,
      '-'
    )
    .replace(
      /[^a-z0-9._-]/g,
      ''
    );
};


// ======================================================
// OBTENER EXTENSIÓN DEL ARCHIVO
// ======================================================

const obtenerExtensionArchivo = (
  archivo
) => {

  const nombre =
    archivo?.name ||
    '';


  const partes =
    nombre.split('.');


  if (
    partes.length >
    1
  ) {

    const extension =
      limpiarNombreArchivo(
        partes.pop()
      );


    if (
      extension
    ) {
      return extension;
    }
  }


  const tipo =
    archivo?.type ||
    '';


  if (
    tipo ===
    'image/png'
  ) {
    return 'png';
  }


  if (
    tipo ===
      'image/jpeg' ||
    tipo ===
      'image/jpg'
  ) {
    return 'jpg';
  }


  if (
    tipo ===
    'image/webp'
  ) {
    return 'webp';
  }


  if (
    tipo ===
    'image/avif'
  ) {
    return 'avif';
  }


  if (
    tipo ===
    'image/svg+xml'
  ) {
    return 'svg';
  }


  if (
    tipo ===
    'image/gif'
  ) {
    return 'gif';
  }


  return 'png';
};


// ======================================================
// QUITAR EXTENSIÓN
// ======================================================

const quitarExtension =
  (
    nombre = ''
  ) => {

    return String(
      nombre
    ).replace(
      /\.[^.]+$/,
      ''
    );
  };


// ======================================================
// OPTIMIZAR IMAGEN ANTES DE SUBIR A FIREBASE
// ======================================================
//
// - PNG / JPG / WEBP / AVIF:
//     se redimensionan y convierten a WebP.
//
// - SVG:
//     se conserva intacto.
//
// - GIF:
//     se conserva intacto para no perder animación.
//
// - Si la versión WebP termina siendo más pesada
//   que el archivo original, se conserva el original.
//
// ======================================================

const optimizarImagen =
  async (
    archivo,
    {
      maxAncho = 1600,
      maxAlto = 1600,
      calidad = 0.82,
    } = {}
  ) => {

    if (
      !archivo ||
      !archivo.type?.startsWith(
        'image/'
      )
    ) {

      return {
        archivo,
        extension:
          obtenerExtensionArchivo(
            archivo
          ),
        optimizado:
          false,
      };
    }


    // SVG y GIF no se rasterizan.
    if (
      archivo.type ===
        'image/svg+xml' ||
      archivo.type ===
        'image/gif'
    ) {

      return {
        archivo,
        extension:
          obtenerExtensionArchivo(
            archivo
          ),
        optimizado:
          false,
      };
    }


    let bitmap;


    try {

      bitmap =
        await createImageBitmap(
          archivo
        );


      const anchoOriginal =
        bitmap.width;


      const altoOriginal =
        bitmap.height;


      const escala =
        Math.min(
          1,
          maxAncho /
            anchoOriginal,
          maxAlto /
            altoOriginal
        );


      const anchoFinal =
        Math.max(
          1,
          Math.round(
            anchoOriginal *
            escala
          )
        );


      const altoFinal =
        Math.max(
          1,
          Math.round(
            altoOriginal *
            escala
          )
        );


      const canvas =
        document.createElement(
          'canvas'
        );


      canvas.width =
        anchoFinal;


      canvas.height =
        altoFinal;


      const contexto =
        canvas.getContext(
          '2d',
          {
            alpha:
              true,
          }
        );


      if (
        !contexto
      ) {

        throw new Error(
          'No fue posible procesar la imagen.'
        );
      }


      contexto.drawImage(
        bitmap,
        0,
        0,
        anchoFinal,
        altoFinal
      );


      const blobWebp =
        await new Promise(
          (
            resolver
          ) => {

            canvas.toBlob(
              resolver,
              'image/webp',
              calidad
            );
          }
        );


      bitmap.close?.();


      if (
        !blobWebp
      ) {

        return {
          archivo,
          extension:
            obtenerExtensionArchivo(
              archivo
            ),
          optimizado:
            false,
        };
      }


      /*
        Si WebP queda más pesado que el original,
        no tiene sentido reemplazarlo.
      */

      if (
        blobWebp.size >=
        archivo.size
      ) {

        return {
          archivo,
          extension:
            obtenerExtensionArchivo(
              archivo
            ),
          optimizado:
            false,
        };
      }


      const nombreBase =
        limpiarNombreArchivo(
          quitarExtension(
            archivo.name ||
            'imagen'
          )
        ) ||
        'imagen';


      const archivoOptimizado =
        new File(
          [
            blobWebp,
          ],
          `${nombreBase}.webp`,
          {
            type:
              'image/webp',

            lastModified:
              Date.now(),
          }
        );


      return {
        archivo:
          archivoOptimizado,

        extension:
          'webp',

        optimizado:
          true,

        tamanoOriginal:
          archivo.size,

        tamanoFinal:
          archivoOptimizado.size,
      };

    } catch (
      error
    ) {

      if (
        bitmap
      ) {
        bitmap.close?.();
      }


      console.warn(
        'No se pudo optimizar la imagen. Se subirá el archivo original.',
        error
      );


      return {
        archivo,
        extension:
          obtenerExtensionArchivo(
            archivo
          ),
        optimizado:
          false,
      };
    }
  };


// ======================================================
// SUBIR UNA IMAGEN DE PRODUCTO
// ======================================================

export const subirImagenProducto =
  async (
    productoId,
    archivo,
    indice = 0
  ) => {

    if (
      !archivo
    ) {

      throw new Error(
        'No se recibió ningún archivo.'
      );
    }


    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {

      throw new Error(
        `"${archivo.name}" no es una imagen válida.`
      );
    }


    const resultadoOptimizacion =
      await optimizarImagen(
        archivo,
        {
          maxAncho:
            1600,

          maxAlto:
            1600,

          calidad:
            0.82,
        }
      );


    const archivoFinal =
      resultadoOptimizacion.archivo;


    const nombreBase =
      limpiarNombreArchivo(
        quitarExtension(
          archivo.name
        )
      ) ||
      'producto';


    const extension =
      resultadoOptimizacion.extension;


    const nombreFinal =
      `${Date.now()}-${indice}-${nombreBase}.${extension}`;


    const referencia =
      ref(
        storage,
        `productos/${productoId}/${nombreFinal}`
      );


    const resultado =
      await uploadBytes(
        referencia,
        archivoFinal,
        {
          contentType:
            archivoFinal.type,

          cacheControl:
            'public,max-age=31536000,immutable',
        }
      );


    const url =
      await getDownloadURL(
        resultado.ref
      );


    return {
      url,

      ruta:
        resultado.ref.fullPath,
    };
  };


// ======================================================
// SUBIR VARIAS IMÁGENES DE PRODUCTO
// ======================================================

export const subirImagenesProducto =
  async (
    productoId,
    archivos
  ) => {

    const listaArchivos =
      Array.from(
        archivos ||
        []
      );


    if (
      listaArchivos.length ===
      0
    ) {
      return [];
    }


    return Promise.all(
      listaArchivos.map(
        (
          archivo,
          indice
        ) =>
          subirImagenProducto(
            productoId,
            archivo,
            indice
          )
      )
    );
  };


// ======================================================
// ELIMINAR UNA IMAGEN DE STORAGE
// ======================================================

export const eliminarImagenStorage =
  async (
    ruta
  ) => {

    if (
      !ruta
    ) {
      return;
    }


    const referencia =
      ref(
        storage,
        ruta
      );


    try {

      await deleteObject(
        referencia
      );

    } catch (
      error
    ) {

      if (
        error?.code ===
        'storage/object-not-found'
      ) {
        return;
      }


      throw error;
    }
  };


// ======================================================
// ELIMINAR VARIAS IMÁGENES
// ======================================================

export const eliminarImagenesStorage =
  async (
    rutas
  ) => {

    const lista =
      rutas ||
      [];


    await Promise.all(
      lista.map(
        (
          ruta
        ) =>
          eliminarImagenStorage(
            ruta
          )
      )
    );
  };


// ======================================================
// SUBIR / REEMPLAZAR IMAGEN DEL CARRUSEL
// ======================================================

export const subirImagenCarrusel =
  async (
    carruselId,
    archivo,
    rutaExistente = ''
  ) => {

    if (
      !carruselId
    ) {

      throw new Error(
        'No se recibió el ID del carrusel.'
      );
    }


    if (
      !archivo
    ) {

      throw new Error(
        'No se recibió ninguna imagen.'
      );
    }


    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {

      throw new Error(
        'El archivo seleccionado no es una imagen.'
      );
    }


    const resultadoOptimizacion =
      await optimizarImagen(
        archivo,
        {
          maxAncho:
            1920,

          maxAlto:
            1400,

          calidad:
            0.84,
        }
      );


    const archivoFinal =
      resultadoOptimizacion.archivo;


    const extension =
      resultadoOptimizacion.extension;


    /*
      El carrusel conserva una sola imagen física.

      Si antes existía imagen.png y ahora
      optimizamos a imagen.webp, cambiaremos
      limpiamente la ruta.
    */

    const rutaBase =
      rutaExistente
        ? rutaExistente.replace(
            /\.[^.\/]+$/,
            ''
          )
        : `carrusel/${carruselId}/imagen`;


    const rutaFinal =
      `${rutaBase}.${extension}`;


    const referencia =
      ref(
        storage,
        rutaFinal
      );


    const resultado =
      await uploadBytes(
        referencia,
        archivoFinal,
        {
          contentType:
            archivoFinal.type,

          cacheControl:
            'public,max-age=31536000,immutable',
        }
      );


    /*
      Si cambió la extensión, eliminamos
      la imagen antigua para no dejar duplicados.
    */

    if (
      rutaExistente &&
      rutaExistente !==
        rutaFinal
    ) {

      try {

        await eliminarImagenStorage(
          rutaExistente
        );

      } catch (
        error
      ) {

        console.warn(
          'La imagen nueva se guardó, pero no se pudo eliminar la anterior:',
          error
        );
      }
    }


    const urlOriginal =
      await getDownloadURL(
        resultado.ref
      );


    const separador =
      urlOriginal.includes(
        '?'
      )
        ? '&'
        : '?';


    const url =
      `${urlOriginal}${separador}v=${Date.now()}`;


    return {
      url,

      ruta:
        resultado.ref.fullPath,
    };
  };


// ======================================================
// ELIMINAR ARCHIVO UTILIZANDO SU URL
// ======================================================

export const eliminarArchivoPorUrl =
  async (
    url
  ) => {

    if (
      !url
    ) {
      return;
    }


    try {

      const referencia =
        ref(
          storage,
          url
        );


      await deleteObject(
        referencia
      );

    } catch (
      error
    ) {

      if (
        error?.code ===
        'storage/object-not-found'
      ) {
        return;
      }


      throw error;
    }
  };


// ======================================================
// SUBIR GUÍA DE TALLAS DE UNA CATEGORÍA
// ======================================================

export const subirGuiaTallasCategoria =
  async (
    categoriaId,
    archivo
  ) => {

    if (
      !archivo
    ) {

      throw new Error(
        'No se recibió ninguna imagen.'
      );
    }


    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {

      throw new Error(
        'El archivo seleccionado no es una imagen.'
      );
    }


    const resultadoOptimizacion =
      await optimizarImagen(
        archivo,
        {
          maxAncho:
            1600,

          maxAlto:
            2000,

          calidad:
            0.86,
        }
      );


    const archivoFinal =
      resultadoOptimizacion.archivo;


    const nombreBase =
      limpiarNombreArchivo(
        quitarExtension(
          archivo.name
        )
      ) ||
      'guia-tallas';


    const extension =
      resultadoOptimizacion.extension;


    const nombreFinal =
      `${Date.now()}-${nombreBase}.${extension}`;


    const referencia =
      ref(
        storage,
        `guias-tallas/categorias/${categoriaId}/${nombreFinal}`
      );


    const resultado =
      await uploadBytes(
        referencia,
        archivoFinal,
        {
          contentType:
            archivoFinal.type,

          cacheControl:
            'public,max-age=31536000,immutable',
        }
      );


    const url =
      await getDownloadURL(
        resultado.ref
      );


    return {
      url,

      ruta:
        resultado.ref.fullPath,
    };
  };


// ======================================================
// BUSCAR LOGO EXISTENTE DE UNA MARCA
// ======================================================

export const obtenerLogoMarcaExistente =
  async (
    marcaId,
    rutaPreferida = ''
  ) => {

    if (
      !marcaId
    ) {
      return null;
    }


    const idLimpio =
      limpiarNombreArchivo(
        marcaId
      );


    const rutas =
      [];


    if (
      rutaPreferida
    ) {

      rutas.push(
        rutaPreferida
      );
    }


    const extensiones = [
      'webp',
      'avif',
      'png',
      'jpg',
      'jpeg',
      'svg',
    ];


    extensiones.forEach(
      (
        extension
      ) => {

        rutas.push(
          `marcas-ui/logos/${idLimpio}.${extension}`
        );


        rutas.push(
          `marcas-ui/logos/logo-${idLimpio}.${extension}`
        );
      }
    );


    const rutasUnicas = [
      ...new Set(
        rutas
      ),
    ];


    for (
      const ruta of rutasUnicas
    ) {

      try {

        const referencia =
          ref(
            storage,
            ruta
          );


        const url =
          await getDownloadURL(
            referencia
          );


        return {
          url,
          ruta,
        };

      } catch (
        error
      ) {

        if (
          error?.code ===
          'storage/object-not-found'
        ) {
          continue;
        }


        throw error;
      }
    }


    return null;
  };


// ======================================================
// SUBIR / REEMPLAZAR LOGO DE UNA MARCA
// ======================================================

export const subirLogoMarca =
  async (
    marcaId,
    archivo,
    rutaExistente = ''
  ) => {

    if (
      !marcaId
    ) {

      throw new Error(
        'No se recibió el ID de la marca.'
      );
    }


    if (
      !archivo
    ) {

      throw new Error(
        'No se recibió ningún logo.'
      );
    }


    if (
      !archivo.type.startsWith(
        'image/'
      )
    ) {

      throw new Error(
        'El archivo seleccionado no es una imagen.'
      );
    }


    const idLimpio =
      limpiarNombreArchivo(
        marcaId
      );


    const resultadoOptimizacion =
      await optimizarImagen(
        archivo,
        {
          maxAncho:
            1000,

          maxAlto:
            1000,

          calidad:
            0.88,
        }
      );


    const archivoFinal =
      resultadoOptimizacion.archivo;


    const extension =
      resultadoOptimizacion.extension;


    const rutaBase =
      rutaExistente
        ? rutaExistente.replace(
            /\.[^.\/]+$/,
            ''
          )
        : `marcas-ui/logos/${idLimpio}`;


    const rutaFinal =
      `${rutaBase}.${extension}`;


    const referencia =
      ref(
        storage,
        rutaFinal
      );


    const resultado =
      await uploadBytes(
        referencia,
        archivoFinal,
        {
          contentType:
            archivoFinal.type,

          cacheControl:
            'public,max-age=31536000,immutable',
        }
      );


    if (
      rutaExistente &&
      rutaExistente !==
        rutaFinal
    ) {

      try {

        await eliminarImagenStorage(
          rutaExistente
        );

      } catch (
        error
      ) {

        console.warn(
          'El logo nuevo se guardó, pero no se pudo eliminar el anterior:',
          error
        );
      }
    }


    const urlFirebase =
      await getDownloadURL(
        resultado.ref
      );


    const separador =
      urlFirebase.includes(
        '?'
      )
        ? '&'
        : '?';


    const url =
      `${urlFirebase}${separador}v=${Date.now()}`;


    return {
      url,

      ruta:
        resultado.ref.fullPath,
    };
  };