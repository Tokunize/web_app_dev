// components/DashboardLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./components/dashboard/sideMenu";
import { useUser } from "./context/userProvider";

const DashboardLayout: React.FC = () => {
  const { role } = useUser(); 

  const menuData = role === 'admin' ? [
    { name: 'Overview', link: '/overview/' },
    { name: 'Property Managment', link: '/porfolio/' },
    { name: 'Users Managment', link: '/dashboard/settings' },
    { name: 'Settings', link: '/dashboard/settings' },
  ] : role === 'owner' ? [
    { name: 'Overview', link: '/overview/' },
    { name: 'My Properties', link: '/porfolio/' },
    { name: 'Settings', link: '/dashboard/settings' },
  ] : role === 'investor' ? [
    { name: 'Overview', link: '/overview/' },
    { name: 'My Investments', link: '/investments/' },
    { name: 'My Transactions', link: '/transactions/' },
    { name: 'Settings', link: '/dashboard/settings' },
  ] : [];

  return (
    <div className="flex h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="flex-grow p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;