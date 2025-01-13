import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { OrderBook } from "./orderBook";
import { RecentOrders } from "./recentOrders";
import { TabItem } from "@/types";

export const TradingBooks = () =>{

   
    const tabs: TabItem[] = [
        {
          type: 'text',  
          content: "Order Book" 
        },
        {
          type: 'text', 
          content:"Recent Orders"
        },
      ];

    const components = [
        <OrderBook key="order_book" />,
        <RecentOrders key="recent_orders" />
      ]; 

    return(
        <div>
        <DataAccordion   tabs={tabs} components={components} />
        </div>
    )
}