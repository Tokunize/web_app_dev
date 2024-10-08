import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceGraph } from "../graphs/performanceGraph";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MyAssetsTable } from "./myAssetsTable";
import { InsightsTable } from "./insightsTable";
import { Asset } from "@/types";
import axios from "axios";
import { CurrencyConverter } from "../currencyConverter";

export const OwnerDashboard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Asset | null>(null);
    const [valueTokunized, setValueTokunized] = useState<number>(0);
    const [properties, setProperties] = useState<Asset[]>([]);
    const [property_yield, setPropertyYield] = useState<{ month: string, value: number }[]>([]);
    const [vacancyRate, setVacancyRate] = useState<{ month: string, value: number }[]>([]);
    const [netAssetValue,setNetAssetValue] =useState<{ month: string, value: number }[]>([]);
    const [tenantTurnover, setTenantTurnover] = useState<{ month: string, value: number }[]>([]);


    const month = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const handleSelectProperty = useCallback((property: Asset) => {
        // Only update the selected property if it's different from the current one
        if (selectedProperty?.id !== property.id) {
            setSelectedProperty(property);
        }
    }, [selectedProperty]);

    useEffect(() => {
        const fetchProperties = async () => {
            const accessToken = localStorage.getItem('accessToken');
    
            if (!accessToken) {
                setError('Access token not found in local storage');
                setLoading(false);
                return;
            }
    
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response.data);
                setValueTokunized(response.data.total_value_tokenized);
                setProperties(response.data.properties);
    
                // Seleccionar la primera propiedad si no hay ninguna propiedad seleccionada
                if (response.data.properties.length > 0) {
                    setSelectedProperty(response.data.properties[0]); // Establece la primera propiedad
                }
    
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError('Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProperties();
    }, []);
    
    useEffect(() => {
        if (selectedProperty) {
            showMetrics(selectedProperty, 'average_yield', setPropertyYield);
            showMetrics(selectedProperty, 'vacancy_rate', setVacancyRate);
            showMetrics(selectedProperty, 'net_asset_value', setNetAssetValue)
            showMetrics(selectedProperty, 'tenant_turnover', setTenantTurnover)
        } 
    }, [selectedProperty]);

    const showMetrics = (property: Asset, metricKey: keyof Asset, setState: React.Dispatch<React.SetStateAction<{ month: string, value: number }[]>>) => {
        const newMetricData: { month: string, value: number }[] = [];
        const selected_property = properties.find(p => p.id === property.id);
    
        if (selected_property && selected_property.metrics && selected_property.metrics.length > 0) {
            for (let i = 0; i < month.length; i++) {
                const monthName = month[i];
                const metricValue = selected_property.metrics[i]?.[metricKey] ?? 0; 
                newMetricData.push({
                    month: monthName,
                    value: metricValue
                });
            }
        } else {
            for (let i = 0; i < month.length; i++) {
                newMetricData.push({
                    month: month[i],
                    value: 0
                });
            }
        }
    
        setState(newMetricData);
    };

    const statusData = useMemo(() => 
        properties.map(property => ({
            image: property.image?.[0] || 'default_image_url.jpg',
            title: property.title,
            location: property.location,
            property_status: property.status,
            equity_listed: property.ownershipPercentage
        })), [properties]);

    const performanceData = useMemo(() => 
        properties
            .filter(property => property.status === 'published')
            .map(property => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                upcoming_rent_amount: 45,
                upcoming_date_rent: "29 Sep 2024"
            }))
    , [properties]);

    const insightsData = useMemo(() => 
        properties
            .filter(property => property.status === "published")
            .map(property => ({
                id: property.id,
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                average_yield: parseFloat(property.projected_annual_return),
                vacancy_rate: property.vacancy_rate,
                tenant_turnover: property.tenant_turnover,
                net_asset_value: parseFloat(property.price),
                net_operating_value: 200000
            }))
    , [properties]);

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Value Tokenized
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            <CurrencyConverter amountInUSD={valueTokunized} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Rent Paid
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
                <Card className="border-none">
                    <h2 className="text-md font-semibold text-gray-500">Upcoming Rent Payments</h2>
                    <MyAssetsTable assetsData={performanceData} onSelectProperty={handleSelectProperty} />
                </Card>
                <Card className="border-0">
                    <h2 className="text-md font-semibold text-gray-500">Property Status</h2>
                    <MyAssetsTable assetsData={statusData} onSelectProperty={handleSelectProperty} />
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1 gap-4">
                <Card className="border-0">
                    <h2 className="text-md font-semibold text-gray-500">Performance Insights</h2>
                    <InsightsTable assetsData={insightsData} onSelectProperty={handleSelectProperty} />
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <Card className="border-0">
                    <PerformanceGraph
                        title="Average Yield"
                        description={`Showing yield average for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={property_yield}
                    />
                </Card>
                <Card className="border-0">
                    <PerformanceGraph
                        title="Net Asset Value (NAV)"
                        description={`Net Asset Value of ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={netAssetValue}
                    />
                </Card>
            </div>
            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0">
                    <PerformanceGraph
                        title="Vacancy Rate"
                        description={`Vacancy rate for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={vacancyRate}
                    />
                </Card>
                <Card className="border-0">
                    <PerformanceGraph
                        title="Tenant Turnover"
                        description={`Tenant turnover  for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={tenantTurnover}
                    />
                </Card>
            </div>
        </section>
    );
};
