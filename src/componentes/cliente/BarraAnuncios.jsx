import { usarAnunciosBarra } from '../../hooks/usarAnunciosBarra';
import './BarraAnuncios.css';

function BarraAnuncios() {
  const { anuncios, cargando } = usarAnunciosBarra();

  if (!cargando && anuncios.length === 0) return null;

  const textoUnido = anuncios.join('  ·  ');

  return (
    <div className="barraAnuncios" role="marquee" aria-label="Novedades">
      <div className="barraAnuncios__pista">
        {!cargando && (
          <>
            <span className="barraAnuncios__bloque">
              {textoUnido}
              <span className="barraAnuncios__separadorFinal">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </span>
            <span className="barraAnuncios__bloque" aria-hidden="true">
              {textoUnido}
              <span className="barraAnuncios__separadorFinal">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </span>
            <span className="barraAnuncios__bloque" aria-hidden="true">
              {textoUnido}
              <span className="barraAnuncios__separadorFinal">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </span>
            <span className="barraAnuncios__bloque" aria-hidden="true">
              {textoUnido}
              <span className="barraAnuncios__separadorFinal">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default BarraAnuncios;