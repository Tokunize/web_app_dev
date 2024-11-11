
import React, { useEffect, useState } from 'react';
import { FaBath, FaBed, FaRulerCombined } from 'react-icons/fa';
import { Progress } from './ui/progress';
import { HistoricalPrice } from './graphs/historicalGraph';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from './loadingSpinner';
import { FaHouse } from "react-icons/fa6";
import propertyExtraData from "../assets/propertyExtraDetails.json"
import { MapView } from './mapView';
import { FormatCurrency } from './currencyConverter';

interface AdditionalFinancialInformation {
  IRR: string;
  NOI: string;
  totalTenants: number;
  minimumInvestment: string;
  daysRemaining: string;
  offeringDuration: string;
  offeringEndDate: string;
  exchangeOpensOn: string;
}

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
  price:number
}


export const Overview = () => {
  
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const [valueAmount, setValueAmount] = useState<React.ReactNode>(null); // Cambiar a React.ReactNode
  const [propertyExtra, setPropertyExtra] = useState<AdditionalFinancialInformation>({
    IRR: "",
    NOI: "",
    totalTenants: 0,
    minimumInvestment: "",
    daysRemaining: "",
    offeringDuration: "",
    offeringEndDate: "",
    exchangeOpensOn: ""
  });
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/${id}/?view=overview`;
        const response = await axios.get<PropertyData>(apiUrl);
        setProperty(response.data);

        setProgress(50);
        setValueAmount(<FormatCurrency amount={response.data.price} />);
        
        // Check if property data is loaded and property_type exists before accessing additional data
        if (response.data && response.data.property_type) {
          const extraPropertyDetails = propertyExtraData[response.data.property_type]?.overview?.additionalFinancialInformation;
          if (extraPropertyDetails) {
            setPropertyExtra(extraPropertyDetails);
          }
        }
      } catch (error) {
        console.error('Failed to fetch property data:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!property) return <div className="flex items-center justify-center h-screen">
  < LoadingSpinner/>
 </div>;

    const minPrice = property.price * 0.8;
    const maxPrice = property.price * 1.2;

  return (
    <section className='md:pl-5 text-lg'> 
        <div className="border-b py-5">
          <h4 className="text-xl font-semibold mb-2">{property.title}</h4>
          <p className="text-medium text-gray-500">{property.location}, {property.post_code} </p>
        </div> 
        <div className="mt-6 space-y-6  bg-[#F4FAE2] rounded-lg p-4 ">
          <div className="flex items-center space-x-5">
            <FaBath className="text-xl" />
            <span className="text-xl">{property.bathrooms || 'N/A'} Bath</span>
          </div>
  
          <div className="flex items-center space-x-5">
            <FaBed className="text-xl" />
            <span className="text-xl">{property.bedrooms || 'N/A'} Beds</span>
          </div>
  
          <div className="flex items-center space-x-5">
            <FaRulerCombined className=" text-xl" />
            <span className="text-xl">{property.size || 'N/A'} sq ft</span>
          </div>
          <div className="flex items-center space-x-5">
            <FaHouse className=" text-xl" />
            <span className="text-xl">{property.property_type || 'N/A'}</span>
          </div>
        </div>

        <div className="mt-[40px] featureContainer  bg-[#F4FAE2] rounded-lg p-4 ">
          <h2 className="text-2xl font-semibold mb-2">Financial Information Resume</h2>
          <ul className="space-y-2">
              <li className="flex justify-between">
                  <span >IRR (Internal Rate of Return)</span>
                  <span className="font-semibold">{propertyExtra.IRR}</span>
              </li>
              <li className="flex justify-between">
                  <span>NOI (Net Operating Income)</span>
                  <span className="font-semibold">{propertyExtra.NOI}</span>
              </li>
              <li className="flex justify-between">
                  <span>Total Tenants</span>
                  <span className="font-semibold">{propertyExtra.totalTenants}</span>
              </li>
              <li className="flex justify-between">
                  <span>Minimum Investment</span>
                  <span className="font-semibold">{propertyExtra.minimumInvestment}</span>
              </li>
              <li className="flex justify-between">
                  <span>Days Remaining</span>
                  <span className="font-semibold">{propertyExtra.daysRemaining}</span>
              </li>
              <li className="flex justify-between">
                  <span>Offering Duration</span>
                  <span className="font-semibold ">{propertyExtra.offeringDuration}</span>
              </li>
              <li className="flex justify-between">
                  <span>Offering End Date</span>
                  <span className="font-semibold">{propertyExtra.offeringEndDate}</span>
              </li>
              <li className="flex justify-between">
                  <span>Exchange Opens On</span>
                  <span className="font-semibold">{propertyExtra.exchangeOpensOn}</span>
              </li>
          </ul>

        </div>
  
        <div className="mt-[40px] featureContainer  bg-[#F4FAE2] rounded-lg p-4   ">
          <h4 className="text-2xl font-semibold mb-2">Estimated Value</h4>
          <p className="text-base text-gray-500">
            Based on recent sales data, market trends, and property conditions.
          </p>
  
          <div className="relative flex items-center justify-center mt-[60px] ">
            <Progress value={progress} className="w-3/5" />
            <div className="absolute left-1/2 transform -translate-x-1/2 mb-[60px] text-2xl font-semibold text-gray-800">
              {valueAmount}
            </div>
          </div>
  
          <div className="flex justify-between text-base text-gray-500 mt-2 w-3/5 mx-auto">
            <span>{<FormatCurrency amount={minPrice} />}</span>
            <span>{<FormatCurrency amount={maxPrice} />}</span>
          </div>
        </div>
  
        <div className="featureContainer break-words   bg-[#F4FAE2] rounded-lg p-4  py-5">
          <h4 className="text-2xl font-semibold mb-4">Description</h4>
          <p className="text-gray-700 mb-5">
            {property.description || 'Description not available'}
          </p>
        </div>
  
        <div className="mt-[40px] featureContainer my-[40px]   bg-[#F4FAE2] rounded-lg p-4  ">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
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
  
        <div className="featureContainer my-[40px]  bg-[#F4FAE2] rounded-lg p-4 ">
            <h2 className="text-2xl  font-bold mb-4">Area  Overview</h2>   
            <ul className=" info-section mb-5">
                <li className="info-item flex justify-between py-2">
                    <span>Population</span>
                    <span className="font-semibold">983,944</span>
                </li>
                <li className="info-item flex justify-between py-2">
                    <span>Household Income</span>
                    <span className="font-semibold">£130,277</span>
                </li>
                <li className="info-item flex justify-between py-2">
                    <span>Median Property Value</span>
                    <span className="font-semibold">£1,065,200</span>
                </li>
                <li className="info-item flex justify-between py-2">
                    <span>Median Age</span>
                    <span className="font-semibold">37.8</span>
                </li>
                <li className="info-item flex justify-between py-2">
                    <span>Unemployment Rate</span>
                    <span className="font-semibold">3.8%</span>
                </li>
            </ul>
          </div>

            <div className="featureContainer my-[40px]  bg-[#F4FAE2] rounded-lg p-4 ">

            <h3 className="text-2xl font-bold mb-2">Market Analysis</h3>
            <p className="mb-4">
                <strong>{property.location} Overview:</strong>
                <br />
                Ranked among the top 25 fastest-growing regions in the UK, {property.location} boasts a strong job market, affordability, and consistent upward rental growth. 
                From 2012 to 2019, equity growth in 3-bedroom homes appreciated by 35%.
            </p>

            <p>
                Rated as a top neighbourhood, the {property.location} area offers amenities 
                such as restaurants, shopping, access to the tennis grounds, and entertainment, 
                with proximity to corporate offices.
            </p>
        </div>
          <MapView  location={property.location} />
        <div className="featureContainer  my-[40px] bg-[#F4FAE2] rounded-lg p-4 ">
          <h4 className="text-2xl font-semibold">Historical sold prices in {property.location}</h4>
          <HistoricalPrice />
        </div>
    </section>
  );
  
};