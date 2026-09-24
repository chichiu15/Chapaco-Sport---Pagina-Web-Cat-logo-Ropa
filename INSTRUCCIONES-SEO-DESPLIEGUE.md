# Corrección de indexación de Chapaco Sport

Este paquete corrige:

- canonical inicial propio para `/catalogo`, `/marcas` y `/ofertas`;
- HTML estático rastreable para esas tres páginas;
- canonical y `robots` de páginas de productos;
- URLs de Firebase Hosting sin barra final mediante `trailingSlash: false`;
- coincidencia entre sitemap, canonical y URL pública;
- importaciones cuyo uso de mayúsculas/minúsculas impedía compilar en sistemas sensibles a mayúsculas.

## Despliegue

Abre una terminal dentro de la carpeta del proyecto y ejecuta, en este orden:

```bash
npm install
npm run build
firebase deploy --only hosting
```

El build debe mostrar estas líneas:

```text
SEO estático generado: /catalogo
SEO estático generado: /marcas
SEO estático generado: /ofertas
Sitemap generado con ... productos públicos.
```

Antes de desplegar, verifica que el número indicado en `Sitemap generado con ... productos públicos` coincida con los productos públicos que todavía están cargados en Firestore.

## Comprobación posterior

Abre estas direcciones en el navegador:

```text
https://chapacosport.com/catalogo
https://chapacosport.com/marcas
https://chapacosport.com/ofertas
https://chapacosport.com/sitemap.xml
```

Después inspecciona `/catalogo` y `/ofertas` en Search Console, usa **Probar URL publicada** y, cuando la prueba sea correcta, usa **Solicitar indexación**. Finalmente inicia **Validar corrección** en el informe de canonical alternativo.
