import { TradingHeader } from "./TradingHeader";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { SelltabInvestor } from "./Selltab";
import { BuyTabInvestor } from "./Buytab";
import { useState } from "react";
import { TradingOffersMade } from "./OffersMadeTab";
import { TraddingOfferGiven } from "./OfferGivenTab";

export const TradingPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab


  const handleTabChange = (index: number) => {
    setActiveIndex(index); // Actualizar el índice activo
  };


  const tabs = ['Buy', 'Sell', 'Received Offers', 'My Selling']; // Nombres de las pestañas
  const components = [
    <BuyTabInvestor key="buy" />,
    <SelltabInvestor key="sell" />,
    <TradingOffersMade key="offersMade" />,
    <TraddingOfferGiven key={"offerGiven"} />
  ]; 

  return (
    <section className="space-y-10">
      <TradingHeader />
      <DataAccordion  onTabChange={handleTabChange} tabs={tabs} components={components} />
    </section>
  );
};
