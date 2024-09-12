import React, { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { Progress } from "@/components/ui/progress";
import { PropertyModal } from './modal';
import "../styles/singleProperty.css";
import { MapView } from "@/components/mapView";
import { Graphic } from './graph';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styles/overview.css"

interface PropertyData {
  title: string;
  location: string;
  image: string[];
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
  const [progress, setProgress] = useState<number>(0);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = `http://127.0.0.1:8000/property/${id}/?view=overview`;
        const response = await axios.get<PropertyData>(apiUrl);
        console.log(response.data);
        
        setProperty(response.data);
        setProgress(50); 
      } catch (error) {
        console.error('Failed to fetch property data:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <section className='pl-5'>    
        <h4 className="propertyHeading mb-2">{property.title}</h4>
        <p className="text-lg text-gray-600">{property.location}</p>
  
        <div className="mt-6 space-y-6">
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
  
        <div className="mt-[40px] featureContainer">
          <h4 className="propertyHeading mb-2">Estimated Value</h4>
          <p className="text-sm text-gray-500">
            Based on recent sales data, market trends, and property conditions.
          </p>
  
          <div className="relative flex items-center justify-center mt-[60px]">
            <Progress value={progress} className="w-3/5" />
            <div className="absolute left-1/2 transform -translate-x-1/2 mb-[60px] text-lg font-semibold text-gray-800">
              {progress}%
            </div>
          </div>
  
          <div className="flex justify-between text-sm text-gray-600 mt-2 w-3/5 mx-auto">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
  
        <div className="featureContainer break-words">
          <h4 className="propertyHeading mb-4">Description</h4>
          <p className="text-gray-700 mb-5">
            {property.description || 'Description not available'}
          </p>
          <PropertyModal />
        </div>
  
        <div className="mt-[40px] featureContainer">
          <h2 className="propertyHeading mb-4">Key Features</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 break-words">
            {property.amenities ? (
              property.amenities.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            ) : (
              <li>Details not available</li>
            )}
          </ul>
        </div>
  
        <div className="my-8 featureContainer">
          <h2 className="propertyHeading mb-4">Neighborhood Highlight</h2>
          <p className="text-gray-700 mb-4">
            {property.details || 'Description not available'}
          </p>
          <PropertyModal />
        </div>
  
        <div className="my-[40px]">
          <MapView location={property.location} />
        </div>
  
        <div className="featureContainer">
          <h4 className="propertyHeading">Historical sold prices in {property.location}</h4>
          <Graphic />
        </div>
    </section>
  );
  
};
