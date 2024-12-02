import { PieGraph } from "@/components/graphs/pieGraph";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Card } from "@/components/ui/card";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { useState } from "react";
import { DataTable } from "@/components/dataTable/components/data-table";
import { MyAssetsColumns } from "@/components/dataTable/components/columns/MyAssetsColumns";
import { propertyType } from "@/components/dataTable/data/data";

interface Investment {
  id:number,
  first_image: string;
  title: string;
  user_tokens: number;
  projected_rental_yield: number;
  price: number;
  location: string;
  tokens: Array<{ total_tokens: number }>;
  updated_at: string;
  property_type: string;
  ocupancy_status: string;
  property_types: Array<{ item: string, percentage: number, fill: string }>;
  performance_status: string,
  cap_rate: string,
  price_change:string
}

export const Assests = () => {

  const filterOptions = [
    { column: "propertyType", title: "Property Type", options: propertyType },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab
  // State to store the investment data
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investor-assets/`;


  const { data: investments, loading, error } = useGetAxiosRequest<{properties: Investment[];property_types: Array<{ item: string, percentage: number, fill: string }>;}>(apiUrl, true);

  if (loading) return <div><LoadingSpinner /></div>;
  console.log(investments);
  
  if (error) return <p>Error: {error}</p>;
  

  // Ensure investments is defined and has the expected structure
  const properties = investments?.properties || [];
  const propertyTypes = investments?.property_types || [];
  
  const assetsData = properties.map((property) => ({
    id: property.id,
    image: property.first_image,
    location: property.location,
    title: property.title,
    user_tokens: property.user_tokens,
    price: property.price || 0, // Renombrado a 'price' para coincidir con el accessorKey
    priceChart: property.price_change || 2, // Renombrado a 'priceChart' para coincidir con el accessorKey
    yield: property.projected_rental_yield || 0, // Renombrado a 'yield' para coincidir con el accessorKey
    capRate: property.cap_rate || 3.5, // Renombrado a 'capRate' para coincidir con el accessorKey
    occupancyStatus: property.ocupancy_status, // Renombrado a 'occupancyStatus' para coincidir con el accessorKey
    performanceStatus: property.performance_status || "", // Puedes definir un valor por defecto si no lo tienes
    propertyType: property.property_type, // Puedes agregar esto si tienes un tipo de propiedad
    totalTokens: property.tokens[0].total_tokens || 0, // Renombrado a 'totalTokens' para coincidir con el accessorKey
  }));
  

  const tabs =["My Assets"]

  const tabComponents = [
    <DataTable isDownloadable={true} columns={MyAssetsColumns} filterOptions={filterOptions} data={assetsData} />,
  ];

  const handleTabChange = (index: number) => {
    setActiveIndex(index); // Actualizar el índice activo
  };

  return (
    <div className="rounded-lg px-4">
      <Card className="grid lg:grid-cols-2 bg-white flex items-center justify-between rounded-lg">
        <div className="space-y-3 text-left ml-4 p-4">
          <p className="text-gray-500 text-medium">Total Properties Owned</p>
          <span className="text-2xl font-bold">{properties.length}</span>
          <p className="text-gray-500 text-medium">Projected Rental Yield</p>
          <span className="text-2xl font-bold">12.6%</span>
        </div>

        {/* Render PieGraph only if propertyTypes has data */}
        {propertyTypes.length > 0 && (
          <PieGraph
            customHeight="h-[130px]"
            customRadius="18"
            data={propertyTypes} // Pass the correct data here
            title="Property Types"
            footerDescription="Showing total properties based on the property type"
          />
        )}
      </Card>
        <DataAccordion tabs={tabs} components={tabComponents} onTabChange={handleTabChange}/>
    </div>
  );
};

