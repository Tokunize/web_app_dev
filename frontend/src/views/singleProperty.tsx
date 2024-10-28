import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/forms/buyPropertyForm";
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
  const { id } = useParams<{ id: string }>();
  
  // Convertir el ID a número, asegurando que no sea null
  const numericId = id ? parseInt(id, 10) : undefined; // Cambia null a undefined

  const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

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

  // Asegurarse de que numericId no sea undefined o NaN
  if (numericId === undefined || isNaN(numericId)) {
    return <div>Invalid property ID</div>; // Manejar caso de ID inválido
  }

  return (
    <section className="px-[20px] md:px-[60px]">
      <div className="flex justify-between items-center md:py-[20px]">
        <BackButton />
        <Button variant="outline" className="flex items-center space-x-2">
          <span className="text-gray-700">Share</span>
          <img alt="share" className="h-4" src={shareIcon} />
        </Button>
      </div>

      <div className="flex flex-row h-[580px] gap-4">
        {/* Primera imagen */}
        <div className="w-1/2 flex justify-center items-center h-full">
          {isDataLoaded && propertyImages[0] && (
            <img
              src={propertyImages[0]}
              alt="First Property Image"
              className="object-cover w-full h-full rounded-tl-xl rounded-bl-xl"
            />
          )}
        </div>

        {/* Galería de imágenes en la segunda columna */}
        <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {propertyImages.length > 1 && (
            <>
              {/* Imagen de la derecha, fila 1, columna 1 */}
              <div className="h-[100%] cover rounded-tr-xl">
                <img
                  src={propertyImages[1]}
                  alt="Property Image 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Imagen de la derecha, fila 1, columna 2 */}
              <div className="h-[100%] cover">
                <img
                  src={propertyImages[2]}
                  alt="Property Image 3"
                  className="w-full h-full object-cover rounded-tr-xl"
                />
              </div>

              {/* Imagen de la derecha, fila 2, columna 1 */}
              <div className="h-[100%] cover">
                <img
                  src={propertyImages[3]}
                  alt="Property Image 4"
                  className="w-full h-full object-cover "
                />
              </div>

              {/* Imagen de la derecha, fila 2, columna 2 */}
              <div className="h-[100%] cover rounded-br-xl">
                <img
                  src={propertyImages[4]}
                  alt="Property Image 5"
                  className="w-full h-full object-cover rounded-br-xl"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-[40px] justify-between mt-8">
        <div className="md:w-2/3">
          {/* Asegúrate de que numericId no sea null o undefined */}
          {numericId && <PropertyAccordion property_id={numericId} />}
        </div>
        <div className="md:w-1/3">
          <PurchaseForm
            property_id={numericId}
            tokenPrice={tokenPrice}
            projected_annual_return={anuReturns}
          />
        </div>
      </div>
    </section>
  );
};
