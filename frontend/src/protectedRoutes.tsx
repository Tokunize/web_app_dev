import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/userProvider';

interface ProtectedRouteProps {
  element: React.ReactElement;
  roleRequired: string; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, roleRequired }) => {
  const { role } = useUser();  
  const location = useLocation();

  if (!role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const allowedRoles = roleRequired.split(',').map(r => r.trim());

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
