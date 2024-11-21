import { TradingHeader } from "./TradingHeader";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { SelltabInvestor } from "./Selltab";
import { BuytabInvestor } from "./Buytab";
import { useState } from "react";

export const TradingPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab


  const handleTabChange = (index: number) => {
    setActiveIndex(index); // Actualizar el índice activo
  };


  const tabs = ['Sell', 'Buy', 'Offer Made', 'Offer Given']; // Nombres de las pestañas
  const components = [
    <SelltabInvestor key="sell" />,
    <BuytabInvestor key="buy" />
  ]; 

  return (
    <section className="space-y-10">
      <TradingHeader />
      <DataAccordion  onTabChange={handleTabChange} tabs={tabs} components={components} />
    </section>
  );
};
