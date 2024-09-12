import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Carousel } from "flowbite-react";
import token from "../assets/img/token.svg";

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: string;
  estAnnualReturn: string;
  propertyImgs: string[];
  id: string;
  tokensSold: number;
  totalTokens: number;
  createdDay: string;
  status: string;  // Use status instead of active
}

export const PropertyListCard: React.FC<PropertyListCardProps> = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImgs,
  id,
  tokensSold,
  totalTokens,
  createdDay,
  status
}) => {
  const [tokensLeft, setTokensLeft] = useState(0);
  const [badgeType, setBadgeType] = useState<string | null>(null);

  useEffect(() => {
    // Calculate remaining tokens
    const remainingTokens = totalTokens - tokensSold;
    setTokensLeft(remainingTokens);
    console.log('Status:', status); // Añade esto para depurar



    // Check if the property is new (within the last 6 months)
    const createdDate = new Date(createdDay);
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6); // Corrected to 6 months

    if (createdDate >= sixMonthsAgo && status === "published") {
      setBadgeType('New');
    } else if (status === "coming_soon") {
      setBadgeType('Coming Soon');
    } else if ((tokensSold / totalTokens) * 100 >= 80) {
      setBadgeType('Almost Gone!');
    } else {
      setBadgeType(null);
    }
  }, [tokensSold, totalTokens, createdDay]);

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
      {status === "published" && (
        <Link
          to={`property-details/${id}`}
          className="absolute top-4 right-4 transform rotate-[-45deg] bg-white bg-opacity-50 p-2 rounded-full shadow-lg z-10"
        >
          <FaArrowRight className="text-gray-800" />
        </Link>
      )}

      <div className="h-64 relative">
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
      </div>
      <div className="py-3">
        <div className="flex items-center justify-end">
          <div className="float-right text-sm text-gray-500 flex items-center ">
            {status ==="published" ? (
              <>
                <span><img src={token} alt="token" className="inline-block h-[20px] w-[20px] mr-2" /></span>  Tokens Left
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
