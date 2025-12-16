// src/Navbar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom'; // 👈 Ya no necesitamos 'Link' aquí, solo 'useLocation'

export default function Navbar() {
  const loc = useLocation();
  
  // 👇 1. ESTA ES LA FUNCIÓN NUEVA: Decide el título según dónde estés parado
  const getTitulo = () => {
    const path = loc.pathname; // Esto lee la URL (ej: /inventario)

    if (path === '/' || path.includes('/inicio')) return '🏠 Inicio';
    if (path.includes('/inventario')) return '📦 Gestión de Inventario';
    if (path.includes('/movimientos')) return '⇄ Movimientos';
    if (path.includes('/reportes')) return '📊 Reportes';
    if (path.includes('/configuracion')) return '⚙️ Configuración';
    if (path.includes('/categorias')) return '🏷️ Categorías';
    if (path.includes('/productos')) return '📝 Gestión de Productos';
    
    return 'Stock.IO'; // Título por defecto si no reconoce la ruta
  };

  return (
    <div style={{
      display:'flex', 
      justifyContent:'space-between', 
      alignItems:'center', 
      padding:'12px 25px', // Le di un poquito más de espacio a los lados
      background:'#0b5cff', 
      color:'#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)' // Un toquecito de sombra para que se vea pro
    }}>
      
      {/* 👇 2. AQUÍ ESTÁ EL CAMBIO GRANDE (Lado Izquierdo) */}
      {/* Antes tenías unos <Link>...</Link>. Los borré y puse esto: */}
      
      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
        {getTitulo()}
      </h2>


      {/* Lado Derecho: Usuario (Esto lo dejé IGUALITO a como lo tenías) */}
      <div style={{fontSize:14, fontWeight: '500'}}>
        Usuario: <strong>{localStorage.getItem('usuario_nombre')} - {localStorage.getItem('empresa_nombre')}</strong>
      </div>
      
    </div>
  );
}