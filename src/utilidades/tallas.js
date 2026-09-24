export const TALLAS_ESTANDAR = [
  'XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL',
  'XXL', '2XL', 'XXXL', '3XL', '4XL', '5XL', '6XL',
  'TALLA ÚNICA',
];

const normalizar = (valor = '') => String(valor).trim().toUpperCase();

const rangos = new Map([
  ['XXXS', 10], ['XXS', 20], ['XS', 30], ['S', 40], ['M', 50],
  ['L', 60], ['XL', 70], ['XXL', 80], ['2XL', 80],
  ['XXXL', 90], ['3XL', 90], ['4XL', 100], ['5XL', 110], ['6XL', 120],
  ['ÚNICA', 900], ['UNICA', 900], ['TALLA ÚNICA', 900], ['TALLA UNICA', 900],
]);

export const compararTallas = (a, b) => {
  const tallaA = normalizar(a);
  const tallaB = normalizar(b);
  const rangoA = rangos.get(tallaA);
  const rangoB = rangos.get(tallaB);

  if (rangoA !== undefined || rangoB !== undefined) {
    if (rangoA === undefined) return 1;
    if (rangoB === undefined) return -1;
    if (rangoA !== rangoB) return rangoA - rangoB;
  }

  const numeroA = Number(tallaA.replace(',', '.'));
  const numeroB = Number(tallaB.replace(',', '.'));
  if (Number.isFinite(numeroA) && Number.isFinite(numeroB)) {
    return numeroA - numeroB;
  }

  return tallaA.localeCompare(tallaB, 'es', { numeric: true, sensitivity: 'base' });
};

export const ordenarTallas = (tallas = []) =>
  [...tallas].sort(compararTallas);

export const ordenarVariantes = (variantes = []) =>
  [...variantes].sort((a, b) => {
    const porTalla = compararTallas(a?.talla, b?.talla);
    if (porTalla !== 0) return porTalla;
    return String(a?.color_estampado || a?.color || '').localeCompare(
      String(b?.color_estampado || b?.color || ''),
      'es',
      { numeric: true, sensitivity: 'base' }
    );
  });
