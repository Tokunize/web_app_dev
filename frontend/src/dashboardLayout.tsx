
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
  ] : role === "blog-admin" ? [
    { name: 'Overview', link: '/blog-overview/' },
    { name: 'All Articles', link: '/articles-list/' },
    { name: 'Create Articles', link: '/create-article/' },
  ]:[];

  return (
    <div className="flex min-h-screen">
      <SideMenu data={menuData} onMenuClick={() => {}} />
      <div className="flex-grow p-5 mt-[60px] md:mt-0">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
