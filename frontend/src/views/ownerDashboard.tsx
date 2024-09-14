import { useState } from "react";
import SideMenu from "@/components/dashboard/sideMenu";
import DashboardHeader from '@/components/dashboard/dashboardHeader';
import { Porfolio } from "@/components/dashboard/porfolio";
import { GeneralDashboard } from "@/components/dashboard/generalDashboard";

const menuData = [
  { name: "Overview" },
  { name: "Portfolio" },
  { name: "Settings" },
  { name: "Support" },
];

export const OwnerDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Overview");

  const handleMenuClick = (itemName: string) => {
    setSelectedMenuItem(itemName);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Overview":
        return <GeneralDashboard/>;
      case "Portfolio":
        return <Porfolio/>;
      case "Settings":
        return <div>Settings Content</div>;
      case "Support":
        return <div>Support Content</div>;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };

  return (
    <section className="flex min-h-screen">
      <aside>
        <SideMenu data={menuData} onMenuClick={handleMenuClick} />
      </aside>
      <section className="flex-1">
        <DashboardHeader />
        <div className="p-5">
          {renderContent()}
        </div>
      </section>
    </section>
  );
};
