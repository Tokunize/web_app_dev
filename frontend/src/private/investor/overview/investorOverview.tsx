"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyValueGraph } from "@/components/graphs/propertyValueGraph";
import { PieGraph } from "@/components/graphs/pieGraph";
import { RiskOverview } from "@/components/graphs/riskGraph";
import { PerformanceGraph } from "@/components/graphs/performanceGraph";
import { MyAssetsTable } from "@/components/dashboard/myAssetsTable";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";  
import { DashboardDetailCard } from "@/components/dashboard/dashboardDetailCard";

interface Investment {
  locations: {
    item: string,
    percentage: number,
    fill: string
  }[],
  property_types: {
    item: string,
    percentage: number,
    fill: string
  }[],
  properties: {
    location: string;
    yield_data: any; // Ajusta el tipo según tu estructura de datos
    property_type: string;
  }[];
  total_invested: number;
}


export const InvestorOverview = () => {
  const { data: investments, loading, error } = useGetAxiosRequest<Investment>(`${import.meta.env.VITE_APP_BACKEND_URL}property/investment-summary/`,true
  );
  console.log(investments);
  

  if (loading) {
    return <div><LoadingSpinner/></div>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  const dummyAppreciation = [
    "3.3", "4.2", "3.6", "-0.5", "4.1" ,"1.5"
  ]

  // Transformamos los datos recibidos para pasarlos a las gráficas y tablas
  const yieldData = investments?.properties.map((property,index) => ({
    image: property.yield_data.image,
    title: property.yield_data.title,
    projected_rental_yield: property.yield_data.projected_rental_yield,
    projected_appreciation: dummyAppreciation[index],
    location: property.location,
  }));


  // Datos para la gráfica de ubicaciones geográficas
  const chartData = investments?.locations || [];  

  // Datos para la gráfica de tipos de propiedades
  const propertyChartData = investments?.property_types || [];


  // Datos para la gráfica de performance
  const chartData2 = [
    { month: "January", value: 3.2 },
    { month: "February", value: 3.9 },
    { month: "March", value: 3.5 },
    { month: "April", value: 3.7 },
    { month: "May", value: 3.1 },
    { month: "June", value: 3.8 },
  ];

  const inverstorOverview = [
    {title:"Current Rent Balance" , value:234443 },
    {title:"Total Rental Income" ,value: 53443 }
  ]

  return (
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {inverstorOverview.map((item,index)=>(
          <DashboardDetailCard key={index} title={item.title} value={item.value} />
        ))}

        <Card className="shadow-none ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Withdraw Money</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full font-bold text-md">Withdraw</Button>
          </CardContent>
        </Card>
      </div>

      <div className="gap-4 flex px-4 pb-4">
        <Card className="shadow-none w-1/2 border-0">
          <PropertyValueGraph />
        </Card>
        <Card className="shadow-none w-1/2  py-4">
          <h4 className="text-lg pl-4 mb-2 font-normal text-gray-500">Yield Projections</h4>
          <MyAssetsTable assetsData={yieldData || []} />
        </Card>
      </div>

        <Card className="pb-4 p-4 mx-4 mb-4">
          <h4 className="text-lg mb-2 font-normal text-gray-500">Investment Diversification</h4>
          <hr/>
          <Card className="flex lg:space-x-5 grid-cols-1 grid shadow-none lg:grid-cols-2 border-0">
            <PieGraph
              customHeight="h-[350px]"
              customRadius="45"
              data={chartData}
              type={"Locations"}
              title="Geography"
              footerDescription="Showing diversification based on the geography"
            />
            <PieGraph
              customHeight="h-[350px]"
              customRadius="45"
              data={propertyChartData}
              title="Property Types"
              type={"Types"}
              footerDescription="Showing  diversification based on the property type"
            />
          </Card>
        </Card>

      <div className="flex gap-4 px-4 pb-4">
        <Card className="shadow-none  w-1/2 border-0">
          <RiskOverview />
        </Card>
        <Card className="w-1/2 border-0 shadow-none">
          <PerformanceGraph  
            description=""
            title={"Comparative Analysis Chart"}
            data={chartData2}
          />
        </Card>
      </div>
    </section>
  );
};
