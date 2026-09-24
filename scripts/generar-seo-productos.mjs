import {
  mkdir,
  readFile,
  writeFile,
} from 'node:fs/promises';

import {
  resolve,
} from 'node:path';

import {
  deleteApp,
  initializeApp,
} from 'firebase/app';

import {
  collection,
  getDocs,
  getFirestore,
} from 'firebase/firestore';


// ======================================================
// CONFIGURACIÓN
// ======================================================

const URL_BASE =
  'https://chapacosport.com';


const IMAGEN_OG_POR_DEFECTO =
  'https://firebasestorage.googleapis.com/v0/b/chapacosport-1468a.firebasestorage.app/o/branding%2Fog-chapaco-sport.jpg?alt=media&token=ad9c1329-794d-4591-8312-fff7130ca077';


const firebaseConfig = {
  apiKey:
    process.env.VITE_FIREBASE_API_KEY,

  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.VITE_FIREBASE_APP_ID,

  measurementId:
    process.env.VITE_FIREBASE_MEASUREMENT_ID,
};


// ======================================================
// VALIDAR VARIABLES
// ======================================================

const variablesObligatorias = [
  'apiKey',
  'projectId',
  'appId',
];


for (
  const variable of variablesObligatorias
) {

  if (
    !firebaseConfig[
      variable
    ]
  ) {

    throw new Error(
      `Falta la configuración Firebase: ${variable}`
    );
  }
}


// ======================================================
// FIREBASE
// ======================================================

const app =
  initializeApp(
    firebaseConfig
  );


const db =
  getFirestore(
    app
  );


// ======================================================
// UTILIDADES
// ======================================================

const escaparHtml =
  (
    valor = ''
  ) => {

    return String(
      valor
    )
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      );
  };


const escaparXml =
  (
    valor = ''
  ) => {

    return String(
      valor
    )
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&apos;'
      );
  };


const escaparJsonLd =
  (
    datos
  ) => {

    return JSON.stringify(
      datos
    )
      .replace(
        /</g,
        '\\u003c'
      )
      .replace(
        />/g,
        '\\u003e'
      )
      .replace(
        /&/g,
        '\\u0026'
      );
  };


const obtenerUrlImagen =
  (
    imagen
  ) => {

    if (!imagen) {
      return '';
    }


    if (
      typeof imagen ===
      'string'
    ) {
      return imagen;
    }


    if (
      typeof imagen ===
      'object'
    ) {

      return (
        imagen.url ||
        imagen.URL ||
        imagen.src ||
        ''
      );
    }


    return '';
  };


// ======================================================
// DETERMINAR SI UN PRODUCTO DEBE INDEXARSE
// ======================================================

const esProductoIndexable =
  (
    producto
  ) => {

    const estado =
      producto.estado;


    if (
      estado === undefined ||
      estado === null ||
      estado === ''
    ) {
      return true;
    }


    if (
      typeof estado ===
      'boolean'
    ) {
      return estado;
    }


    if (
      typeof estado ===
      'number'
    ) {
      return estado !== 0;
    }


    const estadoNormalizado =
      String(
        estado
      )
        .trim()
        .toLowerCase();


    return ![
      'inactivo',
      'inactiva',
      'false',
      '0',
      'desactivado',
      'desactivada',
    ].includes(
      estadoNormalizado
    );
  };


// ======================================================
// REEMPLAZAR TITLE
// ======================================================

const reemplazarTitle =
  (
    html,
    titulo
  ) => {

    return html.replace(
      /<title>[\s\S]*?<\/title>/i,

      `<title>${escaparHtml(
        titulo
      )}</title>`
    );
  };


// ======================================================
// REEMPLAZAR META POR NAME
// ======================================================

const reemplazarMetaName =
  (
    html,
    nombre,
    contenido
  ) => {

    const regex =
      new RegExp(
        `<meta\\s+[^>]*name=["']${nombre}["'][^>]*>`,
        'i'
      );


    const nuevaMeta =
      `<meta name="${nombre}" content="${escaparHtml(
        contenido
      )}" />`;


    if (
      regex.test(
        html
      )
    ) {

      return html.replace(
        regex,
        nuevaMeta
      );
    }


    return html.replace(
      '</head>',
      `  ${nuevaMeta}\n</head>`
    );
  };


// ======================================================
// REEMPLAZAR META POR PROPERTY
// ======================================================

const reemplazarMetaProperty =
  (
    html,
    propiedad,
    contenido
  ) => {

    const regex =
      new RegExp(
        `<meta\\s+[^>]*property=["']${propiedad}["'][^>]*>`,
        'i'
      );


    const nuevaMeta =
      `<meta property="${propiedad}" content="${escaparHtml(
        contenido
      )}" />`;


    if (
      regex.test(
        html
      )
    ) {

      return html.replace(
        regex,
        nuevaMeta
      );
    }


    return html.replace(
      '</head>',
      `  ${nuevaMeta}\n</head>`
    );
  };


