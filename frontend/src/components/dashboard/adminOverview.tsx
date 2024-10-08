"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import axios from "axios";
import { MyAssetsTable } from "./myAssetsTable";
import { NewPropertiesGraph } from "../graphs/newPropertiesGraph";
import { ActivityLog } from "./activityLog";

// Define the structure for property data
interface Property {
    image?: string[];
    title: string;
    location: string;
    ownershipPercentage: number;
    price: number;
    status: string;
    id:number
}

// Main functional component
export const AdminOverview = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [underReviewProperties, setUnderReviewProperties] = useState<Property[]>([]);
    const [activeProperties, setActiveProperties] = useState<number>(0);

    useEffect(() => {
        const fetchProperties = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                setError('Access token not found in local storage');
                setLoading(false);
                return;
            }

            try {
                setLoading(true); // Move loading state up
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                const properties: Property[] = response.data.properties;

                // Filter properties with the status "under_review" and "published"
                const underReviewProperties = properties.filter(item => item.status === "under_review");
                const activePropertiesCount = properties.filter(item => item.status === "published").length;

                setActiveProperties(activePropertiesCount);

                // Set underReviewProperties; wrap in array for consistency
                setUnderReviewProperties(underReviewProperties.length > 0 ? underReviewProperties : []);

            } catch (err: any) {
                console.error('Error fetching properties:', err);
                setError(err.response?.data?.message || 'Failed to fetch properties'); // Provide more detailed error
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Transform underReviewProperties into the format required for MyAssetsTable
    const underReviewPropertiesData = underReviewProperties.map((property) => ({
        image: property.image?.[0] || 'default_image_url.jpg',
        title: property.title,
        location: property.location,
        ownershipPercentage: property.ownershipPercentage,
        listing_price: property.price,
        id: property.id,
    }));

    return (
        <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                <Card className="callout-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Market Tokenized</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$232,222</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#FDC35B]">{underReviewProperties.length}</div>
                        <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProperties}</div>
                        <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sold Out Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-500">34</div>
                        <p className="text-xs text-muted-foreground">+0.4% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="font-semibold text-[#FDB023]">Awaiting Approvals</h3>
                <MyAssetsTable assetsData={underReviewPropertiesData} />
            </div>
            <NewPropertiesGraph/>
            <ActivityLog/>
        </section>
    );
};
