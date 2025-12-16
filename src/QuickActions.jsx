// src/QuickActions.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', height: '100%' }}>
      <h3 style={{ marginTop: 0, color: '#555', fontSize: '16px', textTransform: 'uppercase' }}>
        Accesos rápidos
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {/* BOTÓN INGRESO */}
        <button 
          onClick={() => navigate('/movimientos/nuevo', { state: { tipo: 'ingreso' } })}
          style={{
            background: '#0b5cff', color: 'white', border: 'none', padding: '12px', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            transition: 'background 0.2s'
          }}
        >
          Nuevo Ingreso
        </button>

        {/* BOTÓN SALIDA */}
        <button 
          onClick={() => navigate('/movimientos/nuevo', { state: { tipo: 'salida' } })}
          style={{
            background: '#0b5cff', color: 'white', border: 'none', padding: '12px', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            transition: 'background 0.2s'
          }}
        >
          Nueva Salida
        </button>

        {/* BOTÓN REPORTES */}
        <button 
          onClick={() => navigate('/reportes')}
          style={{
            background: '#0b5cff', color: 'white', border: 'none', padding: '12px', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            transition: 'background 0.2s'
          }}
        >
          Ver Reportes
        </button>
      </div>
    </div>
  );
}