import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ProveedorCarrito } from './contextos/ContextoCarrito.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProveedorCarrito>
      <App />
    </ProveedorCarrito>
  </StrictMode>,
);