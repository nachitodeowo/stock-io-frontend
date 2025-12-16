// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import MetricsCard from './MetricsCard';
import QuickActions from './QuickActions';
import MovementsTable from './MovementsTable';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    stock_critico: 0, 
    por_vencer_7d: 0, 
    total_productos: 0, 
    movimientos_hoy: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMetrics(); }, []);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const empresaId = localStorage.getItem('empresa_id') || '1';
      
      // ✅ CORRECCIÓN: Usamos el endpoint real que creamos en Django
      const res = await api.get(`products/dashboard_stats/?empresa=${empresaId}`);
      
      if (res && res.data) {
        setMetrics({
          stock_critico: res.data.stock_critico,
          // El backend devuelve "por_vencer", aquí lo asignamos a tu estado "por_vencer_7d"
          por_vencer_7d: res.data.por_vencer, 
          total_productos: res.data.total_productos,
          movimientos_hoy: res.data.movimientos_hoy
        });
      }
    } catch (err) {
      console.error('Error cargando métricas:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Inicio</h1>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
        {/* Pasamos los datos reales a tus tarjetas */}
        <MetricsCard title="Stock Crítico" value={metrics.stock_critico} loading={loading} />
        <MetricsCard title="Por Vencer (7 días)" value={metrics.por_vencer_7d} loading={loading} />
        <MetricsCard title="Total Productos" value={metrics.total_productos} loading={loading} />
        <MetricsCard title="Movimientos Hoy" value={metrics.movimientos_hoy} loading={loading} />
      </section>

      <section style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <div style={{ width: 320 }}>
          <QuickActions />
        </div>
        <div style={{ flex: 1 }}>
          {/* La tabla se maneja sola, o puedes pasarle props si la modificamos abajo */}
          <MovementsTable />
        </div>
      </section>
    </div>
  );
}