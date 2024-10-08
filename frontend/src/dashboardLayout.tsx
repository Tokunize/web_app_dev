
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./components/dashboard/sideMenu";
import { useUser } from "./context/userProvider";
import wallet from "./assets/cardIcon.svg";
import coin from "./assets/coin.svg";
import overview from "./assets/grid.svg"
import { UserNavbar } from "./components/dashboard/useNavbar";


const DashboardLayout: React.FC = () => {
  const { role } = useUser(); 

  const menuData = role === 'admin' ? [
    { name: 'Overview', link: '/dashboard/', icon: <img src={overview} alt="Overview Icon" className="w-4 h-4 inline" /> },
    { name: 'Property Management', link: '/property-managment/', icon: <img src={wallet} alt="Property Management Icon" className="w-4 h-4 inline" /> },
  ] : role === 'owner' ? [
    { name: 'Overview', link: '/dashboard/', icon: <img src={overview} alt="Overview Icon" className="w-4 h-4 inline" /> },
    { name: 'My Properties', link: '/porfolio/', icon: <img src={coin} alt="Settings Icon" className="w-4 h-4 inline" /> },
  ] : role === 'investor' ? [
    { name: 'Overview', link: '/dashboard/', icon: <img src={overview} alt="Overview Icon" className="w-4 h-4 inline" /> },
    { name: 'Assets', link: '/investments/', icon: <img src={coin} alt="Assets Icon" className="w-4 h-4 inline" /> },
    { name: 'Wallet', link: '/transactions/', icon: <img src={wallet} alt="Wallet Icon" className="w-4 h-4 inline" /> },
  ] : role === "blog-admin" ? [
    { name: 'Overview', link: '/blog-overview/', icon: <img src={overview} alt="Overview Icon" className="w-4 h-4 inline" /> },
    { name: 'All Articles', link: '/articles-list/', icon: <img src={coin} alt="All Articles Icon" className="w-4 h-4 inline" /> },
    { name: 'Create Articles', link: '/create-article/', icon: <img src={wallet} alt="Create Articles Icon" className="w-4 h-4 inline" /> },
  ] : [];

  return (
    <div className="flex min-h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="flex-grow p-5 mt-[60px] md:mt-0">
        <div className="flex justify-end">
          <UserNavbar/>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
