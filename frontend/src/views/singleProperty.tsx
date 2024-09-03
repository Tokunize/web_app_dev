import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaShare } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/buyPropertyForm";

// Define the PropertyResponse interface
interface PropertyResponse {
  image: string[];
  video_urls: string[];
}

// Define the component
export const SingleProperty: React.FC = () => {
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [propertyVideos, setPropertyVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrice, setTokenPrice] = useState<number>(0); //
  const [anuReturns, setAnuReturns] = useState<number>(0);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

    const fetchPropertyData = async () => {
      try {
        const apiUrl = `${backendUrl}property/properties/${id}/?view=images`;
        const response = await axios.get<PropertyResponse>(apiUrl);

        setPropertyImages(response.data.image);
        setPropertyVideos(response.data.video_urls);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  useEffect(() => {
    const fetchPropertyOverview = async () => {
      try {
        const apiUrl = `http://127.0.0.1:8000/property/properties/${id}/?view=overview`;
        const response = await axios.get<{ token_price: number, projected_annual_return:number }>(apiUrl);
        
        setTokenPrice(response.data.token_price);
        setAnuReturns(response.data.projected_annual_return)
      } catch (error) {
        console.error('Failed to fetch property overview:', error);
        setError('Failed to fetch property overview');
      }
    };

    if (id) {
      fetchPropertyOverview();
    }
  }, [id]);

  const getEmbedUrl = (videoUrl: string): string => {
    const urlParams = new URLSearchParams(new URL(videoUrl).search);
    const videoId = urlParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  };

  const showImages = () => {
    return propertyImages.slice(1, 5).map((image, index) => (
      <div key={index} className="imageContainer h-full">
        <img
          src={image}
          alt={`Property Image ${index + 1}`}
          className={`
            object-cover w-full h-full
            ${index === 1 ? 'rounded-tr-xl' : ''}
            ${index > 2 ? 'rounded-br-xl' : ''}
          `}
        />
      </div>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="md:px-[80px]">
      <div className="flex justify-between items-center md:py-[20px]">
        <div className="flex items-center space-x-2">
          <a href="/" className="bg-[#A0CC29] rounded-full p-1">
            <FaArrowLeft className="text-white" />
          </a>
          <span className="text-normal cursor-pointer">Back to Marketplace</span>
        </div>

        {/* Right Side: Share Button */}
        <Button variant="outline" className="flex items-center space-x-2">
          <FaShare className="text-gray-700" />
          <span className="text-gray-700">Share</span>
        </Button>
      </div>

      <div className="flex flex-row h-auto md:h-[580px] gap-4">
        {/* Left side: Video in a big square */}
        <div className="w-1/2 flex justify-center items-center">
          {propertyVideos[0] && (
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(propertyVideos[0])}
              title="Property Video"
              frameBorder="0"
              className="rounded-l-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>

        {/* Right side: Four smaller squares */}
        <div className="w-1/2 grid grid-cols-2 gap-4">
          {showImages()}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <div className="md:w-[65%]">
          {id && <PropertyAccordion property_id={id} />}
        </div>
        <div className="md:w-[30%]">
          <PurchaseForm tokenPrice={tokenPrice} projected_annual_return={anuReturns} />
        </div>
      </div>
    </section>
  );
};
