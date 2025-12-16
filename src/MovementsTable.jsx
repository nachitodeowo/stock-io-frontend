// src/MovementsTable.jsx
import React, { useEffect, useState } from 'react';
import api from './api';

export default function MovementsTable() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMovements(); }, []);

  async function fetchMovements() {
    setLoading(true);
    try {
      const empresaId = localStorage.getItem('empresa_id') || '1';
      // Pedimos los últimos 5 movimientos
      const res = await api.get(`movimientos/?empresa=${empresaId}&limit=5`);

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.results)) {
        data = res.data.results;
      } else if (res.data && Array.isArray(res.data.items)) {
        data = res.data.items;
      }

      setMovements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener movimientos', err);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background:'#fff', padding:16, borderRadius:8, boxShadow:'0 1px 6px rgba(0,0,0,0.06)' }}>
      <h3>Movimientos recientes</h3>
      {loading ? <p>Cargando...</p> : (
        <table style={{ width:'100%', borderCollapse:'collapse', marginTop:8 }}>
          <thead>
            <tr style={{ textAlign:'left', borderBottom:'1px solid #eee' }}>
              <th style={{ padding: '8px' }}>Fecha</th>
              <th style={{ padding: '8px' }}>Tipo</th>
              <th style={{ padding: '8px' }}>Producto</th>
              <th style={{ padding: '8px' }}>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 && (
              <tr>
                <td colSpan="4" style={{padding:'10px'}}>No hay movimientos recientes</td>
              </tr>
            )}
            
            {movements.map((m, idx) => {
              const fecha = m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString() : '-';
              const esIngreso = m.tipo_movimiento === 'ingreso';
              const tipoTexto = esIngreso ? '🔼 Ingreso' : '🔽 Salida';
              const tipoColor = esIngreso ? 'green' : 'red';
              
              let nombreProducto = '-';
              if (m.producto_nombre) {
                  nombreProducto = m.producto_nombre;
              } else if (m.producto && typeof m.producto === 'object') {
                  nombreProducto = m.producto.nombre;
              } else if (m.producto) {
                  nombreProducto = m.producto; 
              }
              
              const cantidad = m.cantidad || 0;
              const key = m.id_movimiento || m.id || idx;

              return (
                <tr key={key} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px' }}>{fecha}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: tipoColor }}>{tipoTexto}</td>
                  <td style={{ padding: '8px' }}>{nombreProducto}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{cantidad}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}