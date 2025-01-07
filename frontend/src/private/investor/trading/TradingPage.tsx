import { TradingHeader } from "./TradingHeader";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { SelltabInvestor } from "./Selltab";
import { BuyTabInvestor } from "./Buytab";
import { TradingOffersMade } from "./OffersMadeTab";
import { TraddingOfferGiven } from "./OfferGivenTab";
import { TabItem } from "@/types";

export const TradingPage = () => {

  const tabs: TabItem[] = [
    {type : "text" , content : "Buy"},
    {type : "text" , content : "Sell"},
    {type : "text" , content : "Received Offers"},
    {type : "text" , content : "My Selling"}
  ]


  const components = [
    <BuyTabInvestor key="buy" />,
    <SelltabInvestor key="sell" />,
    <TradingOffersMade key="offersMade" />,
    <TraddingOfferGiven key={"offerGiven"} />
  ]; 

  return (
    <section className="space-y-10">
      <TradingHeader />
      <DataAccordion  tabs={tabs} components={components} />
    </section>
  );
};
