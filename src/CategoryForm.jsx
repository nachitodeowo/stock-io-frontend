// src/CategoryForm.jsx
import React, { useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';


export default function CategoryForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    es_perecedero: false 
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ESTA ES LA URL CORRECTA (con guion medio)
      await api.post('tipos-producto/', formData);
      
      alert('¡Categoría creada exitosamente!');
      navigate('/inventario');

    } catch (err) {
      console.error(err);
      // Este mensaje saldrá si intentas crear una que ya existe (Ej: "Herramientas")
      alert('No se pudo crear la categoría. Verifique que no exista ya.');
    } finally {
      setLoading(false);
    }
  }

  // Estilos
  const cardStyle = { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '500px', margin: '40px auto' };
  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '15px' };

  return (
    <div style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      <div style={cardStyle}>
        <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Nueva Categoría</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Crea una nueva clasificación para tus productos.</p>

        <form onSubmit={handleSubmit}>
          
          {/* NOMBRE */}
          <div>
            <label style={labelStyle}>Nombre de la Categoría:</label>
            <input 
              type="text" 
              required
              placeholder="Ej: Lácteos, Herramientas..."
              style={inputStyle}
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label style={labelStyle}>Descripción:</label>
            <textarea 
              rows="3"
              placeholder="Descripción opcional..."
              style={inputStyle}
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          {/* CHECKBOX */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <input 
                type="checkbox"
                id="perecedero"
                checked={formData.es_perecedero}
                onChange={e => setFormData({...formData, es_perecedero: e.target.checked})}
                style={{ width: '18px', height: '18px' }}
             />
             <label htmlFor="perecedero" style={{ cursor: 'pointer', color: '#555' }}>
                ¿Los productos de esta categoría suelen vencerse?
             </label>
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
              style={{ flex: 1, padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Guardando...' : 'Guardar Categoría'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}