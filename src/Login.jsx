// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // --- BORRAMOS EL MODO PRUEBA: Ahora siempre valida con Azure ---

    try {
      // 1. Petición real al Backend para obtener Token
      const res = await api.post('token/', { username, password });
      
      if (res.data.access) {
        localStorage.setItem('token', res.data.access);
        
        // --- NUEVO: Pedimos los datos del usuario y empresa ---
        // Como ya guardamos el token arriba, la api lo usará automáticamente
        const infoRes = await api.get('user-info/');
        
        // Guardamos los datos bonitos
        localStorage.setItem('usuario_nombre', infoRes.data.username);
        localStorage.setItem('empresa_nombre', infoRes.data.empresa); 

        console.log("Login exitoso:", infoRes.data);
        navigate('/inicio');
      } else {
        setError('El servidor no devolvió el token.');
      }

    } catch (err) {
      console.error('Error Login:', err);
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  // --- ESTILOS (Iguales que antes) ---
  const pageStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' };
  const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' };
  const inputStyle = { width: '100%', padding: '12px', marginTop: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '16px' };
  const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        
        {/* LOGO STOCK.IO */}
        {/* <img src="/Logo.png" alt="Stock.IO" style={{ width: '300px', marginBottom: '40px' }} /> */}
        <h1 style={{color: '#2c3e50', marginBottom: '30px'}}>Stock.IO</h1>

        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Iniciar Sesión</h2>
        <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '30px' }}>
          Ingrese sus credenciales para acceder
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#333' }}>Usuario:</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ej: ignacio"
              autoComplete="username"
              style={inputStyle}
              required
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: '600', color: '#333' }}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#e74c3c', marginBottom: '15px', fontSize: '14px', background: '#fadbd8', padding: '10px', borderRadius: '4px' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

      </div>
    </div>
  );
}