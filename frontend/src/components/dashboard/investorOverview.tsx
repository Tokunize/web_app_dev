
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PropertyValueGraph } from "../graphs/propertyValueGraph";
import { YieldProjections } from "./yieldProjections";
import { PieGraph } from "../graphs/pieGraph";
import { RiskOverview } from "../graphs/riskGraph";
import { PerformanceGraph } from "../graphs/performanceGraph";

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  ];
  
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  };
  

export const InvestorOverview = () =>{
    const {getAccessTokenSilently } = useAuth0()
    const [investments,SetInvestments] = useState()

    const getInvestmentSummary = async () =>{
        const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/investment-summary/`;

        try {
          const accessToken = await getAccessTokenSilently();
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          };
          const response = await axios.get(apiUrl, config);
          console.log(response.data);
          SetInvestments(response.data)
          
        } catch (error) {
          console.log(error);
          
        }
    }

    useEffect(()=>{
        getInvestmentSummary()
    },[getAccessTokenSilently])


    return(
            <section className=" bg-gray-100">
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
                        {/* <div className="text-2xl font-bold">{investments?.total_invested}</div> */}
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium ">Withdraw Money</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <Button className="w-full font-bold text-md">Withdraw</Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <Card>
                        <PropertyValueGraph/>
                    </Card>
                    <Card className="px-4"> 
                        <YieldProjections data={investments?.properties}/>  
                    </Card>
                </div>
                <div className="px-4 pb-4">
                    <Card className="flex space-x-5 grid-cols-1 grid md:grid-cols-2">
                    <PieGraph 
                        data={chartData} 
                        config={chartConfig} 
                        title="Asset Type Chart" 
                        description="January - June 2024" 
                        trend="Trending up by 5.2% this month" 
                        />   
                    <PieGraph 
                        data={chartData} 
                        config={chartConfig} 
                        title="Geography Chart" 
                        description="January - June 2024" 
                        trend="Trending up by 5.2% this month" 
                        />                      
                    </Card>
                </div>
                <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                    <Card>
                        <RiskOverview/>
                    </Card>
                    <Card>  
                        <PerformanceGraph/> 
                    </Card>
                </div>
            </section>
    )
}