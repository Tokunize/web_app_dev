import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FaShare } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/forms/buyPropertyForm";
import { useUser } from "@/context/userProvider";
import { BackButton } from "@/components/buttons/backButton";

interface PropertyResponse {
  image: string[];
  video_urls: string[];
}

export const SingleProperty: React.FC = () => {
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrice, setTokenPrice] = useState<number>(0); //
  const [anuReturns, setAnuReturns] = useState<number>(0);
  const {role } = useUser()

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

    const fetchPropertyData = async () => {
      try {
        const apiUrl = `${backendUrl}property/${id}/?view=images`;
        const response = await axios.get<PropertyResponse>(apiUrl);

        setPropertyImages(response.data.image);
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
        const apiUrl = `http://127.0.0.1:8000/property/${id}/?view=overview`;
        const response = await axios.get<{ token_price: number, projected_annual_return:number }>(apiUrl);
        
        setTokenPrice(response.data.tokens[0].token_price);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="md:px-[80px]">
      <div className="flex justify-between items-center md:py-[20px]">
        <BackButton/>

        {/* Right Side: Share Button */}
        <Button variant="outline" className="flex items-center space-x-2">
          <FaShare className="text-gray-700" />
          <span className="text-gray-700">Share</span>
        </Button>
      </div>

      <div className="flex flex-row h-auto md:h-[580px] gap-4">
        {/* First image goes here */}
          <div className="w-1/2 flex justify-center items-center">
            {propertyImages[0] && (
              <img
                src={propertyImages[0]}
                alt="First Property Image"
                className="object-cover w-full h-full rounded-tl-xl"
              />
            )}
          </div>

          {/* Other images */}
          <div className="w-1/2 grid h-[580px] grid-cols-2 gap-4 overflow-hidden">
            {propertyImages.slice(1).map((image, index) => (
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
