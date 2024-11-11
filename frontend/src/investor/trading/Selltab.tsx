import { DataTable } from "@/dataTable/components/data-table";
import { BuyTradingColumns } from "@/dataTable/components/columns/BuyTradingColumns";
import { tradingSchema } from "@/dataTable/data/schema";
import { z } from "zod";
import { propertyType, performanceStatus } from "@/dataTable/data/data";


// Define el array de propiedades y usa zod para validarlo
export const properties = [
  {
    id: "64",
    price: 22500000,
    priceChart: 3.4,
    title: "AI Data Center",
    image: "https://images.unsplash.com/photo-1603573355706-3f15d98cf100?q=80&w=2829&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Malibu, CA",
    status: "For Sale",
    occupancyStatus:"Contruction",
    yield: "8.2%",
    capRate: "6.5%",
    totalTokens: 10000,
    propertyType: "office",
    availableTokens: 2500,
    performanceStatus: "Worst Performance"

  },
  {
    id: "65",
    title: "Luxury Apartments",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "London, UK",
    price: 8500000,
    priceChart: -3.4,
    occupancyStatus:"Rented",
    yield: "4.5%",
    capRate: "5.1%",
    totalTokens: 7500,
    availableTokens: 3000,
    propertyType: "retail",
    performanceStatus: "Best Performance"

  },
  {
    id: "66",
    title: "Office Space",
    image: "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Aspen, CO",
    price: 14300000,
    capRate: "7.0%",
    priceChart: 3.4,
    occupancyStatus: "Rented",
    totalTokens: 5000,
    availableTokens: 1000,
    propertyType: "office",
    performanceStatus: "Best Performance"
  },
];

// Valida los datos con zod
const parsedProperties = z.array(tradingSchema).parse(properties);


export const SelltabInvestor = () => {

  // Define los filtros que deseas pasar
  const filterOptions = [
    { column: "propertyType", title: "Property Type", options: propertyType },
    { column: "performanceStatus", title: "Performance", options: performanceStatus },
  ];

  return (
    <section className="w-full grid grid-cols-1">
      <DataTable
        filterOptions={filterOptions}
        columns={BuyTradingColumns}
        data={parsedProperties}
      />
    </section>
  );
};