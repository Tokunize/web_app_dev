import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom'; // Importa Navigate
import { AdminOverview } from "@/private/admin/adminOverview";
import { OwnerDashboard } from "@/private/owner/ownerOverview";
import { InvestorOverview } from "@/private/investor/overview/investorOverview";
import { LoadingSpinner } from '@/components/loadingSpinner';

const Dashboard = () => {
  const { role, loading } = useSelector((state: RootState) => state.user);
  
  // Si está cargando, muestra el mensaje de carga
  if (loading) {
    return <LoadingSpinner/>;
  }

  // Si no hay rol, redirige al inicio
  if (!role) {
    return <Navigate to="/" />;
  }

  // Renderiza el componente adecuado según el rol
  switch (role) {
    case 'investor':
      return <InvestorOverview />;
    case 'owner':
      return <OwnerDashboard />;
    case 'admin':
      return <AdminOverview />;
    default:
      return <Navigate to="/" />; // Redirigir si no tiene rol válido
  }
};

export default Dashboard;
