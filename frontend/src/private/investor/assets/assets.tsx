import { useState } from "react";
import { AssetsAccordion } from "@/components/dashboard/assetsAccordion";
import { PieGraph } from "@/components/graphs/pieGraph";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Card } from "@/components/ui/card";

interface Investment {
  first_image: string;
  title: string;
  user_tokens: Array<{ number_of_tokens: number }>;
  projected_rental_yield: number;
  price: number;
  location: string;
  tokens: Array<{ total_tokens: number }>;
  updated_at: string;
  property_type: string;
}

export const Assests = () => { 
  // Estado para guardar los datos de inversiones
  const [investments, setInvestments] = useState<Investment[]>([]);
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment/`;
  const { loading, error } = useGetAxiosRequest<Investment[]>(
    apiUrl,
    (data) => {
      setInvestments(data); // Guarda las inversiones cuando la solicitud sea exitosa
    },
    (errorMessage) => {
      console.error("Failed to fetch investments:", errorMessage);
    }
  );

  // Lista de colores predefinidos
  const predefinedColors = [
    "#299D90",
    "#C3DF6D",
    "#667085", // Color 1
    "#EAFBBE", // Color 2
    "#D0D5DD", // Color 3
    "#83A621", // Color 4
    "#C8E870", // Color 5
    "#A6F4C5", // Color 6
    "#FFFAEA"  // Color 7
  ];

  

  // Paso 1: Extrae todos los tipos de propiedad (o vacío si no hay) en un array
const propertyTypeData = investments.map((property) => property.property_type || "");

// Paso 2: Filtra los tipos de propiedad únicos
const uniquePropertyTypes = [...new Set(propertyTypeData)];

// Paso 3: Calcula el total de tipos de propiedad únicos
const totalPropertyTypes = uniquePropertyTypes.length;

// Paso 4: Genera los datos para `propertyChartData` usando solo tipos únicos
const propertyChartData = uniquePropertyTypes.map((type, index) => ({
  location: type,
  percentage: Math.round((1 / totalPropertyTypes) * 100),
  fill: predefinedColors[index % predefinedColors.length], // Usamos los colores predefinidos
}));

  if (loading) return <div><LoadingSpinner/></div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="rounded-lg px-4">
      <Card className="grid lg:grid-cols-2 bg-white flex items-center justify-between rounded-lg">
          <div className="space-y-3 text-left  ml-4 p-4">
            <p className="text-gray-500 text-medium">Total Properties Owned</p>
            <span className="text-2xl font-bold">{investments?.length}</span>
            <p className="text-gray-500 text-medium">Projected Rental Yield</p>
            <span className="text-2xl font-bold">12.6%</span>
          </div>
          <PieGraph
            data={propertyChartData}
            title="Property Types"
            footerDescription="Showing total properties based on the property type"
          />
      </Card>
     
      <AssetsAccordion data={investments} />
    </div>
  );
};
