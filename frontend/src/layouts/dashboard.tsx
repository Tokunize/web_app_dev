import { useUser } from "../context/userProvider";
import { Navigate } from 'react-router-dom'; // Importa Navigate
import { AdminOverview } from "@/private/admin/adminOverview";
import { OwnerDashboard } from "@/private/owner/ownerOverview";
import { InvestorOverview } from "@/private/investor/overview/investorOverview";

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
