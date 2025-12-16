// src/MovementsForm.jsx
import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MovementsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tipoInicial = location.state?.tipo || 'ingreso';

  const [products, setProducts] = useState([]);
  
  
  const [formData, setFormData] = useState({
    producto: '',        
    tipo_movimiento: tipoInicial, 
    cantidad: '',
    fecha_hora: new Date().toISOString().split('T')[0] 
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const empresaId = localStorage.getItem('empresa_id');
        const res = await api.get(`products/?empresa=${empresaId}`);
        const lista = Array.isArray(res.data) ? res.data : res.data.results;
        setProducts(lista || []);
      } catch (err) {
        console.error("Error cargando productos", err);
      }
    }
    loadProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!formData.producto || !formData.cantidad) {
      alert("Por favor selecciona un producto y una cantidad.");
      setLoading(false);
      return;
    }

    try {
      await api.post('movimientos/', {
        producto: formData.producto,
        tipo_movimiento: formData.tipo_movimiento,
        cantidad: parseInt(formData.cantidad),
        fecha_hora: formData.fecha_hora 
      });
      
      alert(`¡${formData.tipo_movimiento.toUpperCase()} registrado con éxito!`);
      navigate('/inventario'); 
    } catch (err) {
      console.error(err);
      const errorMsg = JSON.stringify(err.response?.data) || "Error al guardar.";
      alert("Error: " + errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const formGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        
        <h2 style={{ color: '#0b5cff', marginTop: 0 }}>
            {formData.tipo_movimiento === 'ingreso' ? '🔼 Registrar Ingreso' : '🔽 Registrar Salida'}
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Actualiza el stock registrando la fecha exacta.
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Campo de Fecha Manual (Necesario para el reporte) */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Fecha del Movimiento:</label>
            <input 
              type="date" 
              style={inputStyle}
              value={formData.fecha_hora}
              onChange={e => setFormData({...formData, fecha_hora: e.target.value})}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Tipo de Movimiento:</label>
            <select 
              style={inputStyle}
              value={formData.tipo_movimiento}
              onChange={e => setFormData({...formData, tipo_movimiento: e.target.value})}
            >
              <option value="ingreso">Ingreso (Compra/Devolución)</option>
              <option value="salida">Salida (Venta/Pérdida)</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Producto:</label>
            <select 
              style={inputStyle}
              value={formData.producto}
              onChange={e => setFormData({...formData, producto: e.target.value})}
              required
            >
              <option value="">-- Selecciona un producto --</option>
              {products.map(p => (
                <option key={p.codigop} value={p.codigop}> 
                  {p.nombre} (Stock: {p.stock_actual})
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Cantidad:</label>
            <input 
              type="number" 
              min="1"
              placeholder="Ej: 10"
              style={inputStyle}
              value={formData.cantidad}
              onChange={e => setFormData({...formData, cantidad: e.target.value})}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/inicio')}
              style={{ flex: 1, padding: '10px', background: '#f1f1f1', color:'#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '10px', background: '#0b5cff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}