// ======================================================
// REEMPLAZAR CANONICAL
// ======================================================

const reemplazarCanonical =
  (
    html,
    url
  ) => {

    const regex =
      /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;


    const nuevoCanonical =
      `<link rel="canonical" href="${escaparHtml(
        url
      )}" />`;


    if (
      regex.test(
        html
      )
    ) {

      return html.replace(
        regex,
        nuevoCanonical
      );
    }


    return html.replace(
      '</head>',
      `  ${nuevoCanonical}\n</head>`
    );
  };


// ======================================================
// INSERTAR JSON-LD
// ======================================================

const insertarJsonLd =
  (
    html,
    id,
    datos
  ) => {

    const regex =
      new RegExp(
        `<script\\s+[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>`,
        'i'
      );


    const nuevoScript =
      `<script id="${id}" type="application/ld+json">${escaparJsonLd(
        datos
      )}</script>`;


    if (
      regex.test(
        html
      )
    ) {

      return html.replace(
        regex,
        nuevoScript
      );
    }


    return html.replace(
      '</head>',
      `  ${nuevoScript}\n</head>`
    );
  };


// ======================================================
// GENERAR SCHEMA.ORG PRODUCTO
// ======================================================

const crearSchemaProducto =
  (
    producto,
    url,
    imagenes
  ) => {

    const nombre =
      producto.nombre ||
      'Producto';


    const descripcion =
      producto.descripcion_corta ||
      `Descubre ${nombre} en Chapaco Sport. Consulta tallas, colores, precio y disponibilidad.`;


    const precioBase =
      Number(
        producto.precio
      ) ||
      0;


    const variantes =
      Object.values(
        producto?.subcolecciones?.variantes ||
        {}
      );


    const variantesDisponibles =
      variantes.filter(
        (
          variante
        ) =>
          variante.disponible ===
          true
      );


    const disponible =
      variantesDisponibles.length >
      0;


    const preciosOferta =
      variantesDisponibles
        .filter(
          (
            variante
          ) =>
            variante.en_oferta ===
              true &&
            Number.isFinite(
              Number(
                variante.precio_oferta
              )
            ) &&
            Number(
              variante.precio_oferta
            ) >
              0
        )
        .map(
          (
            variante
          ) =>
            Number(
              variante.precio_oferta
            )
        );


    const precio =
      preciosOferta.length >
        0
        ? Math.min(
            ...preciosOferta
          )
        : precioBase;


    const sku =
      variantesDisponibles.find(
        (
          variante
        ) =>
          variante.cod_producto
      )?.cod_producto ||
      producto.id ||
      '';


    const nombreMarca =
      producto.nombreMarca ||
      producto.marca ||
      producto.marca_id ||
      'Chapaco Sport';


    return {
      '@context':
        'https://schema.org',

      '@type':
        'Product',

      '@id':
        `${url}#producto`,

      name:
        nombre,

      description:
        descripcion,

      url,

      image:
        imagenes.length >
          0
          ? imagenes
          : [
              IMAGEN_OG_POR_DEFECTO
            ],

      sku,

      brand: {
        '@type':
          'Brand',

        name:
          nombreMarca,
      },

      offers: {
        '@type':
          'Offer',

        url,

        priceCurrency:
          'BOB',

        price:
          Number(
            precio
          ).toFixed(
            2
          ),

        availability:
          disponible
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',

        itemCondition:
          'https://schema.org/NewCondition',
      },
    };
  };


// ======================================================
// SCHEMA.ORG NEGOCIO
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
// PÁGINAS PÚBLICAS ESTÁTICAS
//
// Estas páginas necesitan entregar su canonical correcto
// en el HTML inicial. No debemos depender de que Google
// ejecute React para reemplazar el canonical de Inicio.
// ======================================================

