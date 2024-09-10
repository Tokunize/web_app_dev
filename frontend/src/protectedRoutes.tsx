import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/userProvider';

interface ProtectedRouteProps {
  element: React.ReactElement;
  roleRequired: string;  // Acepta un string que puede contener múltiples roles separados por comas
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roleRequired }) => {
  const { role } = useUser();  // Obtener el rol del usuario desde el contexto
  const location = useLocation();

  // Si el rol es null o undefined, tratamos el usuario como no autenticado
  if (!role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Convertimos el string de roles permitidos en un array eliminando espacios en blanco
  const allowedRoles = roleRequired.split(',').map(r => r.trim());

  // Verificar si el rol del usuario está en la lista de roles permitidos
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
