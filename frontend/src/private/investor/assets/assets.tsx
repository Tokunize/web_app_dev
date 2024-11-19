import { PieGraph } from "@/components/graphs/pieGraph";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Card } from "@/components/ui/card";
import { DataAccordion } from "@/components/dataAccordion/DataAccordion";
import { MyAssetsTable } from "@/components/dashboard/myAssetsTable";
import { useState } from "react";

interface Investment {
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
}

export const Assests = () => { 
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to 'Overview' tab
  // State to store the investment data
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investor-assets/`;

  const { data: investments, loading, error } = useGetAxiosRequest<{properties: Investment[];property_types: Array<{ item: string, percentage: number, fill: string }>;}>(apiUrl, true);

  if (loading) return <div><LoadingSpinner /></div>;
  if (error) return <p>Error: {error}</p>;
  

  // Ensure investments is defined and has the expected structure
  const properties = investments?.properties || [];
  const propertyTypes = investments?.property_types || [];
  
  const assetsData = properties.map((property) => ({
    image: property.first_image,
    title: property.title,
    user_tokens: property.user_tokens,
    projected_rental_yield: property.projected_rental_yield || 0, // Default to 0 if null
    net_asset_value: property.price || 0, // Default to 0 if null
    location: property.location,
    total_tokens: property.tokens?.[0]?.total_tokens || 0, // Safeguard access
    ocupancy_status: property.ocupancy_status,
    projected_appreciation: "1.2",
    total_rental_income: 23343,
    price_change: 4.7,
    cap_rate: 3.5,
  }));

  const tabs =["Listing"]

  const tabComponents = [
    <MyAssetsTable  assetsData={assetsData} key="listing" />,
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

