import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import OrderBook from "./OrderBook";
import { useState } from "react";
import RecentOrders from "./RecentOrders";

export const TradingBooks = () =>{
    const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab

    const handleTabChange = (index: number) => {
        setActiveIndex(index); // Actualizar el índice activoooo
    };

    const tabs = ['Order Book', 'Recent Orders']; // Nombres de las pestañas
    const components = [
        <OrderBook key="order_book" />,
        <RecentOrders key="recent_orders" />
      ]; 

    return(
        <div>
        <DataAccordion onTabChange={handleTabChange}  tabs={tabs} components={components} />
        </div>
    )
}