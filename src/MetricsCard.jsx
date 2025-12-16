// src/MetricsCard.jsx
import React from 'react';

export default function MetricsCard({ title, value, loading }) {
  return (
    <div style={{
      background: 'white',      /* Fondo blanco */
      borderRadius: '8px',      /* Bordes redondeados */
      padding: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)', /* Sombra suave */
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      border: '1px solid #e0e0e0'
    }}>
      {/* TÍTULO: Color gris oscuro (#555) para que se lea bien */}
      <h3 style={{ 
        margin: '0 0 10px 0', 
        fontSize: '14px', 
        color: '#555',         /* <--- AQUÍ ESTABA EL PROBLEMA */
        textTransform: 'uppercase',
        fontWeight: '600'
      }}>
        {title}
      </h3>

      {/* NÚMERO: Color negro (#222) y grande */}
      <div style={{ 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#222' 
      }}>
        {loading ? '...' : value}
      </div>
    </div>
  );
}