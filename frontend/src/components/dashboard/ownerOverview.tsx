import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoutButton } from "../buttons/logoutBtn";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PerformanceGraph } from "../graphs/performanceGraph";
import { useState } from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { MyAssetsTable } from "./myAssetsTable";
import { InsightsTable } from "./insightsTable";
import { Asset } from "@/types";


// Datos de ejemplo para propiedades
const insightsData: Asset[] = [
    {
        image: "https://images.unsplash.com/photo-1713830348050-b4306c58b175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Modern Apartment",
        location: "London",
        average_yield: 4.5,
        vacancy_rate: 2.3,
        tenant_turnover: 12,
        net_asset_value: 500000,
        net_operating_value: 45000
    },
    {
        image: "https://images.unsplash.com/photo-1713830348050-b4306c58b175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Luxury Villa",
        location: "Paris",
        average_yield: 5.2,
        vacancy_rate: 1.5,
        tenant_turnover: 9,
        net_asset_value: 1200000,
        net_operating_value: 98000
    }
];

const performanceData = [{
    image: "https://images.unsplash.com/photo-1713830348050-b4306c58b175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Holaaa",
    location: "London",
    upcoming_rent_amount: 45,
    upcoming_date_rent: "29 Sep 2024"
}];

const statusData = [{
    image: "https://images.unsplash.com/photo-1713830348050-b4306c58b175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Holaaa",
    location: "London",
    property_status: "active",
    equity_listed: 70
},
{
    image: "https://images.unsplash.com/photo-1713830348050-b4306c58b175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Holaaa",
    location: "London",
    property_status: "under_review",
    equity_listed: 50
}];

export const OwnerDashboard = () => {
    const [selectedProperty, setSelectedProperty] = useState(insightsData[0]); // Estado para almacenar la propiedad seleccionada
    const navigate = useNavigate()
    const handleSelectProperty = (property: Asset) => {
        setSelectedProperty(property);
    };

    const generateChartData = (metric: keyof Asset) => {
        const value = selectedProperty[metric] as number; // Assert that the value is a number
        return [
            { month: "January", value: value ?? 0 }, // Use 0 as default if undefined
            { month: "February", value: value ?? 0 },
            { month: "March", value: value ?? 0 },
            { month: "April", value: value ?? 0 },
            { month: "May", value: value ?? 0 },
            { month: "June", value: value ?? 0 },
        ];
    };
    

    return (
        <section>
            <div className="flex justify-end mb-4 mr-[50px]">
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-10 h-10 rounded-full ">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="hidden">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Account Setting</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/")}>
                            <Button>Marketplace</Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem><LogoutButton/></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$15,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +10.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0">
                    <MyAssetsTable assetsData={performanceData} />
                </Card>
                <Card className="border-0">
                    <MyAssetsTable assetsData={statusData} />
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1  gap-4">
                <Card className="border-0">
                    <InsightsTable assetsData={insightsData} onSelectProperty={handleSelectProperty} />
                </Card>
            </div>

            {/* Gráficos dinámicos basados en la propiedad seleccionada */}
            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <Card className="border-0">
                    <PerformanceGraph
                        title="Average Yield"
                        description={`Showing yield average for ${selectedProperty.title} in the last year`}
                        data={generateChartData('average_yield')} // Pasa los datos dinámicos
                    />
                </Card>
                <Card className="border-0">
                    <PerformanceGraph
                        title="Net Asset Value (NAV)"
                        description={`Net Asset Value of ${selectedProperty.title} in the last year`}
                        data={generateChartData('net_asset_value')} // Pasa los datos dinámicos
                    />
                </Card>
            </div>
            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0">
                    <PerformanceGraph
                        title="Vacancy Rate"
                        description={`Vacancy rate and tenant turnover for ${selectedProperty.title} in the last year`}
                        data={generateChartData('vacancy_rate')} // Pasa los datos dinámicos
                    />
                </Card>
                <Card className="border-0">
                    <PerformanceGraph
                        title="Net Operating Value"
                        description={`Net operating income for ${selectedProperty.title} in the last year`}
                        data={generateChartData('net_operating_value')} // Pasa los datos dinámicos
                    />
                </Card>
            </div>
        </section>
    )
}
