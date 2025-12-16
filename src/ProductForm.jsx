// src/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [tieneVencimiento, setTieneVencimiento] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '', 
    precio_compra: '',
    precio_venta: '',
    stock_actual: '',
    stock_minimo: '5',
    fecha_vencimiento: ''
  });

  // 1. Cargar las categorías (CORREGIDO AHORA SÍ)
  useEffect(() => {
    async function fetchCategories() {
      try {
        // --- CAMBIO AQUÍ: 'tipos-producto' con guion medio y plural ---
        const res = await api.get('tipos-producto/'); 
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const empresaId = localStorage.getItem('empresa_id');
      
      const payload = {
        ...formData,
        empresa: empresaId,
        tipo: formData.tipo ? parseInt(formData.tipo) : null,
        fecha_vencimiento: tieneVencimiento ? formData.fecha_vencimiento : null
      };

      await api.post('products/', payload);
      alert('¡Producto guardado exitosamente!');
      navigate('/inventario');
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  }

  // Estilos
  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' };
  const cardStyle = { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '20px auto' };

  return (
    <div style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      <div style={cardStyle}>
        <h2 style={{ color: '#0b5cff', marginTop: 0 }}>Nuevo Producto</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Ingresa los detalles del artículo.</p>

        <form onSubmit={handleSubmit}>
          
          {/* NOMBRE */}
          <div>
            <label style={labelStyle}>Nombre del Producto:</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Martillo, Leche..."
              style={inputStyle}
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          {/* CATEGORÍA */}
          <div>
            <label style={labelStyle}>Categoría:</label>
            <select 
              style={inputStyle}
              value={formData.tipo}
              onChange={e => setFormData({...formData, tipo: e.target.value})}
            >
              <option value="">-- Sin categoría --</option>
              {categories.map(cat => (
                <option key={cat.id_tipo} value={cat.id_tipo}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <small style={{display:'block', marginTop: '-10px', marginBottom: '15px', color:'#f57c00'}}>
                ⚠️ No se encontraron categorías cargadas.
              </small>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* PRECIOS */}
            <div>
              <label style={labelStyle}>Precio Compra ($):</label>
              <input 
                type="number" required placeholder="0" style={inputStyle}
                value={formData.precio_compra}
                onChange={e => setFormData({...formData, precio_compra: e.target.value})}
              />
            </div>
            <div>
              <label style={labelStyle}>Precio Venta ($):</label>
              <input 
                type="number" required placeholder="0" style={inputStyle}
                value={formData.precio_venta}
                onChange={e => setFormData({...formData, precio_venta: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {/* STOCKS */}
            <div>
              <label style={labelStyle}>Stock Inicial:</label>
              <input 
                type="number" required placeholder="0" style={inputStyle}
                value={formData.stock_actual}
                onChange={e => setFormData({...formData, stock_actual: e.target.value})}
              />
            </div>
            <div>
              <label style={labelStyle}>Alerta Stock Bajo:</label>
              <input 
                type="number" required placeholder="5" style={inputStyle}
                value={formData.stock_minimo}
                onChange={e => setFormData({...formData, stock_minimo: e.target.value})}
              />
            </div>
          </div>

          {/* CHECKBOX VENCIMIENTO */}
          <div style={{ background: '#eef2ff', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #d0d7de' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={tieneVencimiento}
                onChange={e => setTieneVencimiento(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontWeight: 'bold', color: '#0b5cff' }}>¿Tiene fecha de vencimiento?</span>
            </label>

            {tieneVencimiento && (
              <div style={{ marginTop: '15px' }}>
                <label style={labelStyle}>Fecha Vencimiento:</label>
                <input 
                  type="date" required={tieneVencimiento}
                  style={{ ...inputStyle, marginBottom: 0 }}
                  value={formData.fecha_vencimiento}
                  onChange={e => setFormData({...formData, fecha_vencimiento: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => navigate('/inventario')}
              style={{ flex: 1, padding: '12px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{ flex: 1, padding: '12px', background: '#0b5cff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}