const PAGINAS_PUBLICAS = [
  {
    ruta:
      '/catalogo',

    titulo:
      'Catálogo de ropa deportiva para hombre | Chapaco Sport',

    descripcion:
      'Explora el catálogo de ropa deportiva para hombre de Chapaco Sport. Encuentra prendas para entrenamiento, gimnasio y uso diario con envíos en Bolivia.',

    nombre:
      'Catálogo Chapaco Sport',
  },

  {
    ruta:
      '/marcas',

    titulo:
      'Marcas de ropa deportiva para hombre | Chapaco Sport',

    descripcion:
      'Conoce las marcas de ropa deportiva para hombre disponibles en Chapaco Sport y encuentra prendas para entrenamiento, gimnasio y uso diario.',

    nombre:
      'Marcas de Chapaco Sport',
  },

  {
    ruta:
      '/ofertas',

    titulo:
      'Ofertas en ropa deportiva para hombre | Chapaco Sport',

    descripcion:
      'Descubre ofertas en ropa deportiva para hombre en Chapaco Sport. Encuentra productos seleccionados, descuentos y precios especiales por tiempo limitado.',

    nombre:
      'Ofertas de Chapaco Sport',
  },
  {
    ruta:
      '/promociones',

    titulo:
      'Packs y promociones | Chapaco Sport',

    descripcion:
      'Descubre packs de ropa deportiva para hombre y obtén descuentos automáticos al completar las condiciones en tu carrito.',

    nombre:
      'Packs y promociones Chapaco Sport',
  },
];


const generarHtmlPaginaPublica =
  (
    htmlBase,
    pagina
  ) => {

    const url =
      `${URL_BASE}${pagina.ruta}`;


    const schemaPagina = {
      '@context':
        'https://schema.org',

      '@type':
        'CollectionPage',

      '@id':
        `${url}#pagina`,

      name:
        pagina.nombre,

      url,

      description:
        pagina.descripcion,

      isPartOf: {
        '@type':
          'WebSite',

        '@id':
          `${URL_BASE}/#sitio-web`,

        name:
          'Chapaco Sport',

        url:
          `${URL_BASE}/`,
      },
    };


    let html =
      htmlBase;


    html =
      reemplazarTitle(
        html,
        pagina.titulo
      );


    html =
      reemplazarMetaName(
        html,
        'description',
        pagina.descripcion
      );


    html =
      reemplazarMetaName(
        html,
        'robots',
        'index, follow'
      );


    html =
      reemplazarCanonical(
        html,
        url
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:title',
        pagina.titulo
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:description',
        pagina.descripcion
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:type',
        'website'
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:url',
        url
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image',
        IMAGEN_OG_POR_DEFECTO
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image:secure_url',
        IMAGEN_OG_POR_DEFECTO
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image:alt',
        'Chapaco Sport — Viste tu pasión'
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:title',
        pagina.titulo
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:description',
        pagina.descripcion
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:image',
        IMAGEN_OG_POR_DEFECTO
      );


    html =
      insertarJsonLd(
        html,
        'seo-schema-negocio',
        SCHEMA_NEGOCIO
      );


    html =
      insertarJsonLd(
        html,
        'seo-schema-pagina',
        schemaPagina
      );


    return html;
  };


// ======================================================
// GENERAR HTML DE PRODUCTO
// ======================================================

const generarHtmlProducto =
  (
    htmlBase,
    producto
  ) => {

    const id =
      producto.id;


    const nombre =
      producto.nombre ||
      'Producto';


    const descripcion =
      producto.descripcion_corta ||
      `Descubre ${nombre} en Chapaco Sport. Consulta tallas, colores, precio y disponibilidad.`;


    const imagenes =
      Array.isArray(
        producto.imagenes
      )
        ? producto.imagenes
            .map(
              obtenerUrlImagen
            )
            .filter(
              Boolean
            )
        : [];


    const imagen =
      imagenes[0] ||
      IMAGEN_OG_POR_DEFECTO;


    const url =
      `${URL_BASE}/producto/${encodeURIComponent(
        id
      )}`;


    const titulo =
      `${nombre} | Chapaco Sport`;


    const imagenAlt =
      `${nombre} - Chapaco Sport`;


    const schemaProducto =
      crearSchemaProducto(
        producto,
        url,
        imagenes
      );


    let html =
      htmlBase;


    html =
      reemplazarTitle(
        html,
        titulo
      );


    html =
      reemplazarMetaName(
        html,
        'description',
        descripcion
      );


    html =
      reemplazarMetaName(
        html,
        'robots',
        'index, follow'
      );


    html =
      reemplazarCanonical(
        html,
        url
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:title',
        titulo
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:description',
        descripcion
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:type',
        'product'
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:url',
        url
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image',
        imagen
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image:secure_url',
        imagen
      );


    html =
      reemplazarMetaProperty(
        html,
        'og:image:alt',
        imagenAlt
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:title',
        titulo
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:description',
        descripcion
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:image',
        imagen
      );


    html =
      reemplazarMetaName(
        html,
        'twitter:image:alt',
        imagenAlt
      );


    html =
      insertarJsonLd(
        html,
        'seo-schema-negocio',
        SCHEMA_NEGOCIO
      );


    html =
      insertarJsonLd(
        html,
        'seo-schema-pagina',
        schemaProducto
      );


    return html;
  };


// ======================================================
// GENERAR SITEMAP.XML
// ======================================================

