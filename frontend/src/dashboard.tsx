import { useUser } from "./context/userProvider";
import { Navigate } from 'react-router-dom'; // Importa Navigate
import { AdminOverview } from "./components/dashboard/adminOverview";
import { OwnerDashboard } from "./components/dashboard/ownerOverview";
import { InvestorOverview } from "./components/dashboard/investorOverview";

const Dashboard = () => {
  const { role, loading } = useUser(); 

  if (loading) {
    return <div>Loading...</div>; 
  }

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
      return <Navigate to="/" />; // Redirigir si no tiene rol
  }
};

export default Dashboard;
