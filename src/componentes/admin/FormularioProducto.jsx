import Swal from 'sweetalert2';

import {
  ArrowLeft,
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Image as ImageIcon,
  PackagePlus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  actualizarProducto,
  crearProducto,
  crearProductoConImagenes,
  obtenerProductoPorId,
} from '../../servicios/admin/productosServicio';

import {
  eliminarArchivoPorUrl,
  eliminarImagenesStorage,
  subirImagenesProducto,
} from '../../servicios/admin/storageServicio';

import {
  suscribirCategorias,
} from '../../servicios/admin/categoriasServicio';

import {
  suscribirMarcas,
} from '../../servicios/admin/marcasServicio';

import TablaVariantesProducto from './TablaVariantesProducto';

import '../../estilos/adminestilos.css';
import './FormularioProducto.css';

import { ordenarVariantes } from '../../utilidades/tallas';


const crearFormularioInicial = () => ({
  nombre: '',
  descripcion_corta: '',
  marca_id: '',
  categoria_id: '',
  precio: '',
  estado: 'activo',
  es_nuevo: false,
  imagenes: [],
});


const normalizarTexto = (
  texto = ''
) =>
  String(texto)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .trim()
    .toLowerCase();


const generarIdImagen = () =>
  `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;


const obtenerResumenOferta = (
  variantes
) => {
  const ofertas =
    variantes.filter(
      (variante) =>
        variante.en_oferta ===
        true
    );

  if (
    ofertas.length === 0
  ) {
    return {
      activa:
        false,

      precioComun:
        '',
    };
  }

  const precios = [
    ...new Set(
      ofertas
        .map(
          (variante) =>
            Number(
              variante.precio_oferta
            )
        )
        .filter(
          (precio) =>
            Number.isFinite(
              precio
            )
        )
    ),
  ];

  return {
    activa:
      true,

    precioComun:
      precios.length === 1
        ? String(
            precios[0]
          )
        : '',
  };
};


function FormularioProducto() {
  const navegar =
    useNavigate();

  const {
    idProducto,
  } =
    useParams();

  const modoEdicion =
    Boolean(
      idProducto
    );

  const inputImagenesRef =
    useRef(null);

  const urlsTemporalesRef =
    useRef(
      new Set()
    );


  const [
    formulario,
    setFormulario,
  ] =
    useState(
      crearFormularioInicial
    );

  const [
    variantes,
    setVariantes,
  ] =
    useState([]);

  const [
    categorias,
    setCategorias,
  ] =
    useState([]);

  const [
    marcas,
    setMarcas,
  ] =
    useState([]);

  const [
    cargando,
    setCargando,
  ] =
    useState(
      modoEdicion
    );

  const [
    guardando,
    setGuardando,
  ] =
    useState(false);

  const [
    errores,
    setErrores,
  ] =
    useState([]);

  const [
    errorCarga,
    setErrorCarga,
  ] =
    useState('');

  const [
    formularioModificado,
    setFormularioModificado,
  ] =
    useState(false);


  const [
    ofertaGeneralActiva,
    setOfertaGeneralActiva,
  ] =
    useState(false);

  const [
    precioOfertaGeneral,
    setPrecioOfertaGeneral,
  ] =
    useState('');

  const [
    mensajeOferta,
    setMensajeOferta,
  ] =
    useState('');


  // =====================================================
  // IMÁGENES
  // =====================================================

  const [
    imagenesTrabajo,
    setImagenesTrabajo,
  ] =
    useState([]);

  const [
    imagenesEliminadas,
    setImagenesEliminadas,
  ] =
    useState([]);

  const [
    arrastrandoArchivos,
    setArrastrandoArchivos,
  ] =
    useState(false);

  const [
    indiceImagenArrastrada,
    setIndiceImagenArrastrada,
  ] =
    useState(null);

  const [
    arrastreTactil,
    setArrastreTactil,
  ] =
    useState({
      activo:
        false,

      pointerId:
        null,

      indiceOrigen:
        null,

      indiceActual:
        null,
    });

  const [
    mensajeImagenes,
    setMensajeImagenes,
  ] =
    useState('');


  // =====================================================
  // LIMPIAR PREVIEWS
  // =====================================================

  useEffect(() => {
    const urlsTemporales =
      urlsTemporalesRef.current;

    return () => {
      urlsTemporales.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );

      urlsTemporales.clear();
    };
  }, []);


  // =====================================================
  // CARGAR CATÁLOGOS + PRODUCTO
  // =====================================================

  useEffect(() => {
    let componenteActivo =
      true;


    const unsubscribeCategorias =
      suscribirCategorias(
        (datos) => {
          if (
            componenteActivo
          ) {
            setCategorias(
              datos
            );
          }
        }
      );


    const unsubscribeMarcas =
      suscribirMarcas(
        (datos) => {
          if (
            componenteActivo
          ) {
            setMarcas(
              datos
            );
          }
        }
      );


    const cargarProducto =
      async () => {
        if (
          !modoEdicion
        ) {
          setCargando(
            false
          );

          return;
        }


        try {
          setCargando(
            true
          );

          const producto =
            await obtenerProductoPorId(
              idProducto
            );


          if (
            !producto
          ) {
            if (
              componenteActivo
            ) {
              setErrorCarga(
                'El producto solicitado no existe.'
              );
            }

            return;
          }


          const listaVariantes =
            Object.entries(
              producto
                .subcolecciones
                ?.variantes ||
                {}
            ).map(
              ([
                id,
                variante,
              ]) => ({
                /*
                  Conservamos exactamente
                  el ID existente.
                */
                id,

                talla:
                  variante.talla ||
                  'M',

                color_estampado:
                  variante.color_estampado ||
                  '',

                cod_producto:
                  variante.cod_producto ||
                  '',

                /*
                  Un SKU que ya existe en
                  Firestore se respeta como
                  código Kraken/manual.
                */
                sku_manual:
                  true,

                disponible:
                  variante.disponible ===
                  true,

                en_oferta:
                  variante.en_oferta ===
                  true,

                precio_oferta:
                  variante.precio_oferta ??
                  '',

                nombre_variante:
                  variante.nombre_variante ||
                  '',
              })
            );


          if (
            !componenteActivo
          ) {
            return;
          }


          const imagenesActuales =
            Array.isArray(
              producto.imagenes
            )
              ? producto.imagenes
              : [];


          setFormulario({
            nombre:
              producto.nombre ||
              '',

            descripcion_corta:
              producto.descripcion_corta ||
              '',

            marca_id:
              producto.marca_id ||
              '',

            categoria_id:
              producto.categoria_id ||
              '',

            precio:
              producto.precio ??
              '',

            estado:
              producto.estado ||
              'activo',

            es_nuevo:
              producto.es_nuevo ===
              true,

            imagenes:
              imagenesActuales,
          });


          setImagenesTrabajo(
            imagenesActuales.map(
              (
                url,
                indice
              ) => ({
                id:
                  `existente-${indice}-${url}`,

                tipo:
                  'existente',

                url,

                archivo:
                  null,
              })
            )
          );


          setImagenesEliminadas(
            []
          );


          setVariantes(
            ordenarVariantes(listaVariantes)
          );


          const resumen =
            obtenerResumenOferta(
              listaVariantes
            );


          setOfertaGeneralActiva(
            resumen.activa
          );

          setPrecioOfertaGeneral(
            resumen.precioComun
          );


          setFormularioModificado(
            false
          );
        } catch (
          error
        ) {
          console.error(
            'Error cargando producto:',
            error
          );

          if (
            componenteActivo
          ) {
            setErrorCarga(
              'No se pudo cargar el producto.'
            );
          }
        } finally {
          if (
            componenteActivo
          ) {
            setCargando(
              false
            );
          }
        }
      };


    cargarProducto();


    return () => {
      componenteActivo =
        false;

      unsubscribeCategorias();
      unsubscribeMarcas();
    };
  }, [
    idProducto,
    modoEdicion,
  ]);


  // =====================================================
  // ADVERTENCIA DE CIERRE DE PESTAÑA
  // =====================================================

  useEffect(() => {
    const prevenirSalida =
      (evento) => {
        if (
          !formularioModificado
        ) {
          return;
        }

        evento.preventDefault();

        evento.returnValue =
          '';
      };


    window.addEventListener(
      'beforeunload',
      prevenirSalida
    );


    return () => {
      window.removeEventListener(
        'beforeunload',
        prevenirSalida
      );
    };
  }, [
    formularioModificado,
  ]);


  // =====================================================
  // FORMULARIO GENERAL
  // =====================================================

  const manejarCambio =
    (evento) => {
      const {
        name,
        value,
      } =
        evento.target;


      setFormulario(
        (actual) => ({
          ...actual,

          [name]:
            value,
        })
      );


      setFormularioModificado(
        true
      );
    };


  const manejarEstado =
    (activo) => {
      setFormulario(
        (actual) => ({
          ...actual,

          estado:
            activo
              ? 'activo'
              : 'inactivo',
        })
      );

      setFormularioModificado(
        true
      );
    };


  const manejarNuevoDrop =
    (activo) => {
      setFormulario(
        (actual) => ({
          ...actual,

          es_nuevo:
            activo,
        })
      );

      setFormularioModificado(
        true
      );
    };


  // =====================================================
  // VARIANTES
  // =====================================================

  const manejarVariantes =
    (
      nuevasVariantes
    ) => {
      setVariantes(
        nuevasVariantes
      );


      const resumen =
        obtenerResumenOferta(
          nuevasVariantes
        );


      setOfertaGeneralActiva(
        resumen.activa
      );

      setPrecioOfertaGeneral(
        resumen.precioComun
      );


      setFormularioModificado(
        true
      );

      setMensajeOferta(
        ''
      );
    };


  // =====================================================
  // AGREGAR IMÁGENES
  // =====================================================

  const agregarImagenes =
    (
      archivosRecibidos
    ) => {
      const archivos =
        Array.from(
          archivosRecibidos ||
          []
        );


      if (
        archivos.length ===
        0
      ) {
        return;
      }


      const imagenesValidas =
        archivos.filter(
          (archivo) =>
            archivo.type
              ?.startsWith(
                'image/'
              )
        );


      const archivosInvalidos =
        archivos.length -
        imagenesValidas.length;


      if (
        imagenesValidas.length ===
        0
      ) {
        setMensajeImagenes(
          'Los archivos seleccionados no son imágenes válidas.'
        );

        return;
      }


      const nuevasImagenes =
        imagenesValidas.map(
          (archivo) => {
            const urlTemporal =
              URL.createObjectURL(
                archivo
              );


            urlsTemporalesRef.current.add(
              urlTemporal
            );


            return {
              id:
                generarIdImagen(),

              tipo:
                'nueva',

              archivo,

              url:
                urlTemporal,
            };
          }
        );


      setImagenesTrabajo(
        (actuales) => [
          ...actuales,
          ...nuevasImagenes,
        ]
      );


      setFormularioModificado(
        true
      );


      if (
        archivosInvalidos >
        0
      ) {
        setMensajeImagenes(
          `${archivosInvalidos} archivo(s) fueron ignorados porque no son imágenes.`
        );
      } else {
        setMensajeImagenes(
          ''
        );
      }
    };


  const manejarSeleccionImagenes =
    (evento) => {
      agregarImagenes(
        evento.target.files
      );

      evento.target.value =
        '';
    };


  // =====================================================
  // DRAG & DROP ARCHIVOS
  // =====================================================

  const manejarDragEnterArchivos =
    (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      setArrastrandoArchivos(
        true
      );
    };


  const manejarDragOverArchivos =
    (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      if (
        evento.dataTransfer
          ?.types
          ?.includes(
            'Files'
          )
      ) {
        evento.dataTransfer.dropEffect =
          'copy';
      }
    };


  const manejarDragLeaveArchivos =
    (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      setArrastrandoArchivos(
        false
      );
    };


  const manejarDropArchivos =
    (evento) => {
      evento.preventDefault();
      evento.stopPropagation();

      setArrastrandoArchivos(
        false
      );


      if (
        evento.dataTransfer
          .files
          ?.length >
        0
      ) {
        agregarImagenes(
          evento.dataTransfer.files
        );
      }
    };


  // =====================================================
  // ELIMINAR IMAGEN
  // =====================================================

  const eliminarImagen =
    (idImagen) => {
      setImagenesTrabajo(
        (actuales) => {
          const imagen =
            actuales.find(
              (item) =>
                item.id ===
                idImagen
            );


          if (
            !imagen
          ) {
            return actuales;
          }


          /*
            Nueva:
            solo eliminamos preview.
          */
          if (
            imagen.tipo ===
              'nueva' &&
            imagen.url
          ) {
            URL.revokeObjectURL(
              imagen.url
            );

            urlsTemporalesRef.current.delete(
              imagen.url
            );
          }


          /*
            Existente:
            todavía NO borramos Storage.
            Esperamos que Firestore se
            actualice correctamente.
          */
          if (
            imagen.tipo ===
              'existente' &&
            imagen.url
          ) {
            setImagenesEliminadas(
              (anteriores) =>
                anteriores.includes(
                  imagen.url
                )
                  ? anteriores
                  : [
                      ...anteriores,
                      imagen.url,
                    ]
            );
          }


          return actuales.filter(
            (item) =>
              item.id !==
              idImagen
          );
        }
      );


      setFormularioModificado(
        true
      );

      setMensajeImagenes(
        ''
      );
    };


  // =====================================================
  // DRAG & DROP ORDEN
  // =====================================================

  const manejarInicioArrastreImagen =
    (
      evento,
      indice
    ) => {
      setIndiceImagenArrastrada(
        indice
      );

      evento.dataTransfer.effectAllowed =
        'move';

      evento.dataTransfer.setData(
        'text/plain',
        String(
          indice
        )
      );
    };


  const manejarArrastreSobreImagen =
    (evento) => {
      evento.preventDefault();

      evento.dataTransfer.dropEffect =
        'move';
    };


  const manejarSoltarImagen =
    (
      evento,
      indiceDestino
    ) => {
      evento.preventDefault();
      evento.stopPropagation();


      const indiceOrigen =
        indiceImagenArrastrada;


      if (
        indiceOrigen ===
          null ||
        indiceOrigen ===
          indiceDestino
      ) {
        setIndiceImagenArrastrada(
          null
        );

        return;
      }


      setImagenesTrabajo(
        (actuales) => {
          const copia = [
            ...actuales,
          ];

          const [
            imagenMovida,
          ] =
            copia.splice(
              indiceOrigen,
              1
            );

          copia.splice(
            indiceDestino,
            0,
            imagenMovida
          );

          return copia;
        }
      );


      setIndiceImagenArrastrada(
        null
      );

      setFormularioModificado(
        true
      );
    };


  const manejarFinArrastreImagen =
    () => {
      setIndiceImagenArrastrada(
        null
      );
    };


  // =====================================================
  // ORDEN FLECHAS
  // =====================================================

  const moverImagen =
    (
      indiceOrigen,
      direccion
    ) => {
      const indiceDestino =
        indiceOrigen +
        direccion;


      if (
        indiceDestino <
          0 ||
        indiceDestino >=
          imagenesTrabajo.length
      ) {
        return;
      }


      setImagenesTrabajo(
        (actuales) => {
          const copia = [
            ...actuales,
          ];

          const [
            imagenMovida,
          ] =
            copia.splice(
              indiceOrigen,
              1
            );

          copia.splice(
            indiceDestino,
            0,
            imagenMovida
          );

          return copia;
        }
      );


      setFormularioModificado(
        true
      );
    };


  // =====================================================
  // TOUCH / POINTER
  // =====================================================

  const manejarPointerDownImagen =
    (
      evento,
      indice
    ) => {
      if (
        evento.pointerType ===
        'mouse'
      ) {
        return;
      }


      evento.currentTarget.setPointerCapture(
        evento.pointerId
      );


      setArrastreTactil({
        activo:
          true,

        pointerId:
          evento.pointerId,

        indiceOrigen:
          indice,

        indiceActual:
          indice,
      });


      setIndiceImagenArrastrada(
        indice
      );
    };


  const manejarPointerMoveImagen =
    (evento) => {
      if (
        !arrastreTactil.activo ||
        arrastreTactil.pointerId !==
          evento.pointerId
      ) {
        return;
      }


      evento.preventDefault();


      const elemento =
        document.elementFromPoint(
          evento.clientX,
          evento.clientY
        );


      const tarjeta =
        elemento?.closest(
          '[data-indice-imagen]'
        );


      if (
        !tarjeta
      ) {
        return;
      }


      const indiceDestino =
        Number(
          tarjeta.getAttribute(
            'data-indice-imagen'
          )
        );


      if (
        !Number.isInteger(
          indiceDestino
        ) ||
        indiceDestino ===
          arrastreTactil.indiceActual
      ) {
        return;
      }


      setImagenesTrabajo(
        (actuales) => {
          const copia = [
            ...actuales,
          ];

          const [
            imagenMovida,
          ] =
            copia.splice(
              arrastreTactil.indiceActual,
              1
            );

          copia.splice(
            indiceDestino,
            0,
            imagenMovida
          );

          return copia;
        }
      );


      setArrastreTactil(
        (actual) => ({
          ...actual,

          indiceActual:
            indiceDestino,
        })
      );


      setIndiceImagenArrastrada(
        indiceDestino
      );

      setFormularioModificado(
        true
      );
    };


  const finalizarArrastreTactil =
    (evento) => {
      if (
        arrastreTactil.pointerId !==
        evento.pointerId
      ) {
        return;
      }


      try {
        evento.currentTarget.releasePointerCapture(
          evento.pointerId
        );
      } catch {
        // El navegador pudo liberarlo.
      }


      setArrastreTactil({
        activo:
          false,

        pointerId:
          null,

        indiceOrigen:
          null,

        indiceActual:
          null,
      });


      setIndiceImagenArrastrada(
        null
      );
    };


  // =====================================================
  // OFERTA GENERAL
  // =====================================================

  const manejarSwitchOfertaGeneral =
    (activo) => {
      setOfertaGeneralActiva(
        activo
      );

      setMensajeOferta(
        ''
      );


      if (
        !activo
      ) {
        const nuevas =
          variantes.map(
            (variante) => ({
              ...variante,

              en_oferta:
                false,

              precio_oferta:
                '',
            })
          );


        setVariantes(
          nuevas
        );

        setPrecioOfertaGeneral(
          ''
        );

        setFormularioModificado(
          true
        );

        return;
      }


      if (
        variantes.length ===
        0
      ) {
        setMensajeOferta(
          'Primero agrega al menos una variante.'
        );

        setOfertaGeneralActiva(
          false
        );

        return;
      }


      const nuevas =
        variantes.map(
          (variante) =>
            variante.disponible
              ? {
                  ...variante,

                  en_oferta:
                    true,
                }
              : variante
        );


      setVariantes(
        nuevas
      );

      setFormularioModificado(
        true
      );
    };


  const aplicarPrecioOfertaGeneral =
    () => {
      const precioBase =
        Number(
          formulario.precio
        );

      const precioOferta =
        Number(
          precioOfertaGeneral
        );


      if (
        !Number.isFinite(
          precioBase
        ) ||
        precioBase <=
          0
      ) {
        setMensajeOferta(
          'Primero define un precio de venta válido.'
        );

        return;
      }


      if (
        !Number.isFinite(
          precioOferta
        ) ||
        precioOferta <=
          0
      ) {
        setMensajeOferta(
          'Ingresa un precio de oferta válido.'
        );

        return;
      }


      if (
        precioOferta >=
        precioBase
      ) {
        setMensajeOferta(
          'El precio de oferta debe ser menor al precio de venta.'
        );

        return;
      }


      if (
        variantes.length ===
        0
      ) {
        setMensajeOferta(
          'No existen variantes donde aplicar la oferta.'
        );

        return;
      }


      const nuevas =
        variantes.map(
          (variante) =>
            variante.disponible
              ? {
                  ...variante,

                  en_oferta:
                    true,

                  precio_oferta:
                    String(
                      precioOferta
                    ),
                }
              : variante
        );


      setVariantes(
        nuevas
      );

      setOfertaGeneralActiva(
        true
      );

      setMensajeOferta(
        'Oferta aplicada a todas las variantes disponibles.'
      );

      setFormularioModificado(
        true
      );
    };


  // =====================================================
  // VALIDACIÓN
  // =====================================================

  const validarFormulario =
    () => {
      const nuevosErrores =
        [];


      if (
        !formulario.nombre.trim()
      ) {
        nuevosErrores.push(
          'El nombre del producto es obligatorio.'
        );
      }


      if (
        !formulario.descripcion_corta.trim()
      ) {
        nuevosErrores.push(
          'La descripción corta es obligatoria.'
        );
      }


      if (
        !formulario.marca_id
      ) {
        nuevosErrores.push(
          'Selecciona una marca.'
        );
      }


      if (
        !formulario.categoria_id
      ) {
        nuevosErrores.push(
          'Selecciona una categoría.'
        );
      }


      const precioBase =
        Number(
          formulario.precio
        );


      if (
        !Number.isFinite(
          precioBase
        ) ||
        precioBase <=
          0
      ) {
        nuevosErrores.push(
          'El precio de venta debe ser mayor a 0.'
        );
      }


      if (
        variantes.length ===
        0
      ) {
        nuevosErrores.push(
          'El producto debe tener al menos una variante.'
        );
      }


      const combinaciones =
        new Set();

      const skus =
        new Set();


      variantes.forEach(
        (
          variante,
          indice
        ) => {
          const numero =
            indice +
            1;


          if (
            !variante.color_estampado
              ?.trim()
          ) {
            nuevosErrores.push(
              `Variante ${numero}: falta el color o estampado.`
            );
          }


          if (
            !variante.cod_producto
              ?.trim()
          ) {
            nuevosErrores.push(
              `Variante ${numero}: falta el SKU / código de producto.`
            );
          }


          const claveCombinacion =
            `${variante.talla}__${normalizarTexto(
              variante.color_estampado
            )}`;


          if (
            combinaciones.has(
              claveCombinacion
            )
          ) {
            nuevosErrores.push(
              `La combinación ${variante.talla} / ${variante.color_estampado} está repetida.`
            );
          }


          combinaciones.add(
            claveCombinacion
          );


          const sku =
            normalizarTexto(
              variante.cod_producto
            );


          if (
            sku
          ) {
            if (
              skus.has(
                sku
              )
            ) {
              nuevosErrores.push(
                `El SKU "${variante.cod_producto}" está repetido dentro del producto.`
              );
            }

            skus.add(
              sku
            );
          }


          if (
            variante.en_oferta
          ) {
            const precioOferta =
              Number(
                variante.precio_oferta
              );


            if (
              !Number.isFinite(
                precioOferta
              ) ||
              precioOferta <=
                0
            ) {
              nuevosErrores.push(
                `Variante ${numero}: falta un precio de oferta válido.`
              );
            } else if (
              precioOferta >=
              precioBase
            ) {
              nuevosErrores.push(
                `Variante ${numero}: el precio de oferta debe ser menor al precio de venta.`
              );
            }
          }
        }
      );


      setErrores(
        nuevosErrores
      );


      return (
        nuevosErrores.length ===
        0
      );
    };


  // =====================================================
  // MAPA REAL FIRESTORE
  // =====================================================

  const convertirVariantesAMapa =
    () => {
      return ordenarVariantes(variantes).reduce(
        (
          mapa,
          variante
        ) => {
          const color =
            variante.color_estampado
              .trim();


          const datos = {
            cod_producto:
              variante.cod_producto
                .trim(),

            color_estampado:
              color,

            disponible:
              Boolean(
                variante.disponible
              ),

            en_oferta:
              Boolean(
                variante.en_oferta
              ),

            nombre_variante:
              `TALLA ${variante.talla} - ${color.toUpperCase()}`,

            talla:
              variante.talla,
          };


          if (
            variante.en_oferta
          ) {
            datos.precio_oferta =
              Number(
                variante.precio_oferta
              );
          }


          /*
            El ID original se conserva.
            Si es nueva, conserva el ID
            generado por el formulario.
          */
          mapa[
            variante.id
          ] =
            datos;


          return mapa;
        },
        {}
      );
    };


  // =====================================================
  // GUARDAR
  // =====================================================

  const manejarGuardar =
    async (
      evento
    ) => {
      evento.preventDefault();


      setErrores(
        []
      );

      setErrorCarga(
        ''
      );


      if (
        !validarFormulario()
      ) {
        window.scrollTo({
          top:
            0,

          behavior:
            'smooth',
        });

        return;
      }


      const confirmacion =
        await Swal.fire({
          title:
            modoEdicion
              ? '¿Guardar cambios?'
              : '¿Crear producto?',

          html: `
            <p style="color:#bbb;">
              ${
                modoEdicion
                  ? 'Se actualizará'
                  : 'Se registrará'
              }
              <strong style="color:#fff;">
                ${formulario.nombre.trim()}
              </strong>.
            </p>

            <p style="
              color:#888;
              font-size:13px;
              margin-top:8px;
            ">
              ${variantes.length}
              ${
                variantes.length === 1
                  ? 'variante'
                  : 'variantes'
              }
              ·
              ${imagenesTrabajo.length}
              ${
                imagenesTrabajo.length === 1
                  ? 'imagen'
                  : 'imágenes'
              }
            </p>
          `,

          icon:
            'question',

          showCancelButton:
            true,

          confirmButtonText:
            modoEdicion
              ? 'Guardar cambios'
              : 'Crear producto',

          cancelButtonText:
            'Cancelar',

          confirmButtonColor:
            '#e4292f',

          cancelButtonColor:
            '#333333',

          background:
            '#1a1a1a',

          color:
            '#ffffff',

          reverseButtons:
            true,
        });


      if (
        !confirmacion.isConfirmed
      ) {
        return;
      }


      let imagenesSubidasDuranteEdicion =
        [];


      try {
        setGuardando(
          true
        );


        const datosProducto = {
          nombre:
            formulario.nombre.trim(),

          descripcion_corta:
            formulario.descripcion_corta.trim(),

          marca_id:
            formulario.marca_id,

          categoria_id:
            formulario.categoria_id,

          precio:
            Number(
              formulario.precio
            ),

          estado:
            formulario.estado,

          es_nuevo:
            Boolean(
              formulario.es_nuevo
            ),

          imagenes:
            [],

          subcolecciones: {
            variantes:
              convertirVariantesAMapa(),
          },
        };


        // =============================================
        // CREAR
        // =============================================

        if (
          !modoEdicion
        ) {
          const archivosNuevos =
            imagenesTrabajo
              .filter(
                (imagen) =>
                  imagen.tipo ===
                  'nueva'
              )
              .map(
                (imagen) =>
                  imagen.archivo
              );


          if (
            archivosNuevos.length >
            0
          ) {
            await crearProductoConImagenes(
              datosProducto,
              archivosNuevos
            );
          } else {
            await crearProducto(
              datosProducto
            );
          }
        }


        // =============================================
        // EDITAR
        // =============================================

        if (
          modoEdicion
        ) {
          const imagenesNuevas =
            imagenesTrabajo.filter(
              (imagen) =>
                imagen.tipo ===
                'nueva'
            );


          if (
            imagenesNuevas.length >
            0
          ) {
            imagenesSubidasDuranteEdicion =
              await subirImagenesProducto(
                idProducto,
                imagenesNuevas.map(
                  (imagen) =>
                    imagen.archivo
                )
              );
          }


          let indiceNueva =
            0;


          const urlsFinales =
            imagenesTrabajo.map(
              (imagen) => {
                if (
                  imagen.tipo ===
                  'existente'
                ) {
                  return imagen.url;
                }


                const resultado =
                  imagenesSubidasDuranteEdicion[
                    indiceNueva
                  ];


                indiceNueva +=
                  1;


                return resultado.url;
              }
            );


          /*
            Primero actualizamos Firestore.

            Así nunca eliminamos una imagen
            vieja antes de saber que el
            producto quedó correctamente
            actualizado.
          */
          await actualizarProducto(
            idProducto,
            {
              ...datosProducto,

              imagenes:
                urlsFinales,
            }
          );


          /*
            Después limpiamos de Storage
            únicamente las imágenes que el
            administrador quitó.
          */
          for (
            const url of
            imagenesEliminadas
          ) {
            try {
              await eliminarArchivoPorUrl(
                url
              );
            } catch (
              errorEliminando
            ) {
              console.warn(
                'El producto se actualizó, pero no se pudo limpiar una imagen antigua:',
                errorEliminando
              );
            }
          }
        }


        setFormularioModificado(
          false
        );


        await Swal.fire({
          title:
            modoEdicion
              ? 'Producto actualizado'
              : 'Producto creado',

          text:
            modoEdicion
              ? 'Los datos, variantes e imágenes fueron actualizados correctamente.'
              : 'El producto fue registrado correctamente.',

          icon:
            'success',

          confirmButtonText:
            'Aceptar',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',

          timer:
            1800,

          timerProgressBar:
            true,
        });


        navegar(
          '/admin/panel',
          {
            replace:
              true,
          }
        );
      } catch (
        error
      ) {
        console.error(
          'Error guardando producto:',
          error
        );


        /*
          Si estábamos editando y logramos
          subir imágenes nuevas pero luego
          Firestore falló, las limpiamos para
          no dejar basura en Storage.
        */
        if (
          modoEdicion &&
          imagenesSubidasDuranteEdicion.length >
            0
        ) {
          const rutas =
            imagenesSubidasDuranteEdicion
              .map(
                (imagen) =>
                  imagen.ruta
              )
              .filter(Boolean);


          try {
            await eliminarImagenesStorage(
              rutas
            );
          } catch (
            errorRollback
          ) {
            console.error(
              'No se pudieron limpiar las imágenes del intento fallido:',
              errorRollback
            );
          }
        }


        await Swal.fire({
          title:
            'No se pudo guardar',

          text:
            'Ocurrió un error mientras se actualizaba el producto.',

          icon:
            'error',

          confirmButtonText:
            'Aceptar',

          confirmButtonColor:
            '#e4292f',

          background:
            '#1a1a1a',

          color:
            '#ffffff',
        });
      } finally {
        setGuardando(
          false
        );
      }
    };


  // =====================================================
  // VOLVER
  // =====================================================

  const manejarVolver =
    async () => {
      if (
        formularioModificado
      ) {
        const resultado =
          await Swal.fire({
            title:
              '¿Salir sin guardar?',

            text:
              'Los cambios realizados se perderán.',

            icon:
              'warning',

            showCancelButton:
              true,

            confirmButtonText:
              'Salir',

            cancelButtonText:
              'Continuar editando',

            confirmButtonColor:
              '#e4292f',

            cancelButtonColor:
              '#333333',

            background:
              '#1a1a1a',

            color:
              '#ffffff',

            reverseButtons:
              true,
          });


        if (
          !resultado.isConfirmed
        ) {
          return;
        }
      }


      navegar(
        '/admin/panel'
      );
    };


  // =====================================================
  // CARGANDO / ERROR
  // =====================================================

  if (
    cargando
  ) {
    return (
      <div className="formProducto formProducto--cargando">
        Cargando producto...
      </div>
    );
  }


  if (
    errorCarga
  ) {
    return (
      <section className="formProducto">
        <div className="formProducto__errorCarga">
          <h1>
            No se pudo abrir el producto
          </h1>

          <p>
            {errorCarga}
          </p>

          <button
            type="button"
            onClick={
              manejarVolver
            }
          >
            VOLVER A PRODUCTOS
          </button>
        </div>
      </section>
    );
  }


  return (
    <section className="formProducto">

      {/* ================================================= */}
      {/* CABECERA                                         */}
      {/* ================================================= */}

      <div className="formProducto__barraAcciones">
        <div className="formProducto__tituloZona">
          <button
            type="button"
            className="formProducto__volver"
            onClick={
              manejarVolver
            }
            aria-label="Volver a productos"
          >
            <ArrowLeft
              size={20}
            />
          </button>


          <div>
            <span className="formProducto__sobreTitulo">
              PRODUCTOS
            </span>

            <h1>
              {modoEdicion
                ? 'Editar producto'
                : 'Nuevo producto'}
            </h1>

            <p>
              {modoEdicion
                ? 'Modifica información, variantes e imágenes y guarda los cambios.'
                : 'Completa los datos principales y configura sus variantes.'}
            </p>
          </div>
        </div>


        <button
          type="submit"
          form="formulario-producto"
          className="formProducto__guardar"
          disabled={
            guardando
          }
        >
          <Save
            size={18}
          />

          {guardando
            ? 'GUARDANDO...'
            : modoEdicion
              ? 'GUARDAR CAMBIOS'
              : 'CREAR PRODUCTO'}
        </button>
      </div>


      {/* ================================================= */}
      {/* ERRORES                                          */}
      {/* ================================================= */}

      {errores.length >
        0 && (
        <div className="formProducto__errores">
          <strong>
            Revisa lo siguiente antes de guardar:
          </strong>

          <ul>
            {errores.map(
              (
                error,
                indice
              ) => (
                <li
                  key={
                    `${error}-${indice}`
                  }
                >
                  {error}
                </li>
              )
            )}
          </ul>
        </div>
      )}


      <form
        id="formulario-producto"
        onSubmit={
          manejarGuardar
        }
      >

        {/* ================================================= */}
        {/* DATOS + PRECIO                                   */}
        {/* ================================================= */}

        <div className="formProducto__gridPrincipal">
          <div className="formProducto__columnaPrincipal">
            <section className="formProducto__seccion">
              <div className="formProducto__seccionTitulo">
                <PackagePlus
                  size={20}
                />

                <div>
                  <h2>
                    Información del producto
                  </h2>

                  <p>
                    Estos datos aparecen en catálogo,
                    búsqueda y detalle.
                  </p>
                </div>
              </div>


              <div className="formProducto__campos">
                <div className="formProducto__campo formProducto__campo--completo">
                  <label htmlFor="nombre">
                    Nombre del producto *
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={
                      formulario.nombre
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. ONIX COMPRESIÓN MANGA CORTA"
                  />

                  <small>
                    Usa el nombre comercial que verá el cliente.
                  </small>
                </div>


                <div className="formProducto__campo">
                  <label htmlFor="marca_id">
                    Marca *
                  </label>

                  <select
                    id="marca_id"
                    name="marca_id"
                    value={
                      formulario.marca_id
                    }
                    onChange={
                      manejarCambio
                    }
                  >
                    <option value="">
                      Selecciona una marca
                    </option>


                    {marcas
                      .slice()
                      .sort(
                        (
                          a,
                          b
                        ) =>
                          String(
                            a.nombre ||
                            ''
                          ).localeCompare(
                            String(
                              b.nombre ||
                              ''
                            ),
                            'es',
                            {
                              sensitivity:
                                'base',
                            }
                          )
                      )
                      .map(
                        (marca) => {
                          const estaActiva =
                            marca.estado ===
                            true;

                          const esSeleccionada =
                            formulario.marca_id ===
                            marca.id;


                          return (
                            <option
                              key={
                                marca.id
                              }
                              value={
                                marca.id
                              }
                              disabled={
                                !estaActiva &&
                                !esSeleccionada
                              }
                            >
                              {marca.nombre ||
                                marca.id}

                              {!estaActiva
                                ? ' (inactiva)'
                                : ''}
                            </option>
                          );
                        }
                      )}
                  </select>
                </div>


                <div className="formProducto__campo">
                  <label htmlFor="categoria_id">
                    Categoría *
                  </label>

                  <select
                    id="categoria_id"
                    name="categoria_id"
                    value={
                      formulario.categoria_id
                    }
                    onChange={
                      manejarCambio
                    }
                  >
                    <option value="">
                      Selecciona una categoría
                    </option>


                    {categorias
                      .slice()
                      .sort(
                        (
                          a,
                          b
                        ) =>
                          String(
                            a.nombre ||
                            ''
                          ).localeCompare(
                            String(
                              b.nombre ||
                              ''
                            ),
                            'es',
                            {
                              sensitivity:
                                'base',
                            }
                          )
                      )
                      .map(
                        (
                          categoria
                        ) => {
                          const estaActiva =
                            categoria.estado ===
                            true;

                          const esSeleccionada =
                            formulario.categoria_id ===
                            categoria.id;


                          return (
                            <option
                              key={
                                categoria.id
                              }
                              value={
                                categoria.id
                              }
                              disabled={
                                !estaActiva &&
                                !esSeleccionada
                              }
                            >
                              {categoria.nombre ||
                                categoria.id}

                              {!estaActiva
                                ? ' (inactiva)'
                                : ''}
                            </option>
                          );
                        }
                      )}
                  </select>

                  <small>
                    La guía de tallas depende de esta categoría.
                  </small>
                </div>


                <div className="formProducto__campo formProducto__campo--completo">
                  <label htmlFor="descripcion_corta">
                    Descripción corta *
                  </label>

                  <textarea
                    id="descripcion_corta"
                    name="descripcion_corta"
                    value={
                      formulario.descripcion_corta
                    }
                    onChange={
                      manejarCambio
                    }
                    rows="5"
                    placeholder="Describe brevemente el producto..."
                  />

                  <small>
                    También se utiliza para la búsqueda pública.
                  </small>
                </div>
              </div>
            </section>
          </div>


          <aside className="formProducto__columnaLateral">
            <section className="formProducto__seccion">
              <div className="formProducto__seccionTitulo">
                <BadgeDollarSign
                  size={20}
                />

                <div>
                  <h2>
                    Precio y estado
                  </h2>

                  <p>
                    Configuración comercial del producto.
                  </p>
                </div>
              </div>


              <div className="formProducto__campo">
                <label htmlFor="precio">
                  Precio de venta *
                </label>

                <div className="formProducto__precio">
                  <span>
                    Bs.
                  </span>

                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      formulario.precio
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="250.00"
                  />
                </div>

                <small>
                  Precio base usado cuando una variante no está en oferta.
                </small>
              </div>


              <div className="formProducto__switchFila">
                <div>
                  <strong>
                    Producto activo
                  </strong>

                  <small>
                    Si está inactivo no aparecerá al cliente.
                  </small>
                </div>

                <label className="formSwitch">
                  <input
                    type="checkbox"
                    checked={
                      formulario.estado ===
                      'activo'
                    }
                    onChange={
                      (evento) =>
                        manejarEstado(
                          evento.target.checked
                        )
                    }
                  />

                  <span className="formSwitch__control" />
                </label>
              </div>


              <div className="formProducto__switchFila">
                <div>
                  <strong>
                    Nuevo Drop
                  </strong>

                  <small>
                    Muestra la insignia NUEVO.
                  </small>
                </div>

                <label className="formSwitch">
                  <input
                    type="checkbox"
                    checked={
                      formulario.es_nuevo
                    }
                    onChange={
                      (evento) =>
                        manejarNuevoDrop(
                          evento.target.checked
                        )
                    }
                  />

                  <span className="formSwitch__control" />
                </label>
              </div>


              <div className="formProducto__ofertaRapida">
                <div className="formProducto__switchFila">
                  <div>
                    <strong>
                      En oferta
                    </strong>

                    <small>
                      Aplicación rápida a variantes disponibles.
                    </small>
                  </div>

                  <label className="formSwitch">
                    <input
                      type="checkbox"
                      checked={
                        ofertaGeneralActiva
                      }
                      onChange={
                        (evento) =>
                          manejarSwitchOfertaGeneral(
                            evento.target.checked
                          )
                      }
                    />

                    <span className="formSwitch__control" />
                  </label>
                </div>


                {ofertaGeneralActiva && (
                  <div className="formProducto__ofertaContenido">
                    <label htmlFor="precio-oferta-general">
                      Precio oferta
                    </label>

                    <div className="formProducto__precio">
                      <span>
                        Bs.
                      </span>

                      <input
                        id="precio-oferta-general"
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          precioOfertaGeneral
                        }
                        onChange={
                          (evento) =>
                            setPrecioOfertaGeneral(
                              evento.target.value
                            )
                        }
                        placeholder="Precio para variantes"
                      />
                    </div>


                    <button
                      type="button"
                      onClick={
                        aplicarPrecioOfertaGeneral
                      }
                    >
                      APLICAR A VARIANTES DISPONIBLES
                    </button>
                  </div>
                )}


                {mensajeOferta && (
                  <p className="formProducto__mensajeOferta">
                    {mensajeOferta}
                  </p>
                )}


                <p className="formProducto__notaOferta">
                  La oferta se guarda realmente en{' '}
                  <code>
                    variante.en_oferta
                  </code>{' '}
                  y{' '}
                  <code>
                    variante.precio_oferta
                  </code>.
                </p>
              </div>
            </section>
          </aside>
        </div>


        {/* ================================================= */}
        {/* IMÁGENES                                         */}
        {/* ================================================= */}

        <section className="formProducto__seccion formProducto__seccion--imagenes">
          <div className="formProducto__seccionTitulo">
            <ImageIcon
              size={20}
            />

            <div>
              <h2>
                Imágenes
              </h2>

              <p>
                Agrega, elimina y ordena fotografías antes de guardar.
              </p>
            </div>
          </div>


          <input
            ref={
              inputImagenesRef
            }
            className="formProducto__inputImagenesOculto"
            type="file"
            accept="image/*"
            multiple
            onChange={
              manejarSeleccionImagenes
            }
          />


          <div className="formProducto__imagenesContenido">
            <div
              className={
                `formProducto__dropImagenes ${
                  arrastrandoArchivos
                    ? 'formProducto__dropImagenes--activo'
                    : ''
                }`
              }
              onDragEnter={
                manejarDragEnterArchivos
              }
              onDragOver={
                manejarDragOverArchivos
              }
              onDragLeave={
                manejarDragLeaveArchivos
              }
              onDrop={
                manejarDropArchivos
              }
            >
              <UploadCloud
                size={34}
              />

              <strong>
                Arrastra imágenes aquí
              </strong>

              <span>
                o selecciona varias imágenes desde tu equipo
              </span>

              <button
                type="button"
                onClick={() =>
                  inputImagenesRef.current
                    ?.click()
                }
              >
                SELECCIONAR IMÁGENES
              </button>

              <small>
                JPG, PNG, WEBP u otros formatos compatibles.
              </small>
            </div>


            <div className="formProducto__imagenesPanel">
              {mensajeImagenes && (
                <p className="formProducto__mensajeImagenes">
                  {mensajeImagenes}
                </p>
              )}


              {imagenesTrabajo.length >
              0 ? (
                <div className="formProducto__imagenesZona">
                  <div className="formProducto__imagenesCabecera">
                    <div>
                      <strong>
                        {imagenesTrabajo.length}{' '}
                        {imagenesTrabajo.length ===
                        1
                          ? 'imagen'
                          : 'imágenes'}
                      </strong>

                      <span>
                        Arrastra o usa las flechas para cambiar el orden.
                      </span>
                    </div>

                    <span className="formProducto__imagenPrincipalInfo">
                      La primera es la principal
                    </span>
                  </div>


                  <div className="formProducto__imagenesGrid">
                    {imagenesTrabajo.map(
                      (
                        imagen,
                        indice
                      ) => (
                        <article
                          key={
                            imagen.id
                          }
                          data-indice-imagen={
                            indice
                          }
                          className={
                            `formProducto__imagenCard ${
                              indiceImagenArrastrada ===
                              indice
                                ? 'formProducto__imagenCard--arrastrando'
                                : ''
                            }`
                          }
                          draggable
                          onDragStart={
                            (evento) =>
                              manejarInicioArrastreImagen(
                                evento,
                                indice
                              )
                          }
                          onDragOver={
                            manejarArrastreSobreImagen
                          }
                          onDrop={
                            (evento) =>
                              manejarSoltarImagen(
                                evento,
                                indice
                              )
                          }
                          onDragEnd={
                            manejarFinArrastreImagen
                          }
                        >
                          <div className="formProducto__imagenPreview">
                            <img
                              src={
                                imagen.url
                              }
                              alt={
                                `Vista previa ${indice + 1}`
                              }
                            />

                            {indice ===
                              0 && (
                              <span className="formProducto__principalBadge">
                                PRINCIPAL
                              </span>
                            )}
                          </div>


                          <div className="formProducto__imagenAcciones">
                            <button
                              type="button"
                              className="formProducto__imagenMover"
                              title="Arrastra para cambiar el orden"
                              onPointerDown={
                                (evento) =>
                                  manejarPointerDownImagen(
                                    evento,
                                    indice
                                  )
                              }
                              onPointerMove={
                                manejarPointerMoveImagen
                              }
                              onPointerUp={
                                finalizarArrastreTactil
                              }
                              onPointerCancel={
                                finalizarArrastreTactil
                              }
                            >
                              <GripVertical
                                size={17}
                              />

                              <span>
                                {indice + 1}
                              </span>
                            </button>


                            <div className="formProducto__imagenBotonesOrden">
                              <button
                                type="button"
                                className="formProducto__imagenOrdenBoton"
                                onClick={() =>
                                  moverImagen(
                                    indice,
                                    -1
                                  )
                                }
                                disabled={
                                  indice ===
                                  0
                                }
                                title="Mover antes"
                              >
                                <ChevronLeft
                                  size={17}
                                />
                              </button>

                              <button
                                type="button"
                                className="formProducto__imagenOrdenBoton"
                                onClick={() =>
                                  moverImagen(
                                    indice,
                                    1
                                  )
                                }
                                disabled={
                                  indice ===
                                  imagenesTrabajo.length -
                                    1
                                }
                                title="Mover después"
                              >
                                <ChevronRight
                                  size={17}
                                />
                              </button>
                            </div>


                            <button
                              type="button"
                              className="formProducto__imagenEliminar"
                              onClick={() =>
                                eliminarImagen(
                                  imagen.id
                                )
                              }
                              title="Eliminar imagen"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="formProducto__imagenesVacio">
                  <ImageIcon
                    size={28}
                  />

                  <p className="formProducto__sinImagenes">
                    El producto todavía no tiene imágenes.
                  </p>

                  <span>
                    Selecciona o arrastra fotografías para verlas aquí.
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* ================================================= */}
        {/* VARIANTES                                        */}
        {/* ================================================= */}

        <section className="formProducto__seccion formProducto__seccion--variantes">
          <div className="formProducto__seccionTitulo">
            <Sparkles
              size={20}
            />

            <div>
              <h2>
                Tallas, colores y disponibilidad
              </h2>

              <p>
                Puedes modificar, agregar o eliminar variantes. Cada combinación conserva su ID cuando ya existía.
              </p>
            </div>
          </div>


          <TablaVariantesProducto
            variantes={
              variantes
            }
            onChange={
              manejarVariantes
            }
            precioBase={
              formulario.precio
            }
            nombreProducto={
              formulario.nombre
            }
          />
        </section>
      </form>


      {/* ================================================= */}
      {/* ACCIONES MÓVIL                                   */}
      {/* ================================================= */}

      <div className="formProducto__accionesMovil">
        <button
          type="button"
          onClick={
            manejarVolver
          }
          className="formProducto__accionesMovilCancelar"
        >
          CANCELAR
        </button>

        <button
          type="submit"
          form="formulario-producto"
          disabled={
            guardando
          }
          className="formProducto__accionesMovilGuardar"
        >
          <Save
            size={17}
          />

          {guardando
            ? 'GUARDANDO...'
            : 'GUARDAR'}
        </button>
      </div>
    </section>
  );
}


export default FormularioProducto;
