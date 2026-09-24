import './CargandoPagina.css';

function CargandoPagina() {
  return (
    <div className="pantallaCargaGlobal" role="status" aria-live="polite">
      <div className="spinnerGlobal" />
      <span className="sr-only" style={{ display: 'none' }}>Cargando página...</span>
    </div>
  );
}

export default CargandoPagina;