import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MessageCircle,
  ShoppingBag,
  BadgePercent,
  Sparkles,
  X,
} from 'lucide-react';

import ResumenCarrito
  from '../../componentes/cliente/ResumenCarrito';

import usarCarrito
  from '../../hooks/usarCarrito';

import {
  abrirPedidoEnWhatsApp,
} from '../../servicios/cliente/whatsappServicio';

import {
  suscribirOperadoresWhatsappCliente,
} from '../../servicios/cliente/operadoresWhatsappClienteServicio';

import './MiCarrito.css';

import {
  obtenerCodigoDescuento,
  suscribirPacksActivos,
} from '../../servicios/cliente/promocionesPublicoServicio';

import { calcularResumenDescuentos, describirBeneficioPack } from '../../utilidades/descuentos';


const DATOS_INICIALES = {
  nombres: '',
  celular: '',
  departamento: '',
  observaciones: '',
};


function MiCarrito({
  abierto,
  alCerrar,
}) {
  const {
    itemsCarrito,
    vaciarCarrito,
  } =
    usarCarrito();


  const [
    datosCliente,
    setDatosCliente,
  ] =
    useState(
      DATOS_INICIALES
    );

  const [
    errores,
    setErrores,
  ] =
    useState({});


  const [
    operadores,
    setOperadores,
  ] =
    useState([]);

  const [
    operadorSeleccionadoId,
    setOperadorSeleccionadoId,
  ] =
    useState('');

  const [
    cargandoOperadores,
    setCargandoOperadores,
  ] =
    useState(true);

  const [packs, setPacks] = useState([]);
  const [textoCodigo, setTextoCodigo] = useState('');
  const [codigoAplicado, setCodigoAplicado] = useState(null);
  const [mensajeCodigo, setMensajeCodigo] = useState('');
  const [validandoCodigo, setValidandoCodigo] = useState(false);

  useEffect(() => suscribirPacksActivos(setPacks, (error) => {
    console.error('Error cargando packs:', error);
    setPacks([]);
  }), []);

  const resumenPrecios = useMemo(
    () => calcularResumenDescuentos(itemsCarrito, packs, codigoAplicado),
    [itemsCarrito, packs, codigoAplicado]
  );

  useEffect(() => {
    if (codigoAplicado && resumenPrecios.validacionCodigo?.valido === false) {
      setMensajeCodigo(resumenPrecios.validacionCodigo.mensaje);
      setCodigoAplicado(null);
    }
  }, [codigoAplicado, resumenPrecios.validacionCodigo]);

  const aplicarCodigo = async () => {
    const valor = textoCodigo.trim();
    if (!valor) {
      setMensajeCodigo('Escribe un código de descuento.');
      return;
    }
    try {
      setValidandoCodigo(true);
      const encontrado = await obtenerCodigoDescuento(valor);
      const prueba = calcularResumenDescuentos(itemsCarrito, packs, encontrado);
      if (!encontrado || !prueba.validacionCodigo?.valido) {
        setCodigoAplicado(null);
        setMensajeCodigo(prueba.validacionCodigo?.mensaje || 'El código no existe.');
        return;
      }
      setCodigoAplicado(encontrado);
      setTextoCodigo(encontrado.codigo);
      setMensajeCodigo('Código aplicado correctamente.');
    } catch (error) {
      console.error('Error validando código:', error);
      setMensajeCodigo('No pudimos validar el código. Intenta nuevamente.');
    } finally { setValidandoCodigo(false); }
  };


  // ======================================================
  // OPERADORES DE WHATSAPP
  // ======================================================

  useEffect(() => {
    const desuscribir =
      suscribirOperadoresWhatsappCliente(
        (
          operadoresActivos
        ) => {
          setOperadores(
            operadoresActivos
          );

          setCargandoOperadores(
            false
          );


          if (
            operadoresActivos.length ===
            1
          ) {
            setOperadorSeleccionadoId(
              operadoresActivos[
                0
              ].id
            );

            return;
          }


          setOperadorSeleccionadoId(
            (
              actual
            ) => {
              const sigueExistiendo =
                operadoresActivos.some(
                  (
                    operador
                  ) =>
                    operador.id ===
                    actual
                );


              return sigueExistiendo
                ? actual
                : '';
            }
          );
        }
      );


    return () => {
      desuscribir();
    };
  }, []);


  // ======================================================
  // BLOQUEAR SCROLL
  // ======================================================

  useEffect(() => {
    if (
      !abierto
    ) {
      return undefined;
    }


    const overflowAnterior =
      document.body.style
        .overflow;


    document.body.style
      .overflow =
      'hidden';


    return () => {
      document.body.style
        .overflow =
        overflowAnterior;
    };
  }, [
    abierto,
  ]);


  // ======================================================
  // ESC PARA CERRAR
  // ======================================================

  useEffect(() => {
    if (
      !abierto
    ) {
      return undefined;
    }


    const manejarTecla =
      (
        evento
      ) => {
        if (
          evento.key ===
          'Escape'
        ) {
          alCerrar();
        }
      };


    window.addEventListener(
      'keydown',
      manejarTecla
    );


    return () => {
      window.removeEventListener(
        'keydown',
        manejarTecla
      );
    };
  }, [
    abierto,
    alCerrar,
  ]);


  // ======================================================
  // CAMBIOS FORMULARIO
  // ======================================================

  const manejarCambio =
    (
      evento
    ) => {
      const {
        name,
        value,
      } =
        evento.target;


      setDatosCliente(
        (
          datosActuales
        ) => ({
          ...datosActuales,

          [
            name
          ]:
            value,
        })
      );


      if (
        errores[
          name
        ]
      ) {
        setErrores(
          (
            erroresActuales
          ) => ({
            ...erroresActuales,

            [
              name
            ]:
              '',
          })
        );
      }
    };


  // ======================================================
  // VALIDACIÓN
  // ======================================================

  const validarFormulario =
    () => {
      const nuevosErrores =
        {};


      if (
        !datosCliente
          .nombres
          .trim()
      ) {
        nuevosErrores.nombres =
          'Ingresa tu nombre.';
      }


      const celularLimpio =
        datosCliente
          .celular
          .replace(
            /\D/g,
            ''
          );


      if (
        !celularLimpio
      ) {
        nuevosErrores.celular =
          'Ingresa tu número de celular.';
      } else if (
        celularLimpio.length <
        7
      ) {
        nuevosErrores.celular =
          'Ingresa un número de celular válido.';
      }


      if (
        !datosCliente
          .departamento
          .trim()
      ) {
        nuevosErrores.departamento =
          'Selecciona tu departamento.';
      }


      if (
        operadores.length >
          1 &&
        !operadorSeleccionadoId
      ) {
        nuevosErrores.operador =
          'Selecciona un operador de WhatsApp.';
      }


      if (
        operadores.length ===
        0
      ) {
        nuevosErrores.operador =
          'No hay operadores disponibles para recibir pedidos.';
      }


      setErrores(
        nuevosErrores
      );


      return (
        Object.keys(
          nuevosErrores
        ).length ===
        0
      );
    };


  // ======================================================
  // FINALIZAR PEDIDO
  // ======================================================

  const manejarFinalizarPedido =
    (
      evento
    ) => {
      evento.preventDefault();


      if (
        itemsCarrito.length ===
        0
      ) {
        return;
      }


      if (
        !validarFormulario()
      ) {
        return;
      }


      const operador =
        operadores.find(
          (
            item
          ) =>
            item.id ===
            operadorSeleccionadoId
        ) ||
        operadores[
          0
        ];


      if (
        !operador?.numero
      ) {
        setErrores(
          (
            actuales
          ) => ({
            ...actuales,

            operador:
              'No existe un número válido para recibir el pedido.',
          })
        );

        return;
      }


      /*
        Primero generamos y abrimos el pedido
        en WhatsApp.

        Solo después consideramos finalizada
        la compra y limpiamos el carrito.
      */

      abrirPedidoEnWhatsApp(
        operador.numero,
        datosCliente,
        itemsCarrito,
        resumenPrecios
      );


      /*
        Pedido finalizado:
        vaciamos carrito + localStorage.
      */

      vaciarCarrito();


      /*
        También limpiamos el formulario
        para el siguiente pedido.
      */

      setDatosCliente(
        DATOS_INICIALES
      );

      setErrores(
        {}
      );

      setCodigoAplicado(null);
      setTextoCodigo('');
      setMensajeCodigo('');


      /*
        Cerramos el carrito lateral.
      */

      alCerrar();
    };


  return (
    <>
      <div
        className={
          `carritoLateral__overlay ${
            abierto
              ? 'activo'
              : ''
          }`
        }
        onClick={
          alCerrar
        }
        aria-hidden="true"
      />


      <aside
        className={
          `carritoLateral ${
            abierto
              ? 'abierto'
              : ''
          }`
        }
        aria-hidden={
          !abierto
        }
        aria-label="Carrito de compras"
      >

        {/* ==================================================
            CABECERA
        ================================================== */}

        <header className="carritoLateral__cabecera">
          <div className="carritoLateral__titulo">
            <ShoppingBag
              size={21}
            />

            <div>
              <h2>
                MI CARRITO
              </h2>

              <span>
                {itemsCarrito.length ===
                1
                  ? '1 producto'
                  : `${itemsCarrito.length} productos`}
              </span>
            </div>
          </div>


          <button
            type="button"
            className="carritoLateral__cerrar"
            onClick={
              alCerrar
            }
            aria-label="Cerrar carrito"
          >
            <X
              size={24}
            />
          </button>
        </header>


        <div className="carritoLateral__contenido">
          <ResumenCarrito />


          {itemsCarrito.length >
            0 && (
            <form
              className="pedidoFormulario"
              onSubmit={
                manejarFinalizarPedido
              }
            >
              <div className="pedidoFormulario__encabezado">
                <h3>
                  DATOS PARA PEDIDO
                </h3>

                <p>
                  Completa tus datos para continuar por WhatsApp.
                </p>
              </div>


              {/* NOMBRE */}

              <div className="pedidoFormulario__grupo">
                <label htmlFor="pedido-nombres">
                  Nombre completo *
                </label>

                <input
                  id="pedido-nombres"
                  type="text"
                  name="nombres"
                  value={
                    datosCliente.nombres
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. Juan Pérez"
                  autoComplete="name"
                />

                {errores.nombres && (
                  <span className="pedidoFormulario__error">
                    {errores.nombres}
                  </span>
                )}
              </div>


              {/* CELULAR */}

              <div className="pedidoFormulario__grupo">
                <label htmlFor="pedido-celular">
                  Nro. de celular *
                </label>

                <input
                  id="pedido-celular"
                  type="tel"
                  name="celular"
                  value={
                    datosCliente.celular
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Ej. 71234567"
                  autoComplete="tel"
                  inputMode="tel"
                />

                {errores.celular && (
                  <span className="pedidoFormulario__error">
                    {errores.celular}
                  </span>
                )}
              </div>


              {/* DEPARTAMENTO */}

              <div className="pedidoFormulario__grupo">
                <label htmlFor="pedido-departamento">
                  Departamento *
                </label>

                <select
                  id="pedido-departamento"
                  name="departamento"
                  value={
                    datosCliente.departamento
                  }
                  onChange={
                    manejarCambio
                  }
                >
                  <option value="">
                    Selecciona un departamento
                  </option>

                  <option value="Tarija">
                    Tarija
                  </option>

                  <option value="Chuquisaca">
                    Chuquisaca
                  </option>

                  <option value="La Paz">
                    La Paz
                  </option>

                  <option value="Cochabamba">
                    Cochabamba
                  </option>

                  <option value="Oruro">
                    Oruro
                  </option>

                  <option value="Potosí">
                    Potosí
                  </option>

                  <option value="Santa Cruz">
                    Santa Cruz
                  </option>

                  <option value="Beni">
                    Beni
                  </option>

                  <option value="Pando">
                    Pando
                  </option>
                </select>

                {errores.departamento && (
                  <span className="pedidoFormulario__error">
                    {errores.departamento}
                  </span>
                )}
              </div>


              {/* OPERADOR WHATSAPP */}

              {!cargandoOperadores &&
                operadores.length >
                  1 && (
                <div className="pedidoFormulario__grupo">
                  <label htmlFor="pedido-operador">
                    ¿A qué operador deseas enviar tu pedido? *
                  </label>

                  <div className="pedidoFormulario__operadorSelect">
                    <MessageCircle
                      size={17}
                    />

                    <select
                      id="pedido-operador"
                      value={
                        operadorSeleccionadoId
                      }
                      onChange={
                        (
                          evento
                        ) => {
                          setOperadorSeleccionadoId(
                            evento.target.value
                          );

                          if (
                            errores.operador
                          ) {
                            setErrores(
                              (
                                actuales
                              ) => ({
                                ...actuales,

                                operador:
                                  '',
                              })
                            );
                          }
                        }
                      }
                    >
                      <option value="">
                        Selecciona un operador
                      </option>

                      {operadores.map(
                        (
                          operador
                        ) => (
                          <option
                            key={
                              operador.id
                            }
                            value={
                              operador.id
                            }
                          >
                            {operador.nombre}
                            {operador.etiqueta
                              ? ` — ${operador.etiqueta}`
                              : ''}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {errores.operador && (
                    <span className="pedidoFormulario__error">
                      {errores.operador}
                    </span>
                  )}
                </div>
              )}


              {!cargandoOperadores &&
                operadores.length ===
                  0 && (
                <div className="pedidoFormulario__avisoOperador">
                  <MessageCircle
                    size={17}
                  />

                  <span>
                    En este momento no hay operadores disponibles para recibir pedidos.
                  </span>
                </div>
              )}


              {/* OBSERVACIONES */}

              <div className="pedidoFormulario__grupo">
                <label htmlFor="pedido-observaciones">
                  Observaciones / detalles de entrega
                </label>

                <textarea
                  id="pedido-observaciones"
                  name="observaciones"
                  value={
                    datosCliente.observaciones
                  }
                  onChange={
                    manejarCambio
                  }
                  placeholder="Dirección, referencia, horario de entrega, etc."
                  rows="4"
                  maxLength="500"
                />

                <span className="pedidoFormulario__contador">
                  {datosCliente
                    .observaciones
                    .length}/500
                </span>
              </div>


              {/* TOTAL */}

              <section className="pedidoFormulario__descuentos">
                <div className="pedidoFormulario__descuentosTitulo"><span><BadgePercent size={18}/><strong>PROMOCIONES</strong></span><small>El mejor beneficio se calcula automáticamente</small></div>
                {resumenPrecios.mejorPack && <div className="pedidoFormulario__promoAplicada"><div><span>APLICADA</span><strong>{resumenPrecios.mejorPack.pack.nombre}</strong><small>{resumenPrecios.mejorPack.beneficio}</small></div><b>- Bs. {resumenPrecios.descuentoPack.toFixed(2)}</b></div>}
                {resumenPrecios.progresoPack && <div className="pedidoFormulario__promoProgreso"><Sparkles size={17}/><span>Agrega <strong>{resumenPrecios.progresoPack.faltan} prenda(s) más</strong> para activar “{resumenPrecios.progresoPack.pack.nombre}” ({describirBeneficioPack(resumenPrecios.progresoPack.pack)}).</span></div>}
                <label htmlFor="pedido-codigo">Código de descuento</label>
                <div className="pedidoFormulario__codigo">
                  <input id="pedido-codigo" value={textoCodigo} onChange={(evento) => { setTextoCodigo(evento.target.value.toUpperCase()); setMensajeCodigo(''); }} placeholder="ESCRIBE TU CÓDIGO" disabled={Boolean(codigoAplicado)}/>
                  {codigoAplicado ? <button type="button" onClick={() => { setCodigoAplicado(null); setTextoCodigo(''); setMensajeCodigo('Código retirado.'); }}>QUITAR</button> : <button type="button" onClick={aplicarCodigo} disabled={validandoCodigo}>{validandoCodigo ? '…' : 'APLICAR'}</button>}
                </div>
                {mensajeCodigo && <small className={codigoAplicado ? 'exito' : ''}>{mensajeCodigo}</small>}
                {resumenPrecios.descuentoCodigo > 0 && <div className="pedidoFormulario__promoAplicada"><span>Código {resumenPrecios.codigo?.codigo}</span><strong>- Bs. {resumenPrecios.descuentoCodigo.toFixed(2)}</strong></div>}
              </section>

              <div className="pedidoFormulario__lineaPrecio"><span>Subtotal</span><span>Bs. {resumenPrecios.subtotal.toFixed(2)}</span></div>
              {(resumenPrecios.descuentoPack + resumenPrecios.descuentoCodigo) > 0 && <div className="pedidoFormulario__lineaPrecio ahorro"><span>Ahorro total</span><span>- Bs. {(resumenPrecios.descuentoPack + resumenPrecios.descuentoCodigo).toFixed(2)}</span></div>}

              <div className="pedidoFormulario__total">
                <span>
                  TOTAL
                </span>

                <strong>
                  Bs. {resumenPrecios.total.toFixed(
                    2
                  )}
                </strong>
              </div>


              {/* FINALIZAR */}

              <button
                type="submit"
                className="pedidoFormulario__whatsapp"
                disabled={
                  cargandoOperadores ||
                  operadores.length ===
                    0
                }
              >
                {cargandoOperadores
                  ? 'CARGANDO WHATSAPP...'
                  : 'FINALIZAR COMPRA EN WHATSAPP'}
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}


export default MiCarrito;
