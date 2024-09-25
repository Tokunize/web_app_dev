import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Button } from "../ui/button";
import { AssetsAccordion } from "./assetsAccordion";
import { PieGraph } from "../graphs/pieGraph";

interface Investment {
  first_image: string;
  title: string;
  user_tokens: Array<{ number_of_tokens: number }>;
  projected_rental_yield: number;
  price: number;
  location: string;
  tokens: Array<{ total_tokens: number }>;
  updated_at: string;
  property_type:string
}

export const Assests = () => {
  const { getAccessTokenSilently } = useAuth0();
 
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getAllInvestedProperties = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment/`;

    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get<Investment[]>(apiUrl, config); // Define el tipo esperado      
      console.log(response.data);
      
      setInvestments(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInvestedProperties();
  }, [getAccessTokenSilently]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const propertyTypeData = investments?.map((property)=>({
  //   property.property_type || []
  // }))


  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getUniqueColors = (count: number) => {
    const colors = new Set<string>();
    while (colors.size < count) {
      colors.add(getRandomColor());
    }
    return Array.from(colors);
  };

  const propertyTypeData = investments.map((property) => 
  property.property_type || ""
  );

  const totalPropertyTypes = propertyTypeData.length;
  const totalLocations = propertyTypeData.length;
  const uniqueColors = getUniqueColors(totalLocations);

  const propertyChartData = propertyTypeData.map((type, index) => ({
    location: type,
    percentage: Math.round((1 / totalPropertyTypes) * 100),
    fill: uniqueColors[index],
  }));

  return (
    <div className="p-6 bg-gray-100  rounded-lg shadow-md">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Invested Properties
        </h1>
        <Button>Back to marketplace</Button>
      </div>
      <div  className=" grid lg:grid-cols-2 bg-white flex items-center shadow-md rounded-lg ">
          <div className="space-y-3 text-left border rounded-lg ml-4 p-4">
            <p className="text-gray-500 text-medium">Total Properties Owned</p>
            <span className="text-2xl font-bold" >{investments?.length}</span>
            <p className="text-gray-500 text-medium">Projected Rental Yield</p>
            <span className="text-2xl font-bold" >12.6%</span>
          </div>
            <PieGraph
              data={propertyChartData}
              title="Property Types"
              footerDescription="Showing total properties based on the property type"
            />
      </div>
      <AssetsAccordion data={investments} />
  </div>
  );
};


