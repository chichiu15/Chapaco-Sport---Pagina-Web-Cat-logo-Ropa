import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion, solicitarCambioPassword } from '../../servicios/admin/authServicio';
import './AdminEstilos.css';

function IniciarSesion() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setCargando(true);

    try {
      await iniciarSesion(correo, password);
      navigate('/admin/panel');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  const manejarOlvidoPassword = async () => {
    if (!correo) {
      setError('Por favor, ingresa tu correo electrónico arriba para enviarte el enlace.');
      return;
    }
    try {
      await solicitarCambioPassword(correo);
      setMensaje('Se ha enviado un enlace a tu correo para restablecer la contraseña.');
      setError('');
    } catch (err) {
      setError('Error al enviar el correo. Verifica que esté bien escrito.');
    }
  };

  return (
    <div className="loginAdmin__contenedor">
      <div className="loginAdmin__capaOscura"></div>
      
      <div className="loginAdmin__tarjeta">
        <h2 className="loginAdmin__titulo">
          CHAPACO SPORT <br/>
          <span>PANEL DE CONTROL</span>
        </h2>
        
        {error && <div className="alerta alerta--error">{error}</div>}
        {mensaje && <div className="alerta alerta--exito">{mensaje}</div>}

        <form onSubmit={manejarSubmit} className="loginAdmin__formulario">
          <div className="grupo-input">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
              placeholder="admin@chapacosport.com"
            />
          </div>
          
          <div className="grupo-input">
            <label>Contraseña</label>
            <div className="input-password-wrapper">
              <input 
                type={mostrarPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
              <button 
                type="button" 
                className="btn-ojito"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primario btn--block" disabled={cargando}>
            {cargando ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <button onClick={manejarOlvidoPassword} className="btn-link">
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}

export default IniciarSesion;