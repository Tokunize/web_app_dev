import { TabsComponent } from "../tabs";
import { useState, useMemo } from "react";
import { MyAssetsTable } from "./myAssetsTable";
import { Card } from "../ui/card";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { LoadingSpinner } from "./loadingSpinner";

interface Property {
    image?: string[];
    title: string;
    location: string;
    ownershipPercentage: number;
    price: number;
    status: string;
    id: number;
    projected_rental_yield: number;
    created_at: string;
}



export const PropertyManagement = () => {  
    const [properties, setProperties] = useState<Property[]>([]);

    // Fetching properties
    const { loading, error: fetchError } = useGetAxiosRequest<{
        properties: Property[];  // Asegúrate de que la respuesta tiene la forma correcta
    }>(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`,
        (fetchedData) => {
            // Se espera que fetchedData tenga una propiedad `properties` que es un array de Property
            setProperties(fetchedData.properties);  // Establece las propiedades correctamente
        }
    );

    const underReviewProperties = useMemo(() => {
        return properties.filter(property => property.status === "under_review");
    }, [properties]);

    const rejectedProperties = useMemo(() => {
        return properties.filter(property => property.status === "rejected");
    }, [properties]);

    const allStatusPropertiesData = useMemo(() => {
        return properties
            .filter(property => 
                property.status === 'under_review' || property.status === 'rejected'
            )
            .map((property) => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                ownershipPercentage: property.ownershipPercentage,
                listing_price: property.price,
                id: property.id,
                property_status: property.status
            }));
    }, [properties]);
    

    const underReviewPropertiesData = useMemo(() => {
        return underReviewProperties.map((property) => ({
            image: property.image?.[0] || 'default_image_url.jpg',
            title: property.title,
            location: property.location,
            ownershipPercentage: property.ownershipPercentage,
            listing_price: property.price,
            id: property.id,
            property_status: property.status

        }));
    }, [underReviewProperties]);

    const rejectedPropertiesData = useMemo(() => {
        return rejectedProperties.map((property) => ({
            image: property.image?.[0] || 'default_image_url.jpg',
            title: property.title,
            location: property.location,
            ownershipPercentage: property.ownershipPercentage,
            listing_price: property.price,
            id: property.id,
            property_status: property.status

        }));
    }, [rejectedProperties]);

    const allPropertiesData = useMemo(() => {
        return properties
            .filter(property => 
                property.status != 'under_review'
            )
            .map((property) => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                ownershipPercentage: property.ownershipPercentage,
                listing_price: property.price,
                id: property.id,
                property_status: property.status,
                projected_rental_yield: property.projected_rental_yield,
                listing_date: property.created_at,
                cap_rate: 2.4

            }));
    }, [properties]); 

    const comingSoonProperties = useMemo(() => {
        return properties
            .filter(property => 
                property.status === 'coming_soon'
            )
            .map((property) => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                ownershipPercentage: property.ownershipPercentage,
                listing_price: property.price,
                id: property.id,
                property_status: property.status
            }));
    }, [properties]); 

    const activeProperties = useMemo(() => {
        return properties
            .filter(property => 
                property.status === 'published'
            )
            .map((property) => ({
                image: property.image?.[0] || 'default_image_url.jpg',
                title: property.title,
                location: property.location,
                ownershipPercentage: property.ownershipPercentage,
                listing_price: property.price,
                id: property.id,
                property_status: property.status,
                projected_rental_yield: property.projected_rental_yield,
                listing_date: property.created_at,
                cap_rate: 2.4
            }));
    }, [properties]); 

    const awaitingTabs = [
        {
            value: "all",
            title: "All Properties",
            description: "View all properties.",
            content: <MyAssetsTable assetsData={allStatusPropertiesData} />,
        },
        {
            value: "under_review",
            title: "Under Review Properties",
            description: "View all under review properties.",
            content: <MyAssetsTable assetsData={underReviewPropertiesData} />,
        },
        {
            value: "rejected",
            title: "Rejected Properties",
            description: "View all rejected properties.",
            content: <MyAssetsTable assetsData={rejectedPropertiesData} />,
        },
    ];

    const allTabs = [
        {
            value: "all",
            title: "All Properties",
            description: "View all properties.",
            content: <MyAssetsTable assetsData={allPropertiesData} />,
        },
        {
            value: "coming_soon",
            title: "Coming Soon",
            description: "View all under review properties.",
            content: <MyAssetsTable assetsData={comingSoonProperties} />,
        },
        {
            value: "rejected",
            title: "Active Properties",
            description: "View all rejected properties.",
            content: <MyAssetsTable assetsData={activeProperties} />,
        },
    ];

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (fetchError) {
        return <div>Error: {fetchError}</div>;
    }

    return (
        <section>
        <Card>
            {/* Wrap TabsComponent with a div for overflow */}
            <div className="grid grid-cols-1">
                <TabsComponent tabs={awaitingTabs} />
            </div>
        </Card>
        
        {/* Repeat the same for another TabsComponent */}
        <div className="grid grid-cols-1">
            <TabsComponent tabs={allTabs} />
        </div>
    </section>
    
    );
};
