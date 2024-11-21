import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';


interface ProtectedRouteProps {
  element: React.ReactElement;
  roleRequired: string;  // Acepta un string que puede contener múltiples roles separados por comas
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roleRequired }) => {
  const location = useLocation();
  const { role} = useSelector((state: RootState) => state.user);


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
