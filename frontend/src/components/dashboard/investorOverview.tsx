"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PropertyValueGraph } from "../graphs/propertyValueGraph";
import { PieGraph } from "../graphs/pieGraph";
import { RiskOverview } from "../graphs/riskGraph";
import { PerformanceGraph } from "../graphs/performanceGraph";
import { MyAssetsTable } from "./myAssetsTable";

interface Investment {
  properties: {
    location: string;
    yield_data: any; // Ajusta el tipo según tu estructura de datos
    property_type: string;
  }[];
  total_invested: number;
}

export const InvestorOverview = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [investments, setInvestments] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);

  const getInvestmentSummary = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment-summary/`;

    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get<Investment>(apiUrl, config);
      setInvestments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvestmentSummary();
  }, [getAccessTokenSilently]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  const yieldData = investments?.properties.map((property) => ({
    image: property.yield_data.image,
    title:property.yield_data.title,
    projected_rental_yield: property.yield_data.projected_rental_yield,
    projected_appreciation: 1.2,
    location: property.location,
  }));

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

  const geographyData = investments?.properties.map(property => property.location) || [];
  const totalLocations = geographyData.length;

  const uniqueColors = getUniqueColors(totalLocations);

  const chartData = geographyData.map((location, index) => ({
    location,
    percentage: Math.round((1 / totalLocations) * 100),
    fill: uniqueColors[index],
  }));

  const propertyTypeData = investments?.properties.map(property => property.property_type) || [];
  const totalPropertyTypes = propertyTypeData.length;

  const uniquePropertyColors = getUniqueColors(totalPropertyTypes);

  const propertyChartData = propertyTypeData.map((type, index) => ({
    location: type,
    percentage: Math.round((1 / totalPropertyTypes) * 100),
    fill: uniquePropertyColors[index],
  }));

  return (
    <section className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card className="callout-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rent Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rental Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments?.total_invested}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
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
        <Card>
          {/* <PerformanceGraph/> */}
        </Card>
      </div>
    </section>
  );
};
