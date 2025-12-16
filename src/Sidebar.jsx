// src/Sidebar.jsx
// src/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const loc = useLocation();
  const navigate = useNavigate();
  // Esta función decide si el botón se ve azul (activo) o gris
  const isActive = (path) => loc.pathname.startsWith(path) ? 'nav-item active' : 'nav-item';

  function handleLogout() {
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar">
      
      {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        <img 
            src="/Logo.png" 
            alt="Stock.IO" 
            style={{ width: '100%', maxWidth: '250px', height: 'auto' }} 
        />
      </div>
      {/* --------------------------- */}

      <nav className="nav-links">
        <Link to="/inicio" className={isActive('/inicio')}>Inicio</Link>
        <Link to="/inventario" className={isActive('/inventario')}>Inventario</Link>
        <Link to="/movimientos/nuevo" className={isActive('/movimientos')}>Movimientos</Link>
        <Link to="/reportes" className={isActive('/reportes')}>Reportes</Link>
        <Link to="/config" className={isActive('/config')}>Informacion</Link>
      </nav>
      <div className="user-info">
        <div>Usuario: <strong>{localStorage.getItem('usuario_nombre')} - {localStorage.getItem('empresa_nombre')}</strong></div>
        <button onClick={handleLogout} className="btn-danger">Cerrar sesión</button>
      </div>
    </aside>
  );
}