import React from 'react';
import { cargarCatalogoFirestore } from "../../utilidades/datos/cargarCatalogoFirestore";
export default function PanelPrincipal() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel Principal Admin - perdon adri, necesitaba ver si estaban dando bien las rutas</h1>
          <button
      onClick={async () => {
        const resultado = await cargarCatalogoFirestore();

        if (resultado.ok) {
          alert("Datos cargados correctamente");
        } else {
          alert(`Error: ${resultado.mensaje}`);
        }
      }}
    >
      CARGAR DATOS FIRESTORE
    </button>
      </div>
  );
}