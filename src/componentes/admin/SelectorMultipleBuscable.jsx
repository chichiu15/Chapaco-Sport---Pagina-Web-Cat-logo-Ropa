import { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import './SelectorMultipleBuscable.css';

const normalizar = (valor = '') => String(valor).normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();

function SelectorMultipleBuscable({
  etiqueta,
  opciones = [],
  seleccionados = [],
  onChange,
  ayuda = 'Opcional. Puedes seleccionar más de uno.',
  placeholder = 'Buscar…',
}) {
  const [busqueda, setBusqueda] = useState('');
  const opcionesNormalizadas = useMemo(() => opciones.map((opcion) => (
    typeof opcion === 'string'
      ? { id: opcion, nombre: opcion, detalle: '' }
      : opcion
  )), [opciones]);
  const filtradas = useMemo(() => {
    const termino = normalizar(busqueda);
    if (!termino) return opcionesNormalizadas;
    return opcionesNormalizadas.filter((opcion) => normalizar(
      `${opcion.nombre} ${opcion.detalle || ''}`
    ).includes(termino));
  }, [busqueda, opcionesNormalizadas]);
  const mapa = useMemo(() => Object.fromEntries(
    opcionesNormalizadas.map((opcion) => [opcion.id, opcion])
  ), [opcionesNormalizadas]);

  const alternar = (id) => onChange(
    seleccionados.includes(id)
      ? seleccionados.filter((item) => item !== id)
      : [...seleccionados, id]
  );

  return <fieldset className="selectorMultiple">
    <legend>{etiqueta}</legend>
    <div className="selectorMultiple__buscador">
      <Search size={16}/>
      <input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={placeholder}/>
      {busqueda && <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar búsqueda"><X size={15}/></button>}
    </div>

    {seleccionados.length > 0 && <div className="selectorMultiple__chips">
      {seleccionados.map((id) => <button type="button" key={id} onClick={() => alternar(id)}>
        {mapa[id]?.nombre || id}<X size={13}/>
      </button>)}
      <button type="button" className="selectorMultiple__limpiar" onClick={() => onChange([])}>Limpiar todo</button>
    </div>}

    <div className="selectorMultiple__lista">
      {filtradas.length === 0 && <p>No hay coincidencias.</p>}
      {filtradas.map((opcion) => {
        const activo = seleccionados.includes(opcion.id);
        return <button
          type="button"
          key={opcion.id}
          className={activo ? 'seleccionado' : ''}
          onClick={() => alternar(opcion.id)}
        >
          <span className="selectorMultiple__check">{activo && <Check size={14}/>}</span>
          <span><strong>{opcion.nombre}</strong>{opcion.detalle && <small>{opcion.detalle}</small>}</span>
        </button>;
      })}
    </div>
    <small className="selectorMultiple__ayuda">{ayuda} {opcionesNormalizadas.length} disponible(s) desde la base de datos.</small>
  </fieldset>;
}

export default SelectorMultipleBuscable;
