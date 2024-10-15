import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/forms/buyPropertyForm";
import { useUser } from "@/context/userProvider";
import { BackButton } from "@/components/buttons/backButton";
import { LoadingSpinner } from "@/components/dashboard/loadingSpinner";
import shareIcon from "../assets/Share.png";

interface PropertyResponse {
  image: string[];
  video_urls: string[];
}

interface OverviewResponse {
  tokens: { token_price: number }[];
  projected_annual_return: number;
}

export const SingleProperty: React.FC = () => {
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [anuReturns, setAnuReturns] = useState<number>(0);
  const { role } = useUser();
  const { id } = useParams<{ id: string }>();

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

  // Function to fetch property data
  const fetchPropertyData = async () => {
    try {
      const [propertyResponse, overviewResponse] = await Promise.all([
        axios.get<PropertyResponse>(`${backendUrl}property/${id}/?view=images`),
        axios.get<OverviewResponse>(`${backendUrl}property/${id}/?view=overview`)
      ]);

      setPropertyImages(propertyResponse.data.image);
      setTokenPrice(overviewResponse.data.tokens[0].token_price);
      setAnuReturns(overviewResponse.data.projected_annual_return);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch property data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  const isDataLoaded = useMemo(() => {
    return propertyImages.length > 0 && tokenPrice > 0 && anuReturns > 0;
  }, [propertyImages, tokenPrice, anuReturns]);

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <LoadingSpinner />
    </div>
  );

  if (error) return <div>{error}</div>;

  return (
    <section className="md:px-[80px]">
      <div className="flex justify-between items-center md:py-[20px]">
        <BackButton />
        <Button variant="outline" className="flex items-center space-x-2">
          <span className="text-gray-700">Share</span>
          <img alt="share" className="h-4" src={shareIcon} />
        </Button>
      </div>

      <div className="flex flex-row h-auto md:h-[580px] gap-4">
        {/* First image goes here */}
        <div className="w-1/2 flex justify-center items-center">
          {isDataLoaded && propertyImages[0] && (
            <img
              src={propertyImages[0]}
              alt="First Property Image"
              className="object-cover w-full h-full rounded-tl-xl"
            />
          )}
        </div>

        {/* Other images */}
        <div className="w-1/2 grid h-[580px] grid-cols-2 gap-4 overflow-hidden">
          {isDataLoaded && propertyImages.slice(1).map((image, index) => (
            <div key={index + 1} className="imageContainer h-[100%] overflow-hidden">
              <img
                src={image}
                alt={`Property Image ${index + 2}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <div className="md:w-[65%]">
          {id && <PropertyAccordion property_id={id} />}
        </div>
        <div className="md:w-[30%]">
          <PurchaseForm
            property_id={id}
            role={role}
            tokenPrice={tokenPrice}
            projected_annual_return={anuReturns}
          />
        </div>
      </div>
    </section>
  );
};
