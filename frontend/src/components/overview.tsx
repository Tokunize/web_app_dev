import React, { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { Progress } from "@/components/ui/progress";
import { PropertyModal } from './modal';
import "../styles/singleProperty.css";
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Para acceder a los parámetros de la URL

interface PropertyData {
  title: string;
  location: string;
  image: string[];
  token_price: string;
  annual_gross_rents: string;
  bedrooms?: number;
  bathrooms?: string;
  size?: string;
  description?: string;
  details?: string;
  amenities?: { amenities: string[] };
  video_urls?: string[];
}

export const Overview: React.FC = () => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [progress, setProgress] = useState(0);
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = `http://127.0.0.1:8000/property/properties/${id}/?view=overview`;
        const response = await axios.get(apiUrl);
        setProperty(response.data);
        console.log(response.data);
        
        // Aquí puedes calcular el progreso en función de la propiedad
        setProgress(13); // Ejemplo de progreso fijo
      } catch (error) {
        console.error('Failed to fetch property data:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <section className="p-4">
      <h4 className="propertyHeading mb-2">{property.title}</h4>
      <p className="text-lg text-gray-600">{property.location}</p>
      
      <div className="mt-6 space-y-4">
        {/* Icon */}
        <div className="flex items-center space-x-3">
          <FaBath className="text-gray-600 text-2xl" />
          <span className="text-lg">{property.bathrooms || 'N/A'} Bath</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <FaBed className="text-gray-600 text-2xl" />
          <span className="text-lg">{property.bedrooms || 'N/A'} Beds</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <FaRulerCombined className="text-gray-600 text-2xl" />
          <span className="text-lg">{property.size || 'N/A'} sq ft</span>
        </div>
      </div>
      
      <div className="border-4 border-red-500 border-dotted p-6 rounded-lg mt-8">
        <h4 className='propertyHeading mb-2'>Estimated Value</h4>
        <p className='text-sm text-gray-500'>
          Based on recent sales data, market trends, and property conditions.
        </p>
        
        <div className="relative flex items-center justify-center mt-[60px]">
          <Progress value={progress} className="w-3/5" />
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 text-lg font-semibold text-gray-800">
            {progress}%
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-2 w-3/5 mx-auto">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h4 className="propertyHeading mb-2">Description</h4>
        <p className="text-gray-700">
          {property.description || 'Description not available'}
        </p>
        <PropertyModal/>
      </div>

      <div className="p-4 mt-8">
        <h2 className="propertyHeading mb-4">Property Details</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {property.details ? property.details.split('\n').map((detail, index) => (
            <li key={index}>{detail}</li>
          )) : <li>Details not available</li>}
        </ul>
      </div>

      <div className="p-4 mt-8">
        <h2 className="propertyHeading mb-4">Neighborhood Highlight</h2>
        <p className="text-gray-700 mb-4">
          Neighborhood information not available.
        </p>
        <PropertyModal />
      </div>
    </section>
  );
};
