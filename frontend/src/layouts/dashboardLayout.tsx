import  { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Para obtener los claims de Auth0
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice"; // Importa la acción para guardar el rol en Redux
import SideMenu from "@/components/dashboard/sideMenu";
import { UserNavbar } from "@/components/dashboard/useNavbar";
import { ChartCandlestick } from "lucide-react";
import { WalletMinimal, Coins, Grid2x2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loadingSpinner";

const DashboardLayout = () => {
  const { user, isAuthenticated, getIdTokenClaims, isLoading } = useAuth0(); // Obtén los datos de Auth0
  const dispatch = useDispatch();
  
  // Estado local para almacenar el rol
  const [role, setRole] = useState<string | null>(null);

  // Esta función obtiene el rol desde los claims de Auth0 y lo guarda en Redux
  const syncRoleWithRedux = async () => {
    if (isAuthenticated && user) {
      try {
        const claims = await getIdTokenClaims();
        const userRole = claims?.["https://tokunize.com/role"] || "user"; // Asigna el rol desde los claims o un valor por defecto
        setRole(userRole); // Guarda el rol en el estado local
        dispatch(setUserData({ role: userRole })); // Guarda el rol en Redux
      } catch (error) {
        console.error("Error fetching user claims:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      syncRoleWithRedux(); // Llama a la función para sincronizar el rol al montar el componente
    }
  }, [isAuthenticated, user, getIdTokenClaims, dispatch]); // Dependencias para cuando el usuario cambia o los datos de autenticación cambian

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><LoadingSpinner/></div>; // Aquí puedes poner un spinner o cualquier otro componente de carga
  }

  const menuData =
    role === "admin"
      ? [
          { name: "Overview", link: "/dashboard/", icon: <Grid2x2 /> },
          { name: "Property Management", link: "/property-managment/", icon: <Grid2x2 /> },
        ]
      : role === "user"
      ? [
          { name: "Overview", link: "/dashboard/", icon: <Grid2x2 /> },
          { name: "Assets", link: "/investments/", icon: <Coins /> },
          { name: "Wallet", link: "/transactions/", icon: <WalletMinimal /> },
          { name: "Trade", link: "/trading/", icon: <ChartCandlestick /> },
        ]
      : [];

  return (
    <div className="flex min-h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="flex-grow px-7 py-4 mt-[64px] md:mt-[0px]">
        <div className="flex items-center justify-end mb-5 px-[20px]">
          <UserNavbar />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
