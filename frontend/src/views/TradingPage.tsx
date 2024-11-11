import { TradingHeader } from "@/investor/trading/TradingHeader";
import { DataAccordion } from "@/dataAccordion/DataAccordion";
import { SelltabInvestor } from "@/investor/trading/Selltab";
import { BuytabInvestor } from "@/investor/trading/Buytab";

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
