import {
  defineConfig,
} from 'vite';

import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [
    react(),
  ],


  // =====================================================
  // BUILD DE PRODUCCIÓN
  // =====================================================

  build: {
    /*
      Navegadores modernos.
      Evitamos generar compatibilidad vieja innecesaria.
    */
    target: 'es2020',


    /*
      Source maps apagados en producción.

      Menos archivos y menos peso desplegado.
    */
    sourcemap: false,


    /*
      Compresión/minificación nativa de Vite/esbuild.
    */
    minify: 'oxc',


    /*
      CSS separado y optimizado.
    */
    cssCodeSplit: true,


    /*
      Assets pequeños pueden incrustarse.
      Evitamos convertir imágenes medianas/grandes en base64.
    */
    assetsInlineLimit: 4096,


    /*
      Advertencia más realista.

      Firebase puede formar chunks relativamente grandes,
      por eso no quiero ocultar warnings de 1 MB.
    */
    chunkSizeWarningLimit: 600,


    rollupOptions: {
      output: {

        // =================================================
        // CHUNKS MANUALES
        // =================================================

        manualChunks(id) {

          /*
            FIREBASE

            Firebase es pesado y cambia mucho menos
            que nuestro código de aplicación.

            Se cacheará de forma independiente.
          */
          if (
            id.includes(
              'node_modules/firebase'
            )
          ) {
            return 'firebase';
          }


          /*
            REACT + ROUTER
          */
          if (
            id.includes(
              'node_modules/react/'
            ) ||
            id.includes(
              'node_modules/react-dom/'
            ) ||
            id.includes(
              'node_modules/react-router'
            )
          ) {
            return 'react-vendor';
          }


          /*
            SWEETALERT

            Principalmente utilizado en Admin.
            No queremos mezclarlo con React.
          */
          if (
            id.includes(
              'node_modules/sweetalert2'
            )
          ) {
            return 'sweetalert';
          }


          /*
            ICONOS
          */
          if (
            id.includes(
              'node_modules/lucide-react'
            ) ||
            id.includes(
              'node_modules/react-icons'
            )
          ) {
            return 'icons';
          }


          return undefined;
        },
      },
    },
  },


  // =====================================================
  // OPTIMIZACIÓN DEV
  // =====================================================

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'lucide-react',
    ],
  },
});