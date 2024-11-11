import { TradingHeader } from "./TradingHeader";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { SelltabInvestor } from "./Selltab";
import { BuytabInvestor } from "./Buytab";

export const TradingPage = () => {
  const tabs = ['Sell', 'Buy', 'Offer Made', 'Offer Given']; // Nombres de las pestañas
  const components = [
    <SelltabInvestor key="sell" />,
    <BuytabInvestor key="buy" />
  ]; 

  return (
    <section className="space-y-10">
      <TradingHeader />
      <DataAccordion tabs={tabs} components={components} />
    </section>
  );
};
