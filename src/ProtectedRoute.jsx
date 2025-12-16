import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Versión simple para desarrollo: permite siempre la navegación
  // Si quieres bloquear en producción, cambia la condición más adelante
  return children;
}


