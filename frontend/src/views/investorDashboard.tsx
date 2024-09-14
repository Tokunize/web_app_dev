import { useState } from "react";
import SideMenu from "@/components/dashboard/sideMenu";
import DashboardHeader from '@/components/dashboard/dashboardHeader';
import { GeneralDashboard } from "@/components/dashboard/generalDashboard";
import { Investment } from "@/components/dashboard/investment";
import { Transaction } from "@/components/dashboard/transactions";

const menuData = [
  { name: "Overview" },
  { name: "Investments" },
  { name: "Transactions" },
  { name: "Properties" },
  { name: "Settings" },
];

export const InvestorDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Overview");

  const handleMenuClick = (itemName: string) => {
    setSelectedMenuItem(itemName);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Overview":
        return <GeneralDashboard/>;
      case "Investments":
        return <Investment/>;
      case "Transactions":
        return <Transaction/>
      case "Settings":
        return <div>Settings Content</div>;
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


