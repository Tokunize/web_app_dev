import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from "flowbite-react";
import token from "../assets/token.svg";
import shareIcon from "../assets/Share.png";

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: string;
  estAnnualReturn: string;
  propertyImgs: string[];
  id: string;
  tokensSold: number | undefined;  // Permitir undefined temporalmente
  totalTokens: number | undefined;  // Permitir undefined temporalmente
  createdDay: string;
  status: string;  
  tokens_available: number;
}

export const PropertyListCard: React.FC<PropertyListCardProps> = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImgs,
  id,
  totalTokens = 0,  // Asignar 0 como valor predeterminado
  createdDay,
  status,
  tokens_available
}) => {
  const [badgeType, setBadgeType] = useState<string | null>(null);

  useEffect(() => {
    const createdDate = new Date(createdDay);
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7); // Cambiado a 7 días para una semana

    // Calcular los tokens vendidos
    const soldTokens = totalTokens ? totalTokens - tokens_available : 0; // Asegúrate de que totalTokens no sea undefined
    const soldPercentage = totalTokens > 0 ? (soldTokens / totalTokens) * 100 : 0; // Evita división por cero

    if (soldPercentage > 80) {
      setBadgeType('Almost Gone!');
    } else if (createdDate >= oneWeekAgo && status === "published") {
      setBadgeType('New');
    } else if (status === "coming_soon") {
      setBadgeType('Coming Soon');
    } else {
      setBadgeType(null);
    }
  }, [tokens_available, totalTokens, createdDay, status]); // Dependencias actualizadas

  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
      {/* Badge for New */}
      {badgeType === 'New' && (
        <div className="absolute top-4 left-4 bg-[#FFFAEA] border-2 border-[#FDB122] text-[#B54707] text-xs font-semibold py-1 px-2 rounded-full z-20">
          New
        </div>
      )}

      {/* Badge for Almost Done */}
      {badgeType === 'Almost Gone!' && (
        <div className="absolute top-4 left-4 border-2 border-[#F97066] bg-[#FEF4F3] text-[#B42217] text-xs font-semibold py-1 px-2 rounded-full z-20">
          Almost Gone!
        </div>
      )}

      {/* Badge for Coming Soon */}
      {badgeType === 'Coming Soon' && (
        <div className="absolute top-4 left-4 bg-[lightgray] border-2 border-[gray] text-black text-xs font-semibold py-1 px-2 rounded-full z-20">
          Coming Soon
        </div>
      )}

      {/* Share Icon */}
      {status === "published" && (
        <Link
          to={`/property-details/${id}`}
          className="absolute top-4 right-4 h-8 w-8 p-2 bg-white bg-opacity-50 rounded-full hover:bg-accent hover:text-accent-foreground shadow-lg duration-300 z-10"
        >
          <img src={shareIcon} alt="share" className="h-full" />
        </Link>
      )}

      {/* Link for Image Carousel */}
      <Link to={`/property-details/${id}`} className="h-64 relative block hover:opacity-80 transition-opacity duration-300">
        <Carousel
          indicators={true}  // Show indicators for slides
          slide={false}
          className="custom-landing-carousel"
        >
          {propertyImgs.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${title} image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
        </Carousel>
      </Link>

      <div className="py-3">
        <div className="flex items-center justify-end">
          <div className="float-right text-sm text-gray-500 flex items-center ">
            {status === "published" ? (
              <>
                <span><img src={token} alt="token" className="inline-block h-[20px] w-[20px] mr-2" /></span> {tokens_available} Tokens Left
              </>
            ) : (
              'Coming Soon'
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{location}</p>
        <div className="flex justify-between mb-2">
          <p className="font-medium">£{minTokenPrice}</p>
          <span className="text-gray-500">Min. token price</span>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">{estAnnualReturn}%</p>
          <span className="text-gray-500">Est. annual returns</span>
        </div>
      </div>
    </article>
  );
};
