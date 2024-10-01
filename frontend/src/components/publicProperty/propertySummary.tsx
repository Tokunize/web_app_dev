// propertySummary.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AiOutlineAreaChart } from "react-icons/ai";
import { MdOutlineBathroom } from "react-icons/md";
import { IoIosBed } from "react-icons/io";

// Puedes importar un placeholder desde tus assets

interface PropertyLocation {
    postcode: string;
    country: string;
    adminDistrict: string;
}

interface PropertySummaryProps {
    propertyType: string;
    propertyLocation: PropertyLocation | null; // Cambiado a PropertyLocation | null
    propertyDetails: {
        bedroomCount: number;
        bathroomCount: number;
        size: string; // Asumiendo que el tamaño es un string
    };
    firstImage: string; // Asegúrate de agregar esta propiedad
}

export const PropertySummary: React.FC<PropertySummaryProps> = ({ propertyType, propertyLocation, propertyDetails, firstImage }) => {
    const placeholderImage = "https://via.placeholder.com/300.png?text=Placeholder"; // URL del placeholder de 300x300

    return (
        <div className="flex flex-col">
            <div className="flex-grow p-4">
                <h2 className="font-bold text-3xl">It’s time to publish!</h2>
                <span className="text-gray-500 text-sm">Before you publish, make sure to review the details.</span>
                <Card className="max-w-sm mx-auto mt-5 shadow-lg hover:shadow-xl transition-shadow duration-300"> {/* Sombra añadida aquí */}
                    <CardHeader>
                        <CardTitle className="text-lg hidden font-bold">Property Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {firstImage ? (
                            <img 
                                src={firstImage} // URL de la imagen de marcador de posición
                                alt="Property Image" 
                                className="w-full h-48 object-cover rounded-md" 
                            />
                        ) : (
                            <img
                                src={placeholderImage} // Placeholder
                                alt="Placeholder Image"
                                className="w-full h-48 object-cover rounded-md bg-gray-200" // Puedes usar un color de fondo
                            />
                        )}
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold">{propertyType || "Property Name"}</h3>
                            <p className="text-gray-600">
                                {propertyLocation ? `${propertyLocation.postcode}, ${propertyLocation.country}` : "Location not specified"}
                            </p>
                            <div className="flex justify-around">
                                <div className="flex items-center mt-2">
                                    <IoIosBed className="mr-1 text-gray-600" />
                                    <span className="text-gray-600">{propertyDetails.bedroomCount} </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <MdOutlineBathroom className="mr-1 text-gray-600" />
                                    <span className="text-gray-600">{propertyDetails.bathroomCount} </span>
                                </div>
                                <div className="flex items-center mt-1">
                                    <AiOutlineAreaChart className="mr-1 text-gray-600" />
                                    <span className="text-gray-600">{propertyDetails.size} sq ft</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
