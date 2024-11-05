import React, { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { Progress } from "@/components/ui/progress";
import "../styles/singleProperty.css";
import { MapView } from "@/components/mapView";
import { HistoricalPrice } from './graphs/historicalGraph';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../styles/overview.css"
import { LoadingSpinner } from './dashboard/loadingSpinner';
import { FaHouse } from "react-icons/fa6";


interface PropertyData {
  title: string;
  location: string;
  post_code:string;
  image: string[];
  annual_gross_rents: string;
  bedrooms?: number;
  bathrooms?: string;
  size?: string;
  description?: string;
  details?: string;
  amenities?: string[] ;
  video_urls?: string[];
  property_type?:string
}

export const Overview: React.FC = () => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const [valueAmount, setValueAmount] = useState<string>("0")

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/${id}/landing-page/?view=overview`;
        const response = await axios.get<PropertyData>(apiUrl);                
        setProperty(response.data);
        setProgress(50); 
        setValueAmount("1,503,000")
      } catch (error) {
        console.error('Failed to fetch property data:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div className="flex items-center justify-center h-screen">
  < LoadingSpinner/>
 </div>;

  return (
    <section className='pl-5'> 
        <div className="border-b pb-5">
          <h4 className="propertyHeading mb-2">{property.title}</h4>
          <p className="text-medium text-gray-500">{property.location}, {property.post_code} </p>
        </div> 
        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-5">
            <FaBath className="text-xl" />
            <span className="text-lg">{property.bathrooms || 'N/A'} Bath</span>
          </div>
  
          <div className="flex items-center space-x-5">
            <FaBed className="text-xl" />
            <span className="text-lg">{property.bedrooms || 'N/A'} Beds</span>
          </div>
  
          <div className="flex items-center space-x-5">
            <FaRulerCombined className=" text-xl" />
            <span className="text-lg">{property.size || 'N/A'} sq ft</span>
          </div>
          <div className="flex items-center space-x-5">
            <FaHouse className=" text-xl" />
            <span className="text-lg">{property.property_type || 'N/A'}</span>
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
              £{valueAmount}
            </div>
          </div>
  
          <div className="flex justify-between text-sm text-gray-500 mt-2 w-3/5 mx-auto">
            <span>£1.4M</span>
            <span>£1.8M</span>
          </div>
        </div>
  
        <div className="featureContainer break-words">
          <h4 className="propertyHeading mb-4">Description</h4>
          <p className="text-gray-700 mb-5">
            {property.description || 'Description not available'}
          </p>
        </div>
  
        <div className="mt-[40px] featureContainer">
          <h2 className="propertyHeading mb-4">Key Features</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 break-words">
            {property.amenities ? (
              property.amenities.map((item: string, index: number) => (
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
          {/* <PropertyModal /> */}
        </div>
  
        <div className="my-[40px]">
          <MapView location={property.location} />
        </div>
  
        <div className="featureContainer">
          <h4 className="propertyHeading">Historical sold prices in {property.location}</h4>
          <HistoricalPrice />
        </div>
    </section>
  );
  
};
