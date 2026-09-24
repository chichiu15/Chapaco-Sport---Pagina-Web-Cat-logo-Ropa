import {
  useEffect,
} from 'react';


const URL_BASE =
  'https://chapacosport.com';


const IMAGEN_OG_POR_DEFECTO =
  'https://firebasestorage.googleapis.com/v0/b/chapacosport-1468a.firebasestorage.app/o/branding%2Fog-chapaco-sport.jpg?alt=media&token=ad9c1329-794d-4591-8312-fff7130ca077';


// ======================================================
// DATOS ESTRUCTURADOS GENERALES DEL NEGOCIO
// ======================================================

const SCHEMA_NEGOCIO = {
  '@context':
    'https://schema.org',

  '@type':
    'ClothingStore',

  '@id':
    `${URL_BASE}/#negocio`,

  name:
    'Chapaco Sport',

  url:
    `${URL_BASE}/`,

  description:
    'Tienda de ropa deportiva para hombre en Tarija con envíos a nivel Nacional (Bolivia).',

  image:
    IMAGEN_OG_POR_DEFECTO,

  areaServed: {
    '@type':
      'Country',

    name:
      'Bolivia',
  },
};


// ======================================================
// INSERTAR / ACTUALIZAR JSON-LD
// ======================================================

const actualizarJsonLd =
  (
    id,
    datos
  ) => {

    let script =
      document.getElementById(
        id
      );


    if (!datos) {

      if (script) {
        script.remove();
      }

      return;
    }


    if (!script) {

      script =
        document.createElement(
          'script'
        );


      script.id =
        id;


      script.type =
        'application/ld+json';


      document.head.appendChild(
        script
      );
    }


    script.textContent =
      JSON.stringify(
        datos
      );
  };


// ======================================================
// NORMALIZAR RUTA CANÓNICA
// ======================================================

const obtenerRutaCanonica =
  (
    ruta = '/'
  ) => {

    const valor =
      String(
        ruta ||
        '/'
      ).trim();


    const rutaSinHash =
      valor.split(
        '#'
      )[0];


    const [
      pathnameOriginal
    ] =
      rutaSinHash.split(
        '?'
      );


    const pathname =
      pathnameOriginal === '/'
        ? '/'
        : `/${pathnameOriginal
            .replace(
              /^\/+|\/+$/g,
              ''
            )}`;


    if (
      pathname ===
      '/busqueda'
    ) {
      return '/catalogo';
    }


    if (
      pathname ===
      '/catalogo'
    ) {
      return '/catalogo';
    }


    return pathname;
  };


function SEO({
  titulo,
  descripcion,
  ruta = '/',
  imagen = IMAGEN_OG_POR_DEFECTO,
  tipo = 'website',
  imagenAlt = 'Chapaco Sport — Viste tu pasión',
  datosEstructurados = null,
  noIndex = false,
}) {

  useEffect(
    () => {

      // ==================================================
      // HELPERS META
      // ==================================================

      const asegurarMetaName =
        (
          nombre
        ) => {

          let elemento =
            document.querySelector(
              `meta[name="${nombre}"]`
            );


          if (!elemento) {

            elemento =
              document.createElement(
                'meta'
              );


            elemento.setAttribute(
              'name',
              nombre
            );


            document.head.appendChild(
              elemento
            );
          }


          return elemento;
        };


      const asegurarMetaProperty =
        (
          propiedad
        ) => {

          let elemento =
            document.querySelector(
              `meta[property="${propiedad}"]`
            );


          if (!elemento) {

            elemento =
              document.createElement(
                'meta'
              );


            elemento.setAttribute(
              'property',
              propiedad
            );


            document.head.appendChild(
              elemento
            );
          }


          return elemento;
        };


      // ==================================================
      // URL CANÓNICA
      // ==================================================

      const rutaCanonica =
        obtenerRutaCanonica(
          ruta
        );


      const urlCompleta =
        `${URL_BASE}${rutaCanonica}`;


      // ==================================================
      // TITLE
      // ==================================================

      if (titulo) {

        document.title =
          titulo;
      }


      // ==================================================
      // META DESCRIPTION
      // ==================================================

      if (descripcion) {

        asegurarMetaName(
          'description'
        ).setAttribute(
          'content',
          descripcion
        );
      }


      // ==================================================
      // ROBOTS
      // ==================================================

      asegurarMetaName(
        'robots'
      ).setAttribute(
        'content',
        noIndex
          ? 'noindex, nofollow'
          : 'index, follow'
      );


      // ==================================================
      // CANONICAL
      // ==================================================

      let canonical =
        document.querySelector(
          'link[rel="canonical"]'
        );


      if (!canonical) {

        canonical =
          document.createElement(
            'link'
          );


        canonical.setAttribute(
          'rel',
          'canonical'
        );


        document.head.appendChild(
          canonical
        );
      }


      canonical.setAttribute(
        'href',
        urlCompleta
      );


      // ==================================================
      // OPEN GRAPH
      // ==================================================

      asegurarMetaProperty(
        'og:title'
      ).setAttribute(
        'content',
        titulo ||
          'Chapaco Sport'
      );


      asegurarMetaProperty(
        'og:description'
      ).setAttribute(
        'content',
        descripcion ||
          ''
      );


      asegurarMetaProperty(
        'og:type'
      ).setAttribute(
        'content',
        tipo
      );


      asegurarMetaProperty(
        'og:url'
      ).setAttribute(
        'content',
        urlCompleta
      );


      asegurarMetaProperty(
        'og:image'
      ).setAttribute(
        'content',
        imagen
      );


      asegurarMetaProperty(
        'og:image:secure_url'
      ).setAttribute(
        'content',
        imagen
      );


      asegurarMetaProperty(
        'og:image:type'
      ).setAttribute(
        'content',
        'image/jpeg'
      );


      asegurarMetaProperty(
        'og:image:alt'
      ).setAttribute(
        'content',
        imagenAlt
      );


      asegurarMetaProperty(
        'og:locale'
      ).setAttribute(
        'content',
        'es_BO'
      );


      asegurarMetaProperty(
        'og:site_name'
      ).setAttribute(
        'content',
        'Chapaco Sport'
      );


      // ==================================================
      // TWITTER / X
      // ==================================================

      asegurarMetaName(
        'twitter:card'
      ).setAttribute(
        'content',
        'summary_large_image'
      );


      asegurarMetaName(
        'twitter:title'
      ).setAttribute(
        'content',
        titulo ||
          'Chapaco Sport'
      );


      asegurarMetaName(
        'twitter:description'
      ).setAttribute(
        'content',
        descripcion ||
          ''
      );


      asegurarMetaName(
        'twitter:image'
      ).setAttribute(
        'content',
        imagen
      );


      asegurarMetaName(
        'twitter:image:alt'
      ).setAttribute(
        'content',
        imagenAlt
      );


      // ==================================================
      // SCHEMA.ORG — NEGOCIO
      // ==================================================

      actualizarJsonLd(
        'seo-schema-negocio',
        SCHEMA_NEGOCIO
      );


      // ==================================================
      // SCHEMA.ORG — PÁGINA / PRODUCTO
      // ==================================================

      actualizarJsonLd(
        'seo-schema-pagina',
        datosEstructurados
      );

    },

    [
      titulo,
      descripcion,
      ruta,
      imagen,
      tipo,
      imagenAlt,
      datosEstructurados,
      noIndex,
    ]
  );


  return null;
}


export default SEO;