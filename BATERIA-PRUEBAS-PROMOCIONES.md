# Batería de pruebas — promociones CHAPACO SPORT

## Preparación

Utiliza como mínimo cuatro productos activos. Para simplificar las cuentas, puedes asignar temporalmente precios de Bs. 200 a tres productos y Bs. 100 a un cuarto. Pon nombres fáciles de reconocer a las promociones temporales, por ejemplo **PRUEBA - Pack 3x550**.

## Prueba 1 — Porcentaje desde una cantidad

- Modalidad: Desde X prendas: aplicar % a todas las que cumplan.
- Cantidad mínima: 2.
- Descuento: 10%.
- Selecciona una marca o categoría que tengan al menos tres productos.
- Con 1 unidad: no debe aplicar descuento y debe indicar que falta 1.
- Con 2 unidades de Bs. 200: debe descontar Bs. 40 y cobrar Bs. 360.
- Con 3 unidades de Bs. 200: debe descontar Bs. 60 y cobrar Bs. 540.

## Prueba 2 — Cantidad limitada

- Modalidad: Solo X prendas: aplicar % únicamente a ese grupo.
- Prendas por pack: 3.
- Descuento: 10%.
- Repetible: desactivado.
- Con cuatro productos de Bs. 200: solo tres reciben descuento.
- Resultado esperado: subtotal Bs. 800, descuento Bs. 60, total Bs. 740.

## Prueba 3 — Cantidad limitada repetible

- Utiliza la promoción anterior y activa **Repetir beneficio**.
- Con seis unidades de Bs. 200 se forman dos packs.
- Resultado esperado: subtotal Bs. 1.200, descuento Bs. 120, total Bs. 1.080.

## Prueba 4 — Pack a precio fijo

- Modalidad: X prendas por un precio total fijo.
- Prendas por pack: 3.
- Precio final: Bs. 550.
- Agrega tres productos de Bs. 200.
- Resultado esperado: subtotal Bs. 600, descuento Bs. 50, total Bs. 550.
- Agrega una cuarta prenda de Bs. 100 con repetición desactivada.
- Resultado esperado: total Bs. 650.

## Prueba 5 — Productos específicos obligatorios

- Selecciona tres productos distintos.
- Activa **Exigir al menos una unidad de cada producto seleccionado**.
- Prendas por pack: 3; precio final: Bs. 550.
- Con solo dos de los productos: el pack no debe activarse.
- Al agregar el tercero: debe activarse.
- Repetir dos unidades del mismo producto no debe reemplazar al producto obligatorio faltante.

## Prueba 6 — Lleva X y paga Y

- Modalidad: Lleva X prendas y paga solamente Y.
- Lleva: 3; paga: 2.
- Con tres productos de Bs. 200: descuento Bs. 200 y total Bs. 400.
- Con repetición desactivada, una cuarta unidad queda a precio normal.

## Prueba 7 — Filtros combinados

- Selecciona una marca, una categoría, una talla y un color existentes.
- Comprueba que `/promociones` muestre únicamente productos con una variante disponible que cumpla los filtros.
- Un producto que incumpla cualquiera de los filtros no debe contar para completar el pack.

## Prueba 8 — Código de descuento

- Código: `PRUEBA10`.
- Descuento: 10%.
- Compra mínima: Bs. 500.
- Con subtotal Bs. 400: debe rechazarse y explicar la compra mínima.
- Con subtotal Bs. 600: debe descontar Bs. 60.
- Desactiva el código: debe ser rechazado.

## Prueba 9 — Código combinado

- Activa un pack y aplica un código con **Permitir combinar** desactivado: debe rechazarse.
- Activa **Permitir combinar**: primero se descuenta el pack y después el código sobre el saldo.
- El mensaje de WhatsApp debe mostrar subtotal, nombre del pack, código, cada descuento y total final.

## Prueba 10 — Vigencia y presentación

- Prueba una promoción indefinida.
- Prueba solo fecha de inicio futura: todavía no debe mostrarse.
- Prueba solo fecha final vencida: no debe mostrarse.
- Prueba ambas fechas vigentes: debe mostrarse en Inicio y `/promociones`.
- Revisa escritorio y celular: apertura de productos, buscador, tarjetas y carrito.

## Limpieza antes de entregar

1. Entra en **Admin → Promociones**.
2. En **Promociones creadas**, elimina individualmente cada registro temporal con el botón de papelera.
3. En **Códigos creados**, elimina individualmente los códigos temporales.
4. Comprueba que solo queden las promociones y códigos reales del negocio.
5. Borra o reemplaza productos e imágenes ficticias desde los módulos administrativos existentes.
6. Ejecuta `npm run build` y `firebase deploy --only hosting --project chapacosport-1468a`.
