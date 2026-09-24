const obtenerPrecioItem = (
  item
) => {
  const precioBase =
    Number(
      item.producto?.precio
    ) || 0;

  const precioOferta =
    Number(
      item.variante?.precio_oferta
    );


  if (
    item.variante?.en_oferta ===
      true &&
    Number.isFinite(
      precioOferta
    )
  ) {
    return precioOferta;
  }


  return precioBase;
};


export const generarMensajePedidoWhatsApp = (
  datosCliente,
  itemsCarrito,
  resumenPrecios
) => {
  const lineasProductos =
    itemsCarrito.map(
      (
        item,
        indice
      ) => {
        const producto =
          item.producto || {};

        const variante =
          item.variante || {};

        const precioUnitario =
          obtenerPrecioItem(
            item
          );

        const subtotalItem =
          precioUnitario *
          item.cantidad;


        return [
          `${indice + 1}. ${producto.nombre || 'Producto'}`,
          `Talla: ${variante.talla || 'No especificada'}`,
          `Color: ${variante.color_estampado || 'No especificado'}`,
          variante.cod_producto
            ? `SKU: ${variante.cod_producto}`
            : null,
          `Cantidad: ${item.cantidad}`,
          `Precio unitario: Bs. ${precioUnitario.toFixed(2)}`,
          `Subtotal: Bs. ${subtotalItem.toFixed(2)}`,
        ]
          .filter(
            Boolean
          )
          .join(
            '\n'
          );
      }
    );


  const observaciones =
    datosCliente
      .observaciones
      ?.trim() ||
    'Sin observaciones';

  const resumen = typeof resumenPrecios === 'number'
    ? { subtotal: resumenPrecios, total: resumenPrecios, descuentoPack: 0, descuentoCodigo: 0 }
    : (resumenPrecios || {});

  const lineasDescuentos = [
    `Subtotal: Bs. ${Number(resumen.subtotal || 0).toFixed(2)}`,
    resumen.descuentoPack > 0
      ? `Promoción "${resumen.mejorPack?.pack?.nombre || 'Promoción automática'}" (${resumen.mejorPack?.beneficio || 'beneficio automático'}): - Bs. ${Number(resumen.descuentoPack).toFixed(2)}`
      : null,
    resumen.descuentoCodigo > 0
      ? `Código ${resumen.codigo?.codigo || ''}: - Bs. ${Number(resumen.descuentoCodigo).toFixed(2)}`
      : null,
  ].filter(Boolean);


  return [
    'Hola CHAPACO SPORT, quiero realizar el siguiente pedido:',
    '',
    '*PEDIDO:*',
    '------------------------------',
    lineasProductos.join(
      '\n\n'
    ),
    '------------------------------',
    ...lineasDescuentos,
    `*TOTAL: Bs. ${Number(resumen.total || 0).toFixed(2)}*`,
    '',
    '*DATOS DEL CLIENTE*',
    `Nombre: ${datosCliente.nombres.trim()}`,
    `Celular: ${datosCliente.celular.trim()}`,
    `Departamento: ${datosCliente.departamento.trim()}`,
    `Observaciones / entrega: ${observaciones}`,
  ].join(
    '\n'
  );
};


export const generarUrlPedidoWhatsApp = (
  numeroWhatsapp,
  datosCliente,
  itemsCarrito,
  resumenPrecios
) => {
  const numeroLimpio =
    String(
      numeroWhatsapp || ''
    )
      .replace(
        /\D/g,
        ''
      )
      .trim();


  if (
    !numeroLimpio
  ) {
    throw new Error(
      'No existe un número de WhatsApp válido para enviar el pedido.'
    );
  }


  const mensaje =
    generarMensajePedidoWhatsApp(
      datosCliente,
      itemsCarrito,
      resumenPrecios
    );


  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(
    mensaje
  )}`;
};


export const abrirPedidoEnWhatsApp = (
  numeroWhatsapp,
  datosCliente,
  itemsCarrito,
  resumenPrecios
) => {
  const url =
    generarUrlPedidoWhatsApp(
      numeroWhatsapp,
      datosCliente,
      itemsCarrito,
      resumenPrecios
    );


  window.open(
    url,
    '_blank',
    'noopener,noreferrer'
  );
};
