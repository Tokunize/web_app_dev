import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PropertyDetailsProps {
    propertyDetails: {
        bedroomCount: number;
        bathroomCount: number;
        size: string;
        title: string; // Add title to the propertyDetails type
        yearBuilt: string; // Add yearBuilt to the propertyDetails type
    };
    setPropertyDetails: React.Dispatch<React.SetStateAction<{
        bedroomCount: number;
        bathroomCount: number;
        size: string;
        title: string; // Add title to the setState type
        yearBuilt: string; // Add yearBuilt to the setState type
    }>>;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
    propertyDetails,
    setPropertyDetails
}) => {
    const { bedroomCount, bathroomCount, size, title, yearBuilt } = propertyDetails;

    const handleIncrementBedroom = () => {
        setPropertyDetails((prev) => ({
            ...prev,
            bedroomCount: prev.bedroomCount + 1,
        }));
    };

    const handleDecrementBedroom = () => {
        setPropertyDetails((prev) => ({
            ...prev,
            bedroomCount: Math.max(prev.bedroomCount - 1, 0),
        }));
    };

    const handleIncrementBathroom = () => {
        setPropertyDetails((prev) => ({
            ...prev,
            bathroomCount: prev.bathroomCount + 1,
        }));
    };

    const handleDecrementBathroom = () => {
        setPropertyDetails((prev) => ({
            ...prev,
            bathroomCount: Math.max(prev.bathroomCount - 1, 0),
        }));
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || !isNaN(Number(value))) {
            setPropertyDetails((prev) => ({ ...prev, size: value }));
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPropertyDetails((prev) => ({ ...prev, title: e.target.value }));
    };

    const handleYearBuiltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPropertyDetails((prev) => ({ ...prev, yearBuilt: e.target.value }));
    };

    return (
        <article className="p-4 space-y-5">
            <h2 className="font-bold text-4xl mb-[60px]">Share some basic details about your property</h2>
            
            {/* Title */}
            <div className="flex items-center justify-between">
                <label className="text-lg">Property Title</label>
                <Input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter property title"
                    className="max-w-xs"
                />
            </div>

            {/* Year Built */}
            <div className="flex items-center justify-between">
                <label className="text-lg">Year Built</label>
                <Input
                    value={yearBuilt}
                    onChange={handleYearBuiltChange}
                    placeholder="Enter year built"
                    className="max-w-xs"
                />
            </div>

            {/* Bedrooms */}
            <div className="flex items-center border-b pb-4 justify-between">
                <label className="text-lg">Bedrooms</label>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleDecrementBedroom}>-</Button>
                    <span className="text-xl">{bedroomCount}</span>
                    <Button variant="outline" onClick={handleIncrementBedroom}>+</Button>
                </div>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center border-b pb-4 justify-between">
                <label className="text-lg">Bathrooms</label>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleDecrementBathroom}>-</Button>
                    <span className="text-xl">{bathroomCount}</span>
                    <Button variant="outline" onClick={handleIncrementBathroom}>+</Button>
                </div>
            </div>

            {/* Size */}
            <div className="flex items-center justify-between">
                <label className="text-lg">Size (sqm)</label>
                <Input
                    value={size}
                    onChange={handleSizeChange} 
                    placeholder="Enter size"
                    className="max-w-xs"
                />
            </div>
        </article>
    );
};