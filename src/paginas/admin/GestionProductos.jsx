import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import Swal from 'sweetalert2';

import TablaProductos from '../../componentes/admin/TablaProductos';

import {
  eliminarProducto,
  obtenerProductos,
} from '../../servicios/admin/productosServicio';

import {
  suscribirCategorias,
} from '../../servicios/admin/categoriasServicio';

import usarPermisosAdmin from '../../hooks/usarPermisosAdmin';

import '../../estilos/adminestilos.css';
import './AdminEstilos.css';


function GestionProductos() {
  const navegar = useNavigate();

  const {
    tienePermiso,
  } = usarPermisosAdmin();

  const [
    productos,
    setProductos,
  ] = useState([]);

  const [
    categorias,
    setCategorias,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    busqueda,
    setBusqueda,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');


  // ====================================================
  // PERMISOS
  // ====================================================

  const puedeCrear =
    tienePermiso(
      'productos_crear'
    );

  const puedeEditar =
    tienePermiso(
      'productos_editar'
    );

  const puedeEliminar =
    tienePermiso(
      'productos_eliminar'
    );


  // ====================================================
  // CARGAR PRODUCTOS Y CATEGORÍAS
  // ====================================================

  useEffect(() => {
    let componenteActivo = true;

    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError('');

        const productosBD =
          await obtenerProductos();

        if (componenteActivo) {
          setProductos(productosBD);
        }
      } catch (err) {
        console.error(
          'Error cargando productos:',
          err
        );

        if (componenteActivo) {
          setError(
            'No se pudieron cargar los productos.'
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarProductos();

    const unsubscribeCategorias =
      suscribirCategorias(
        (data) => {
          if (componenteActivo) {
            setCategorias(data);
          }
        }
      );

    return () => {
      componenteActivo = false;

      unsubscribeCategorias();
    };
  }, []);


  // ====================================================
  // BUSCADOR
  // ====================================================

  const productosFiltrados =
    useMemo(() => {
      const texto =
        busqueda
          .trim()
          .toLowerCase();

      if (!texto) {
        return productos;
      }

      return productos.filter(
        (producto) => {
          const nombre =
            producto.nombre
              ?.toLowerCase() || '';

          const categoria =
            producto.categoria_id
              ?.toLowerCase() || '';

          const variantes =
            Object.values(
              producto.subcolecciones
                ?.variantes || {}
            );

          const coincideSku =
            variantes.some(
              (variante) =>
                variante.cod_producto
                  ?.toLowerCase()
                  .includes(texto)
            );

          const coincideColor =
            variantes.some(
              (variante) =>
                variante.color_estampado
                  ?.toLowerCase()
                  .includes(texto)
            );

          return (
            nombre.includes(texto) ||
            categoria.includes(texto) ||
            coincideSku ||
            coincideColor
          );
        }
      );
    }, [
      productos,
      busqueda,
    ]);


  // ====================================================
  // NUEVO PRODUCTO
  // ====================================================

  const manejarNuevoProducto = () => {
    if (!puedeCrear) {
      return;
    }

    navegar(
      '/admin/productos/nuevo'
    );
  };


  // ====================================================
  // EDITAR
  // ====================================================

  const manejarEditar = (
    producto
  ) => {
    if (
      !puedeEditar ||
      !producto?.id
    ) {
      return;
    }

    navegar(
      `/admin/productos/editar/${producto.id}`
    );
  };


  // ====================================================
  // ELIMINAR
  // ====================================================

  const manejarEliminar = async (
    producto
  ) => {
    if (!puedeEliminar) {
      return;
    }

    const resultado =
      await Swal.fire({
        title:
          '¿Eliminar producto?',

        html: `
          <p style="
            color:#bbb;
            margin-top:8px;
          ">
            Estás a punto de eliminar
            <strong style="color:#fff;">
              ${producto.nombre}
            </strong>.
          </p>

          <p style="
            color:#888;
            font-size:13px;
            margin-top:8px;
          ">
            Esta acción no se puede deshacer.
          </p>
        `,

        icon:
          'warning',

        showCancelButton:
          true,

        confirmButtonText:
          'Sí, eliminar',

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

        focusCancel:
          true,
      });

    if (!resultado.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title:
          'Eliminando...',

        text:
          'Espera un momento.',

        background:
          '#1a1a1a',

        color:
          '#ffffff',

        allowOutsideClick:
          false,

        allowEscapeKey:
          false,

        didOpen: () => {
          Swal.showLoading();
        },
      });

      await eliminarProducto(
        producto.id
      );

      setProductos(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.id !==
              producto.id
          )
      );

      await Swal.fire({
        title:
          'Producto eliminado',

        text:
          `${producto.nombre} fue eliminado correctamente.`,

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
      });
    } catch (err) {
      console.error(
        'Error eliminando producto:',
        err
      );

      await Swal.fire({
        title:
          'No se pudo eliminar',

        text:
          'Ocurrió un error al eliminar el producto.',

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
    }
  };


  // ====================================================
  // CARGANDO
  // ====================================================

  if (cargando) {
    return (
      <div className="gestionProductos">
        <p>
          Cargando productos...
        </p>
      </div>
    );
  }


  return (
    <section className="gestionProductos">

      <div className="gestionProductos__cabecera">
        <div>
          <h1 className="admin-header-title">
            Gestión de Productos
          </h1>

          <p className="gestionProductos__contador">
            {productos.length}{' '}
            productos registrados
          </p>
        </div>


        {puedeCrear && (
          <button
            type="button"
            className="gestionProductos__nuevo"
            onClick={
              manejarNuevoProducto
            }
          >
            + NUEVO PRODUCTO
          </button>
        )}
      </div>


      {error && (
        <div className="alerta alerta--error">
          {error}
        </div>
      )}


      <div className="admin-toolbar">
        <div className="grupo-input admin-search">
          <label>
            Buscar producto
          </label>

          <input
            type="search"
            placeholder="Nombre, SKU o color..."
            value={
              busqueda
            }
            onChange={
              (evento) =>
                setBusqueda(
                  evento.target.value
                )
            }
          />
        </div>
      </div>


      <TablaProductos
        productos={
          productosFiltrados
        }

        categorias={
          categorias
        }

        onEditar={
          puedeEditar
            ? manejarEditar
            : null
        }

        onEliminar={
          puedeEliminar
            ? manejarEliminar
            : null
        }
      />

    </section>
  );
}


export default GestionProductos;