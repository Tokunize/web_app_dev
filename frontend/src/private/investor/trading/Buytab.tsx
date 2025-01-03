import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { DataTable } from "@/components/dataTable/components/data-table";
import { BuyTradingColumns } from "@/components/dataTable/components/columns/BuyTradingColumns";
import { tradingSchema } from "@/components/dataTable/data/schema";
import { propertyType, performanceStatus } from "@/components/dataTable/data/data";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { z } from "zod";


// Define el tipo para las propiedades vendidas
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
  projected_rental_yield: string
}


// Define la función que mapea los datos
const mapSoldProperties = (data: SoldProperty[]) => {
  return data.map(property => ({
    id: property.reference_number, // Usamos el reference_number como id
    title: property.title,
    image: property.first_image,
    location: property.location,
    price: parseFloat(property.price), // Convierte el precio a número
    capRate: "3", // Aquí puedes agregar la lógica para calcular o dejar como 'N/A'
    priceChart: 2, // Esta propiedad parece no estar presente en los datos de la API
    occupancyStatus: property.ocupancy_status,
    totalTokens: property.tokens[0]?.total_tokens || 0,
    availableTokens: property.tokens[0]?.tokens_available || 0,
    projectedRentalYield: property.projected_rental_yield || 0,
    propertyType: property.property_type, // Convertir el tipo de propiedad a minúsculas
    performanceStatus:"Best", // O cualquier otra lógica que se ajuste
  }));
};

export const BuyTabInvestor = () => {
  // Aquí indicamos que esperamos un array de SoldProperty[]
  const { data, loading, error } = useGetAxiosRequest<SoldProperty[]>(`${import.meta.env.VITE_APP_BACKEND_URL}property/sold/`, true);

  if (loading) {
    return <LoadingSpinner />;
  }
  console.log(data);
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Mapea los datos de la API
  const mappedProperties = mapSoldProperties(data ?? []);

  // Valida los datos con Zod
  const parsedProperties = z.array(tradingSchema).parse(mappedProperties);

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
