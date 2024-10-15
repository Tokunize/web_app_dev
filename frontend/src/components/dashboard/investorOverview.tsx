"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PropertyValueGraph } from "../graphs/propertyValueGraph";
import { PieGraph } from "../graphs/pieGraph";
import { RiskOverview } from "../graphs/riskGraph";
import { PerformanceGraph } from "../graphs/performanceGraph";
import { MyAssetsTable } from "./myAssetsTable";
import { LoadingSpinner } from "./loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";  // Importamos el hook personalizado

interface Investment {
  properties: {
    location: string;
    yield_data: any; // Ajusta el tipo según tu estructura de datos
    property_type: string;
  }[];
  total_invested: number;
}

export const InvestorOverview = () => {
  const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment-summary/`;
  const { data: investments, loading, error } = useGetAxiosRequest<Investment>(apiUrl);

  if (loading) {
    return <div><LoadingSpinner/></div>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  // Transformamos los datos recibidos para pasarlos a las gráficas y tablas
  const yieldData = investments?.properties.map((property) => ({
    image: property.yield_data.image,
    title: property.yield_data.title,
    projected_rental_yield: property.yield_data.projected_rental_yield,
    projected_appreciation: 1.2,
    location: property.location,
  }));

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

  // Datos para la gráfica de ubicaciones geográficas
  const geographyData = investments?.properties.map(property => property.location) || [];
  const totalLocations = geographyData.length;
  const chartData = geographyData.map((location, index) => ({
    location,
    percentage: Math.round((1 / totalLocations) * 100),
    fill: predefinedColors[index % predefinedColors.length],
  }));

  // Datos para la gráfica de tipos de propiedades
  const propertyTypeData = investments?.properties.map(property => property.property_type) || [];
  const totalPropertyTypes = propertyTypeData.length;
  const propertyChartData = propertyTypeData.map((type, index) => ({
    location: type,
    percentage: Math.round((1 / totalPropertyTypes) * 100),
    fill: predefinedColors[index % predefinedColors.length],
  }));

  // Datos para la gráfica de performance
  const chartData2 = [
    { month: "January", value: 3.2 },
    { month: "February", value: 3.9 },
    { month: "March", value: 3.5 },
    { month: "April", value: 3.7 },
    { month: "May", value: 3.1 },
    { month: "June", value: 3.8 },
  ];

  return (
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="callout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rent Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$232,222</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rental Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$898,322</div>
            <p className="text-xs text-muted-foreground">+0.4% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Withdraw Money</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-bold text-md">Withdraw</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 px-4 pb-4">
        <Card>
          <PropertyValueGraph />
        </Card>
        <Card className="px-4">
          <MyAssetsTable assetsData={yieldData || []} />
        </Card>
      </div>

      <div className="px-4 pb-4">
        <Card className="flex lg:space-x-5 grid-cols-1 grid lg:grid-cols-2">
          <PieGraph
            data={chartData}
            title="Geography"
            footerDescription="Showing total properties based on the geography"
          />
          <PieGraph
            data={propertyChartData}
            title="Property Types"
            footerDescription="Showing total properties based on the property type"
          />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 px-4 pb-4">
        <Card>
          <RiskOverview />
        </Card>
        <PerformanceGraph  
          description=""
          title={"S&P 500 Chart"}
          data={chartData2}
        />
      </div>
    </section>
  );
};
