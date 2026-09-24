import { CARACTERISTICAS } from '../../utilidades/datosEstaticosInicio';
import './FranjaCaracteristicas.css';
 
function FranjaCaracteristicas() {
  return (
    <section className="franjaCaracteristicas" aria-label="Beneficios de comprar en Chapaco Sport">
      {CARACTERISTICAS.map(({ id, Icono, titulo, descripcion }) => (
        <div className="franjaCaracteristicas__item" key={id}>
          <Icono className="franjaCaracteristicas__icono" size={34} strokeWidth={1.75} />
          <div>
            <p className="franjaCaracteristicas__titulo">{titulo}</p>
            <p className="franjaCaracteristicas__descripcion">{descripcion}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
 
export default FranjaCaracteristicas;
 