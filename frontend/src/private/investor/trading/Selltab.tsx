import { DataTable } from "@/components/dataTable/components/data-table";
import { SellTradingColumns } from "@/components/dataTable/components/columns/SellTradingColumns";
import { tradingSchema } from "@/components/dataTable/data/schema";
import { z } from "zod";
import { propertyType, performanceStatus } from "@/components/dataTable/data/data";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "@/components/loadingSpinner";

interface Token {
  total_tokens: number;
  tokens_available: number;
  token_price: number;
}

interface SoldProperty {
  title: string;
  location: string;
  property_type: string;
  price: string;
  first_image: string;
  tokens: Token[];
  reference_number: string;
  status: string;
  ocupancy_status: string;
  projected_rental_yield: string;
  user_tokens: number;
}

export const SelltabInvestor = () => {
  const { data, loading, error } = useGetAxiosRequest<SoldProperty[]>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/invested-properties/`, true
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(data);

  // Asegurarse de que data sea un array vacío si está vacío o no está disponible
  const parsedProperties = z.array(tradingSchema).parse(data || []);

  // Define los filtros que deseas pasar
  const filterOptions = [
    { column: "propertyType", title: "Property Type", options: propertyType },
    { column: "performanceStatus", title: "Performance", options: performanceStatus },
  ];

  return (
    <section className="w-full grid grid-cols-1">
      <DataTable
        filterOptions={filterOptions}
        columns={SellTradingColumns}
        data={parsedProperties}
      />
    </section>
  );
};
