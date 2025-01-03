import { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Importa Navigate
import { AdminOverview } from "@/private/admin/adminOverview"; // Vista para Admin
import { InvestorOverview } from "@/private/investor/overview/investorOverview"; // Vista para Investor
import { LoadingSpinner } from '@/components/loadingSpinner';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Asegúrate de importar RootState correctamente
import { setUserData } from '@/redux/userSlice'; // Importa la acción de Redux

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.user.role); 
  

  // Si está cargando, muestra el mensaje de carga
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si el rol no está en Redux y está autenticado, obtenemos los claims y lo almacenamos
  useEffect(() => {
    if (isAuthenticated && user && !userRole) {
      const syncUserWithRedux = async () => {
        try {
          const claims = await getIdTokenClaims();
          const role = claims?.["https://tokunize.com/role"] || "user"; // Default role si no está disponible
          console.log("Claims obtenidos:", claims);
          console.log("Role del usuario:", role);
          
          // Actualiza el estado global de Redux con el role
          dispatch(setUserData({ role }));
        } catch (error) {
          console.error("Error al obtener los claims del usuario:", error);
        }
      };

      syncUserWithRedux();
    }
  }, [isAuthenticated, user, userRole, getIdTokenClaims, dispatch]);

  // Redirige dependiendo del rol del usuario
  if (userRole === 'user') {
    return <InvestorOverview />; // Vista para usuarios
  }

  if (userRole === 'admin') {
    return <AdminOverview />; // Vista para administradores
  }

  // Si no se encuentra el rol, redirige al inicio
  return <Navigate to="/" />;
};

export default Dashboard;
