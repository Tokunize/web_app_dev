import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Para obtener los claims de Auth0
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ProtectedRouteProps {
  element: React.ReactElement;
  roleRequired: string;  // Acepta un string que puede contener múltiples roles separados por comas
}

const ProtectedRoute = ({ element, roleRequired }:ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user, getIdTokenClaims, isLoading } = useAuth0();  // Obtenemos los datos de Auth0
  const [userRole, setUserRole] = useState<string | null>(null);  // Estado local para almacenar el rol obtenido
  const { role: reduxRole } = useSelector((state: RootState) => state.user);  // Obtener el rol desde Redux

  // Si está cargando la autenticación, mostramos un mensaje de carga
  if (isLoading) {
    return <div>Loading...</div>; // Aquí puedes poner un spinner o lo que necesites
  }

  // Si no está autenticado, redirigimos al inicio
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  useEffect(() => {
    const fetchRoleFromClaims = async () => {
      if (isAuthenticated && user) {
        try {
          const claims = await getIdTokenClaims();
          const roleFromClaims = claims?.['https://tokunize.com/role'] || 'user'; // Default role
          setUserRole(roleFromClaims); // Guardamos el rol en el estado local
        } catch (error) {
          console.error('Error al obtener los claims del usuario:', error);
        }
      }
    };

    fetchRoleFromClaims();
  }, [isAuthenticated, user, getIdTokenClaims]);

  // Convertir el string de roles requeridos en un array
  const allowedRoles = roleRequired.split(',').map(r => r.trim());

  // Verificar si el rol obtenido desde los claims o Redux está en los roles permitidos
  const currentRole = userRole || reduxRole;  // Primero verificamos el rol de los claims, luego el de Redux

  console.log(currentRole, "eooooooo");
  

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;  // Si el rol coincide, renderiza el componente
};

export default ProtectedRoute;
