import {
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import {
  TALLAS_ESTANDAR as TALLAS,
  ordenarVariantes,
} from '../../utilidades/tallas';


const normalizarCodigoProducto = (
  texto = ''
) => {
  return String(texto)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toUpperCase()
    .replace(
      /[^A-Z0-9]+/g,
      '-'
    )
    .replace(
      /-+/g,
      '-'
    )
    .replace(
      /^-|-$/g,
      ''
    );
};


const generarCodigoProducto = (
  nombreProducto,
  color,
  talla
) => {
  const partes = [
    nombreProducto,
    color,
    talla,
  ]
    .map(
      normalizarCodigoProducto
    )
    .filter(Boolean);

  return partes.join('-');
};


const obtenerCodigoUnico = (
  codigoBase,
  variantesActuales,
  idIgnorar = null
) => {
  if (!codigoBase) {
    return '';
  }

  const codigosExistentes =
    new Set(
      variantesActuales
        .filter(
          (variante) =>
            variante.id !==
            idIgnorar
        )
        .map(
          (variante) =>
            normalizarCodigoProducto(
              variante.cod_producto
            )
        )
        .filter(Boolean)
    );

  if (
    !codigosExistentes.has(
      codigoBase
    )
  ) {
    return codigoBase;
  }

  let numero = 1;

  while (
    codigosExistentes.has(
      `${codigoBase}-${numero}`
    )
  ) {
    numero += 1;
  }

  return `${codigoBase}-${numero}`;
};


const crearIdVariante = () => {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return `var_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};


const normalizar = (
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


const construirNombreVariante = (
  talla,
  color
) => {
  const colorLimpio =
    color?.trim();

  if (!colorLimpio) {
    return `TALLA ${talla}`;
  }

  return `TALLA ${talla} - ${colorLimpio.toUpperCase()}`;
};


function TablaVariantesProducto({
  variantes,
  onChange,
  precioBase,
  nombreProducto,
}) {
  const [
    colorRapido,
    setColorRapido,
  ] = useState('');

  const [
    tallasRapidas,
    setTallasRapidas,
  ] = useState([]);

  const [
    mensajeRapido,
    setMensajeRapido,
  ] = useState('');


  // =====================================================
  // ACTUALIZAR SKU AUTOMÁTICO CUANDO CAMBIA EL NOMBRE
  // =====================================================

  useEffect(() => {
    if (
      !nombreProducto?.trim() ||
      variantes.length === 0
    ) {
      return;
    }

    let huboCambios = false;

    const codigosOcupados =
      new Set(
        variantes
          .filter(
            (variante) =>
              variante.sku_manual ===
              true
          )
          .map(
            (variante) =>
              normalizarCodigoProducto(
                variante.cod_producto
              )
          )
          .filter(Boolean)
      );

    const nuevasVariantes =
      variantes.map(
        (variante) => {
          if (
            variante.sku_manual ===
            true
          ) {
            return variante;
          }

          if (
            !variante.color_estampado
              ?.trim() ||
            !variante.talla
          ) {
            return variante;
          }

          const codigoBase =
            generarCodigoProducto(
              nombreProducto,
              variante.color_estampado,
              variante.talla
            );

          let codigoFinal =
            codigoBase;

          let numero = 1;

          while (
            codigosOcupados.has(
              codigoFinal
            )
          ) {
            codigoFinal =
              `${codigoBase}-${numero}`;

            numero += 1;
          }

          codigosOcupados.add(
            codigoFinal
          );

          if (
            codigoFinal !==
            variante.cod_producto
          ) {
            huboCambios = true;
          }

          return {
            ...variante,

            cod_producto:
              codigoFinal,
          };
        }
      );

    if (huboCambios) {
      onChange(
        nuevasVariantes
      );
    }
  }, [
    nombreProducto,
  ]);


  // =====================================================
  // ACTUALIZAR VARIANTE
  // =====================================================

  const actualizarVariante = (
    id,
    campo,
    valor
  ) => {
    const nuevasVariantes =
      variantes.map(
        (variante) => {
          if (
            variante.id !== id
          ) {
            return variante;
          }

          const actualizada = {
            ...variante,

            [campo]:
              valor,
          };


          // =============================================
          // TALLA / COLOR
          // =============================================

          if (
            campo === 'talla' ||
            campo ===
              'color_estampado'
          ) {
            actualizada.nombre_variante =
              construirNombreVariante(
                actualizada.talla,
                actualizada.color_estampado
              );

            /*
              Si el SKU no fue personalizado
              para Kraken, se recalcula.
            */
            if (
              actualizada.sku_manual !==
              true
            ) {
              const codigoBase =
                generarCodigoProducto(
                  nombreProducto,
                  actualizada.color_estampado,
                  actualizada.talla
                );

              actualizada.cod_producto =
                obtenerCodigoUnico(
                  codigoBase,
                  variantes,
                  actualizada.id
                );
            }
          }


          // =============================================
          // SKU MANUAL
          // =============================================

          if (
            campo ===
            'cod_producto'
          ) {
            actualizada.cod_producto =
              normalizarCodigoProducto(
                valor
              );

            actualizada.sku_manual =
              true;
          }


          // =============================================
          // DESACTIVAR OFERTA
          // =============================================

          if (
            campo ===
              'en_oferta' &&
            valor === false
          ) {
            actualizada.precio_oferta =
              '';
          }

          return actualizada;
        }
      );

    onChange(
      ordenarVariantes(nuevasVariantes)
    );
  };


  // =====================================================
  // VOLVER SKU A AUTOMÁTICO
  // =====================================================

  const restaurarSkuAutomatico = (
    id
  ) => {
    const nuevasVariantes =
      variantes.map(
        (variante) => {
          if (
            variante.id !== id
          ) {
            return variante;
          }

          const codigoBase =
            generarCodigoProducto(
              nombreProducto,
              variante.color_estampado,
              variante.talla
            );

          return {
            ...variante,

            sku_manual:
              false,

            cod_producto:
              obtenerCodigoUnico(
                codigoBase,
                variantes,
                variante.id
              ),
          };
        }
      );

    onChange(
      nuevasVariantes
    );
  };


  // =====================================================
  // ELIMINAR VARIANTE
  // =====================================================

  const eliminarVariante = (
    id
  ) => {
    onChange(
      variantes.filter(
        (variante) =>
          variante.id !== id
      )
    );
  };


  // =====================================================
  // AGREGAR VARIANTE MANUAL
  // =====================================================

  const agregarVarianteManual =
    () => {
      const id =
        crearIdVariante();

      const talla =
        'M';

    onChange(ordenarVariantes([
        ...variantes,

        {
          id,

          talla,

          color_estampado:
            '',

          cod_producto:
            '',

          sku_manual:
            false,

          disponible:
            true,

          en_oferta:
            false,

          precio_oferta:
            '',

          nombre_variante:
            'TALLA M',
        },
    ]));
    };


  // =====================================================
  // TALLAS RÁPIDAS
  // =====================================================

  const alternarTallaRapida = (
    talla
  ) => {
    setTallasRapidas(
      (actuales) =>
        actuales.includes(talla)
          ? actuales.filter(
              (item) =>
                item !== talla
            )
          : [
              ...actuales,
              talla,
            ]
    );
  };


  // =====================================================
  // AGREGAR GRUPO
  // =====================================================

  const agregarGrupoColor = () => {
    const color =
      colorRapido.trim();

    if (!color) {
      setMensajeRapido(
        'Escribe primero el color o estampado.'
      );

      return;
    }

    if (
      tallasRapidas.length === 0
    ) {
      setMensajeRapido(
        'Selecciona al menos una talla.'
      );

      return;
    }

    const combinacionesExistentes =
      new Set(
        variantes.map(
          (variante) =>
            `${normalizar(
              variante.color_estampado
            )}__${variante.talla}`
        )
      );

    const nuevas = [];

    let omitidas = 0;


    tallasRapidas.forEach(
      (talla) => {
        const clave =
          `${normalizar(color)}__${talla}`;

        if (
          combinacionesExistentes.has(
            clave
          )
        ) {
          omitidas += 1;

          return;
        }

        const id =
          crearIdVariante();

        const codigoBase =
          generarCodigoProducto(
            nombreProducto,
            color,
            talla
          );

        const codigoUnico =
          obtenerCodigoUnico(
            codigoBase,
            [
              ...variantes,
              ...nuevas,
            ],
            id
          );

        nuevas.push({
          id,

          talla,

          color_estampado:
            color,

          cod_producto:
            codigoUnico,

          sku_manual:
            false,

          disponible:
            true,

          en_oferta:
            false,

          precio_oferta:
            '',

          nombre_variante:
            construirNombreVariante(
              talla,
              color
            ),
        });
      }
    );


    if (
      nuevas.length > 0
    ) {
      onChange(ordenarVariantes([
        ...variantes,
        ...nuevas,
      ]));
    }


    setMensajeRapido(
      omitidas > 0
        ? `${nuevas.length} variantes agregadas. ${omitidas} ya existían.`
        : `${nuevas.length} variantes agregadas.`
    );

    setColorRapido('');
    setTallasRapidas([]);
  };


  return (
    <div className="tablaVariantes">

      {/* ================================================= */}
      {/* CONSTRUCTOR RÁPIDO                               */}
      {/* ================================================= */}

      <div className="tablaVariantes__rapido">
        <div className="tablaVariantes__rapidoInfo">
          <h3>
            Agregar tallas rápidamente
          </h3>

          <p>
            Escribe un color y selecciona
            todas las tallas que existen
            para ese color.
          </p>
        </div>


        <div className="tablaVariantes__constructor">
          <div className="tablaVariantes__campoColor">
            <label htmlFor="color-rapido">
              Color / estampado
            </label>

            <input
              id="color-rapido"
              type="text"
              value={
                colorRapido
              }
              onChange={
                (evento) =>
                  setColorRapido(
                    evento.target.value
                  )
              }
              placeholder="Ej. Negro"
            />
          </div>


          <div className="tablaVariantes__tallasRapidas">
            <span className="tablaVariantes__label">
              Tallas disponibles
            </span>

            <div className="tablaVariantes__chips">
              {TALLAS.map(
                (talla) => (
                  <button
                    key={talla}
                    type="button"
                    className={
                      `tablaVariantes__chip ${
                        tallasRapidas.includes(
                          talla
                        )
                          ? 'tablaVariantes__chip--activo'
                          : ''
                      }`
                    }
                    onClick={() =>
                      alternarTallaRapida(
                        talla
                      )
                    }
                  >
                    {talla}
                  </button>
                )
              )}
            </div>
          </div>


          <button
            type="button"
            className="tablaVariantes__agregarGrupo"
            onClick={
              agregarGrupoColor
            }
          >
            <Plus size={17} />

            AGREGAR COMBINACIONES
          </button>
        </div>


        {mensajeRapido && (
          <p className="tablaVariantes__mensaje">
            {mensajeRapido}
          </p>
        )}
      </div>


      {/* ================================================= */}
      {/* CABECERA                                         */}
      {/* ================================================= */}

      <div className="tablaVariantes__cabeceraLista">
        <div>
          <h3>
            Variantes registradas
          </h3>

          <span>
            {variantes.length}{' '}
            {variantes.length === 1
              ? 'variante'
              : 'variantes'}
          </span>
        </div>


        <button
          type="button"
          className="tablaVariantes__agregarManual"
          onClick={
            agregarVarianteManual
          }
        >
          <Plus size={16} />

          VARIANTE MANUAL
        </button>
      </div>


      {/* ================================================= */}
      {/* LISTADO                                          */}
      {/* ================================================= */}

      {variantes.length === 0 ? (
        <div className="tablaVariantes__vacio">
          <p>
            Aún no registraste variantes.
          </p>

          <span>
            Usa el generador superior para
            crear varias tallas de un mismo
            color de una sola vez.
          </span>
        </div>
      ) : (
        <div className="tablaVariantes__contenedor">
          <div className="tablaVariantes__fila tablaVariantes__fila--cabecera">
            <span>
              Talla
            </span>

            <span>
              Color
            </span>

            <span>
              SKU / Código
            </span>

            <span>
              Disponibilidad
            </span>

            <span>
              Oferta
            </span>

            <span>
              Precio oferta
            </span>

            <span />
          </div>


          {variantes.map(
            (
              variante,
              indice
            ) => {
              const precioOferta =
                Number(
                  variante.precio_oferta
                );

              const precioBaseNumero =
                Number(
                  precioBase
                );

              const ofertaInvalida =
                variante.en_oferta &&
                (
                  !Number.isFinite(
                    precioOferta
                  ) ||
                  precioOferta <= 0 ||
                  (
                    Number.isFinite(
                      precioBaseNumero
                    ) &&
                    precioBaseNumero >
                      0 &&
                    precioOferta >=
                      precioBaseNumero
                  )
                );


              return (
                <div
                  key={
                    variante.id
                  }
                  className="tablaVariantes__fila"
                >

                  {/* TALLA */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="Talla"
                  >
                    <select
                      value={
                        variante.talla
                      }
                      onChange={
                        (evento) =>
                          actualizarVariante(
                            variante.id,
                            'talla',
                            evento.target
                              .value
                          )
                      }
                    >
                      {TALLAS.map(
                        (talla) => (
                          <option
                            key={
                              talla
                            }
                            value={
                              talla
                            }
                          >
                            {talla}
                          </option>
                        )
                      )}
                    </select>
                  </div>


                  {/* COLOR */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="Color"
                  >
                    <input
                      type="text"
                      value={
                        variante.color_estampado
                      }
                      onChange={
                        (evento) =>
                          actualizarVariante(
                            variante.id,
                            'color_estampado',
                            evento.target
                              .value
                          )
                      }
                      placeholder="Negro"
                    />
                  </div>


                  {/* SKU */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="SKU / Código"
                  >
                    <input
                      type="text"
                      value={
                        variante.cod_producto
                      }
                      onChange={
                        (evento) =>
                          actualizarVariante(
                            variante.id,
                            'cod_producto',
                            evento.target
                              .value
                          )
                      }
                      placeholder="SKU automático"
                      autoComplete="off"
                      spellCheck="false"
                    />

                    <small className="tablaVariantes__ayudaSku">
                      {variante.sku_manual
                        ? 'Código personalizado para Kraken'
                        : 'Generado automáticamente'}
                    </small>

                    {variante.sku_manual && (
                      <button
                        type="button"
                        onClick={() =>
                          restaurarSkuAutomatico(
                            variante.id
                          )
                        }
                        title="Volver a generar el código usando nombre, color y talla"
                        style={{
                          marginTop:
                            '4px',

                          display:
                            'inline-flex',

                          alignItems:
                            'center',

                          gap:
                            '4px',

                          color:
                            'var(--color-texto-mudo)',

                          fontSize:
                            '0.58rem',
                        }}
                      >
                        <RotateCcw
                          size={11}
                        />

                        VOLVER A AUTOMÁTICO
                      </button>
                    )}
                  </div>


                  {/* DISPONIBILIDAD */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="Disponibilidad"
                  >
                    <label className="formSwitch formSwitch--compacto">
                      <input
                        type="checkbox"
                        checked={
                          variante.disponible ===
                          true
                        }
                        onChange={
                          (evento) =>
                            actualizarVariante(
                              variante.id,
                              'disponible',
                              evento.target
                                .checked
                            )
                        }
                      />

                      <span className="formSwitch__control" />

                      <small>
                        {variante.disponible
                          ? 'Disponible'
                          : 'Agotado'}
                      </small>
                    </label>
                  </div>


                  {/* OFERTA */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="Oferta"
                  >
                    <label className="formSwitch formSwitch--compacto">
                      <input
                        type="checkbox"
                        checked={
                          variante.en_oferta ===
                          true
                        }
                        onChange={
                          (evento) =>
                            actualizarVariante(
                              variante.id,
                              'en_oferta',
                              evento.target
                                .checked
                            )
                        }
                      />

                      <span className="formSwitch__control" />
                    </label>
                  </div>


                  {/* PRECIO OFERTA */}

                  <div
                    className="tablaVariantes__celda"
                    data-label="Precio oferta"
                  >
                    <div className="tablaVariantes__precioInput">
                      <span>
                        Bs.
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                          variante.precio_oferta ??
                          ''
                        }
                        disabled={
                          !variante.en_oferta
                        }
                        onChange={
                          (evento) =>
                            actualizarVariante(
                              variante.id,
                              'precio_oferta',
                              evento.target
                                .value
                            )
                        }
                        placeholder="0.00"
                        className={
                          ofertaInvalida
                            ? 'tablaVariantes__inputError'
                            : ''
                        }
                      />
                    </div>

                    {ofertaInvalida && (
                      <small className="tablaVariantes__error">
                        Debe ser menor al precio base.
                      </small>
                    )}
                  </div>


                  {/* ELIMINAR */}

                  <div className="tablaVariantes__eliminarCelda">
                    <button
                      type="button"
                      className="tablaVariantes__eliminar"
                      onClick={() =>
                        eliminarVariante(
                          variante.id
                        )
                      }
                      aria-label={
                        `Eliminar variante ${indice + 1}`
                      }
                      title="Eliminar variante"
                    >
                      <Trash2
                        size={17}
                      />
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

export default TablaVariantesProducto;