const generarSitemap =
  (
    productos
  ) => {

    const paginasPublicas = [
      {
        url:
          `${URL_BASE}/`,

        changefreq:
          'weekly',

        priority:
          '1.0',
      },

      {
        url:
          `${URL_BASE}/catalogo`,

        changefreq:
          'daily',

        priority:
          '0.9',
      },

      {
        url:
          `${URL_BASE}/marcas`,

        changefreq:
          'weekly',

        priority:
          '0.8',
      },

      {
        url:
          `${URL_BASE}/ofertas`,

        changefreq:
          'daily',

        priority:
          '0.9',
      },
      {
        url:
          `${URL_BASE}/promociones`,

        changefreq:
          'daily',

        priority:
          '0.9',
      },
    ];


    const productosIndexables =
      productos.filter(
        esProductoIndexable
      );


    const urlsProductos =
      productosIndexables.map(
        (
          producto
        ) => ({
          url:
            `${URL_BASE}/producto/${encodeURIComponent(
              producto.id
            )}`,

          changefreq:
            'weekly',

          priority:
            '0.8',
        })
      );


    const urls = [
      ...paginasPublicas,
      ...urlsProductos,
    ];


    const contenidoUrls =
      urls
        .map(
          (
            entrada
          ) => {

            return `  <url>
    <loc>${escaparXml(
      entrada.url
    )}</loc>
    <changefreq>${entrada.changefreq}</changefreq>
    <priority>${entrada.priority}</priority>
  </url>`;
          }
        )
        .join(
          '\n\n'
        );


    return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${contenidoUrls}

</urlset>
`;
  };


// ======================================================
// EJECUCIÓN
// ======================================================

async function main() {

  console.log(
    '\nGenerando páginas SEO de productos...\n'
  );


  const rutaDist =
    resolve(
      'dist'
    );


  const rutaIndex =
    resolve(
      rutaDist,
      'index.html'
    );


  const htmlBase =
    await readFile(
      rutaIndex,
      'utf8'
    );


  // ======================================================
  // CREAR HTML INICIAL CON SEO PARA PÁGINAS PÚBLICAS
  // ======================================================

  for (
    const pagina of PAGINAS_PUBLICAS
  ) {

    const carpetaPagina =
      resolve(
        rutaDist,
        pagina.ruta.replace(
          /^\/+|\/+$/g,
          ''
        )
      );


    await mkdir(
      carpetaPagina,
      {
        recursive:
          true,
      }
    );


    await writeFile(
      resolve(
        carpetaPagina,
        'index.html'
      ),
      generarHtmlPaginaPublica(
        htmlBase,
        pagina
      ),
      'utf8'
    );


    console.log(
      `SEO estático generado: ${pagina.ruta}`
    );
  }


  const snapshot =
    await getDocs(
      collection(
        db,
        'productos'
      )
    );


  const productos =
    snapshot.docs.map(
      (
        documento
      ) => ({
        id:
          documento.id,

        ...documento.data(),
      })
    );


  let cantidadGenerada =
    0;


  for (
    const producto of productos
  ) {

    if (
      !esProductoIndexable(
        producto
      )
    ) {

      console.log(
        `Producto omitido del SEO público: ${producto.id}`
      );

      continue;
    }


    const carpetaProducto =
      resolve(
        rutaDist,
        'producto',
        producto.id
      );


    await mkdir(
      carpetaProducto,
      {
        recursive:
          true,
      }
    );


    const htmlProducto =
      generarHtmlProducto(
        htmlBase,
        producto
      );


    await writeFile(
      resolve(
        carpetaProducto,
        'index.html'
      ),
      htmlProducto,
      'utf8'
    );


    cantidadGenerada +=
      1;


    console.log(
      `SEO + Schema generado: /producto/${producto.id}`
    );
  }


  // ======================================================
  // CREAR SITEMAP
  // ======================================================

  const sitemap =
    generarSitemap(
      productos
    );


  await writeFile(
    resolve(
      rutaDist,
      'sitemap.xml'
    ),
    sitemap,
    'utf8'
  );


  const cantidadProductosSitemap =
    productos.filter(
      esProductoIndexable
    ).length;


  console.log(
    `\nSitemap generado con ${cantidadProductosSitemap} productos públicos.`
  );


  console.log(
    `Total de URLs del sitemap: ${cantidadProductosSitemap + 5}.`
  );


  console.log(
    `\nListo. ${cantidadGenerada} páginas de producto generadas con SEO y Schema.org.\n`
  );
}


main()
  .catch(
    (
      error
    ) => {

      console.error(
        '\nError generando SEO, Schema.org o sitemap:'
      );


      console.error(
        error
      );


      process.exitCode =
        1;
    }
  )
  .finally(
    async () => {

      await deleteApp(
        app
      );
    }
  );
