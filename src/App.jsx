// src/App.jsx
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // <--- 1. AGREGAMOS ESTA IMPORTACIÓN
import Login from './Login';
import Dashboard from './Dashboard';
import Inventory from './InventoryTable';
import ProductForm from './ProductForm';
import MovementsForm from './MovementsForm';
import Reports from './Reports';
import Config from './Config';
import ProtectedRoute from './ProtectedRoute';
import CategoryForm from './CategoryForm';

function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Barra lateral izquierda */}
      {!isLogin && <Sidebar />}
      
      {/* Columna derecha (Barra azul + Contenido) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* 2. AGREGAMOS LA BARRA AZUL AQUÍ ARRIBA */}
        {!isLogin && <Navbar />}

        <div style={{ padding: 16, flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="/inventario" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/productos/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
            <Route path="/movimientos/nuevo" element={<ProtectedRoute><MovementsForm /></ProtectedRoute>} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/config" element={<Config />} />
            <Route path="/categorias/nueva" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}