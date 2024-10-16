import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceGraph } from "../graphs/performanceGraph";
import { useState, useEffect, useMemo, useCallback } from "react";
import { MyAssetsTable } from "./myAssetsTable";
import { InsightsTable } from "./insightsTable";
import { Asset } from "@/types";
import { LoadingSpinner } from "./loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import infoIcon from "../../assets/infoIcon.svg";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterInput } from "../filterInput";

export const OwnerDashboard = () => {
    const [selectedProperty, setSelectedProperty] = useState<Asset | null>(null);
    const [valueTokenized, setValueTokenized] = useState<number>(0);
    const [properties, setProperties] = useState<Asset[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Asset[]>([]);
    const [filterValue, setFilterValue] = useState<string>(""); // Estado para el filtro
    const [property_yield, setPropertyYield] = useState<{ month: string, value: number }[]>([]);
    const [vacancyRate, setVacancyRate] = useState<{ month: string, value: number }[]>([]);
    const [netAssetValue, setNetAssetValue] = useState<{ month: string, value: number }[]>([]);
    const [tenantTurnover, setTenantTurnover] = useState<{ month: string, value: number }[]>([]);
    const [ownerBalance, setOwnerBalance] = useState<number>(0);

    const month = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const handleSelectProperty = useCallback((property: Asset) => {
        if (selectedProperty?.id !== property.id) {
            setSelectedProperty(property);
        }
    }, [selectedProperty]);

    // Usando el hook personalizado para obtener el balance
    const { error: balanceError, loading: balanceLoading } = useGetAxiosRequest<number>(
        `${import.meta.env.VITE_APP_BACKEND_URL}wallet/balance-wallet/`,
        (data) => setOwnerBalance(data),  // Callback de éxito
        (error) => console.error('Error fetching balance:', error)  // Callback de error
    );

    // Usando el hook personalizado para obtener las propiedades
    const { error: propertiesError, loading: propertiesLoading } = useGetAxiosRequest<{ properties: Asset[], total_value_tokenized: number }>(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`,
        (data) => {
            setValueTokenized(data.total_value_tokenized);
            setProperties(data.properties);
            setFilteredProperties(data.properties); // Inicializar propiedades filtradas
            if (data.properties.length > 0) {
                setSelectedProperty(data.properties[0]);
            }
        },
        (error) => console.error('Error fetching properties:', error)
    );

    useEffect(() => {
        if (selectedProperty) {
            showMetrics(selectedProperty, 'average_yield', setPropertyYield);
            showMetrics(selectedProperty, 'vacancy_rate', setVacancyRate);
            showMetrics(selectedProperty, 'net_asset_value', setNetAssetValue);
            showMetrics(selectedProperty, 'tenant_turnover', setTenantTurnover);
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

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        if (value) {
            const filtered = properties.filter(property =>
                property.title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredProperties(filtered);
        } else {
            setFilteredProperties(properties);
        }
    };

    const statusData = useMemo(() =>
        filteredProperties.map(property => ({
            image: property.image?.[0] || 'default_image_url.jpg',
            title: property.title,
            location: property.location,
            property_status: property.status,
            equity_listed: property.ownershipPercentage
        })), [filteredProperties]);

    const performanceData = useMemo(() =>
        filteredProperties
            .filter(property => property.status === 'published')
            .map(property => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                upcoming_rent_amount: 45,
                upcoming_date_rent: "29 Sep 2024"
            }))
        , [filteredProperties]);

    const insightsData = useMemo(() =>
        filteredProperties
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
        , [filteredProperties]);

    if (balanceLoading || propertiesLoading) return <div className="flex items-center h-full justify-center"><LoadingSpinner/></div>;
    if (balanceError || propertiesError) return <div>Error: {balanceError || propertiesError}</div>;


    return (
        <section>
            {/* <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            <CurrencyConverter amountInUSD={ownerBalance} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Balance of the property owner, received from investors who invest on his properties
                        </p>
                    </CardContent>
                </Card> */}
            <div className="absolute w-1/2  top-[64px] md:top-[0px]">
                <FilterInput onFilterChange={handleFilterChange} filterValue={filterValue} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center space-y-0 space-x-2">
                        <CardTitle className="text-xs font-medium  text-gray-500">
                            Total Value Tokenized
                        </CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="p-0 mt-0"><img alt="info-icon" src={infoIcon}  /></TooltipTrigger>
                                <TooltipContent>
                                <p className="max-w-xs">The  total value of all your  tokenized properties</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* <CurrencyConverter amountInUSD={valueTokenized} /> */}
                            <p className="font-bold">
                                £{valueTokenized?.toFixed(2) || 0.00} <br /> 
                            </p>
                        </div>
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
                <Card className="border-none shadow-none">
                    <h2 className="text-md mb-2 font-normal text-gray-500">Upcoming Rent Payments</h2>
                    <MyAssetsTable assetsData={performanceData} onSelectProperty={handleSelectProperty} />
                </Card>
                <Card className="border-0  shadow-none">
                    <h2 className="text-md mb-2 font-normal text-gray-500">Property Status</h2>
                    <MyAssetsTable assetsData={statusData} onSelectProperty={handleSelectProperty} />
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1 gap-4">
                <Card className="border-0  shadow-none">
                    <h2 className="text-md mb-2 font-normal text-gray-500">Performance Insights</h2>
                    <InsightsTable assetsData={insightsData} onSelectProperty={handleSelectProperty} />
                </Card>
            </div>

            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <Card className="border-0  shadow-none">
                    <PerformanceGraph
                        title="Average Yield"
                        description={`Showing yield average for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={property_yield}
                    />
                </Card>
                <Card className="border-0  shadow-none">
                    <PerformanceGraph
                        title="Net Asset Value (NAV)"
                        description={`Net Asset Value of ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={netAssetValue}
                    />
                </Card>
            </div>
            <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-0  shadow-none">
                    <PerformanceGraph
                        title="Vacancy Rate"
                        description={`Vacancy rate for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
                        data={vacancyRate}
                    />
                </Card>
                <Card className="border-0  shadow-none">
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






// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { PerformanceGraph } from "../graphs/performanceGraph";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { MyAssetsTable } from "./myAssetsTable";
// import { InsightsTable } from "./insightsTable";
// import { Asset } from "@/types";
// import axios from "axios";
// import { CurrencyConverter } from "../currencyConverter";
// import { LoadingSpinner } from "./loadingSpinner";
// import { useAuth0 } from "@auth0/auth0-react";

// export const OwnerDashboard = () => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedProperty, setSelectedProperty] = useState<Asset | null>(null);
//     const [valueTokunized, setValueTokunized] = useState<number>(0);
//     const [properties, setProperties] = useState<Asset[]>([]);
//     const [property_yield, setPropertyYield] = useState<{ month: string, value: number }[]>([]);
//     const [vacancyRate, setVacancyRate] = useState<{ month: string, value: number }[]>([]);
//     const [netAssetValue,setNetAssetValue] =useState<{ month: string, value: number }[]>([]);
//     const [tenantTurnover, setTenantTurnover] = useState<{ month: string, value: number }[]>([]);
//     const [ownerBalance, setOwnerBalance] = useState<number>(0)
//     const { getAccessTokenSilently } = useAuth0();


//     const month = [
//         "January", "February", "March", "April", "May", "June", 
//         "July", "August", "September", "October", "November", "December"
//     ];

//     const handleSelectProperty = useCallback((property: Asset) => {
//         // Only update the selected property if it's different from the current one
//         if (selectedProperty?.id !== property.id) {
//             setSelectedProperty(property);
//         }
//     }, [selectedProperty]);


//     const getBalance = async (token: string) => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}wallet/balance-wallet/`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//             const formattedBalance = parseFloat(response.data.data.tokenBalances[1].amount);
//             setOwnerBalance(formattedBalance);
//         } catch (error) {
//             console.error('Error al obtener balance:', error);
//             setError('No se pudo obtener el balance');
//         }
//     };

//     const fetchProperties = async (token: string) => {
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//             });
//             console.log(response.data);
//             setValueTokunized(response.data.total_value_tokenized);
//             setProperties(response.data.properties);
    
//             if (response.data.properties.length > 0) {
//                 setSelectedProperty(response.data.properties[0]);
//             }
//         } catch (error) {
//             console.error('Error al obtener propiedades:', error);
//             setError('Error al obtener propiedades');
//         }
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Obtener el token antes de hacer las solicitudes
//                 const token = await getAccessTokenSilently();
//                 if (token) {
//                     await getBalance(token); // Pasa el token como argumento a las funciones
//                     await fetchProperties(token); // Pasa el token como argumento
//                 } else {
//                     setError('No se pudo obtener el token de autenticación.');
//                 }
//             } catch (error) {
//                 setError('Error al obtener el token o los datos.');
//                 console.error('Error:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchData(); // Llamar a la función
//     }, [getAccessTokenSilently]);
    
//     useEffect(() => {
//         if (selectedProperty) {
//             showMetrics(selectedProperty, 'average_yield', setPropertyYield);
//             showMetrics(selectedProperty, 'vacancy_rate', setVacancyRate);
//             showMetrics(selectedProperty, 'net_asset_value', setNetAssetValue)
//             showMetrics(selectedProperty, 'tenant_turnover', setTenantTurnover)
//         } 
//     }, [selectedProperty]);

//     const showMetrics = (property: Asset, metricKey: keyof Asset, setState: React.Dispatch<React.SetStateAction<{ month: string, value: number }[]>>) => {
//         const newMetricData: { month: string, value: number }[] = [];
//         const selected_property = properties.find(p => p.id === property.id);
    
//         if (selected_property && selected_property.metrics && selected_property.metrics.length > 0) {
//             for (let i = 0; i < month.length; i++) {
//                 const monthName = month[i];
//                 const metricValue = selected_property.metrics[i]?.[metricKey] ?? 0; 
//                 newMetricData.push({
//                     month: monthName,
//                     value: metricValue
//                 });
//             }
//         } else {
//             for (let i = 0; i < month.length; i++) {
//                 newMetricData.push({
//                     month: month[i],
//                     value: 0
//                 });
//             }
//         }
    
//         setState(newMetricData);
//     };

//     const statusData = useMemo(() => 
//         properties.map(property => ({
//             image: property.image?.[0] || 'default_image_url.jpg',
//             title: property.title,
//             location: property.location,
//             property_status: property.status,
//             equity_listed: property.ownershipPercentage
//         })), [properties]);

//     const performanceData = useMemo(() => 
//         properties
//             .filter(property => property.status === 'published')
//             .map(property => ({
//                 image: property.image?.[0] || 'default_image_url.jpg',
//                 title: property.title,
//                 location: property.location,
//                 upcoming_rent_amount: 45,
//                 upcoming_date_rent: "29 Sep 2024"
//             }))
//     , [properties]);

//     const insightsData = useMemo(() => 
//         properties
//             .filter(property => property.status === "published")
//             .map(property => ({
//                 id: property.id,
//                 image: property.image?.[0] || 'default_image_url.jpg',
//                 title: property.title,
//                 location: property.location,
//                 average_yield: parseFloat(property.projected_annual_return),
//                 vacancy_rate: property.vacancy_rate,
//                 tenant_turnover: property.tenant_turnover,
//                 net_asset_value: parseFloat(property.price),
//                 net_operating_value: 200000
//             }))
//     , [properties]);

//     // Handle loading and error states
//     if (loading) return<div className="flex items-center h-full justify-center">
//         <LoadingSpinner/>
//     </div> 
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <section>
//             {/* <Card className="callout-card">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">
//                             <CurrencyConverter amountInUSD={ownerBalance} />
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                             Balance of the property owner, received from investors who invest on his properties
//                         </p>
//                     </CardContent>
//                 </Card> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <Card className="callout-card">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">
//                             Total Value Tokenized
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">
//                             <CurrencyConverter amountInUSD={valueTokunized} />
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                             +20.1% from last month
//                         </p>
//                     </CardContent>
//                 </Card>
//                 <Card className="callout-card">
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                         <CardTitle className="text-sm font-medium">
//                             Total Rent Paid
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="text-2xl font-bold">$15,231.89</div>
//                         <p className="text-xs text-muted-foreground">
//                             +10.1% from last month
//                         </p>
//                     </CardContent>
//                 </Card>
//             </div>

//             <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card className="border-none">
//                     <h2 className="text-md font-normal text-gray-500">Upcoming Rent Payments</h2>
//                     <MyAssetsTable assetsData={performanceData} onSelectProperty={handleSelectProperty} />
//                 </Card>
//                 <Card className="border-0">
//                     <h2 className="text-md font-normal text-gray-500">Property Status</h2>
//                     <MyAssetsTable assetsData={statusData} onSelectProperty={handleSelectProperty} />
//                 </Card>
//             </div>

//             <div className="grid border-0 grid-cols-1 gap-4">
//                 <Card className="border-0">
//                     <h2 className="text-md font-normal text-gray-500">Performance Insights</h2>
//                     <InsightsTable assetsData={insightsData} onSelectProperty={handleSelectProperty} />
//                 </Card>
//             </div>

//             <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4 my-4">
//                 <Card className="border-0">
//                     <PerformanceGraph
//                         title="Average Yield"
//                         description={`Showing yield average for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
//                         data={property_yield}
//                     />
//                 </Card>
//                 <Card className="border-0">
//                     <PerformanceGraph
//                         title="Net Asset Value (NAV)"
//                         description={`Net Asset Value of ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
//                         data={netAssetValue}
//                     />
//                 </Card>
//             </div>
//             <div className="grid border-0 grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card className="border-0">
//                     <PerformanceGraph
//                         title="Vacancy Rate"
//                         description={`Vacancy rate for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
//                         data={vacancyRate}
//                     />
//                 </Card>
//                 <Card className="border-0">
//                     <PerformanceGraph
//                         title="Tenant Turnover"
//                         description={`Tenant turnover  for ${selectedProperty ? selectedProperty.title : 'selected property'} in the last year`}
//                         data={tenantTurnover}
//                     />
//                 </Card>
//             </div>
//         </section>
//     );
// };
