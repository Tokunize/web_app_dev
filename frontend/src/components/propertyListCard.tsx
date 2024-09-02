import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Carousel } from "flowbite-react";

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: string;
  estAnnualReturn: string;
  propertyImgs: string[];
  id: string;
  tokensSold: number;
  totalTokens: number;
  createdDay: string;  // ISO 8601 format
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
  createdDay
}) => {
  const [tokensLeft, setTokensLeft] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [isAlmostDone, setIsAlmostDone] = useState(false);

  useEffect(() => {
    // Calculate remaining tokens
    const remainingTokens = totalTokens - tokensSold;
    setTokensLeft(remainingTokens);

    // Check if the property is new (within the last 6 months)
    const createdDate = new Date(createdDay);
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    if (createdDate >= sixMonthsAgo) {
      setIsNew(true);
    } else {
      setIsNew(false);
    }

    // Check if the property is almost done (80% or more tokens sold)
    const percentageSold = (tokensSold / totalTokens) * 100;
    if (percentageSold >= 1) {
      setIsAlmostDone(true);
    } else {
      setIsAlmostDone(false);
    }
  }, [tokensSold, totalTokens, createdDay]);

  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
      {/* Badge for New */}
      {isNew && (
        <div className="absolute top-4 left-4 bg-[#FFFAEA] border-2 border-[#FDB122] text-[#B54707] text-xs font-semibold py-1 px-2 rounded-full z-20">
          New
        </div>
      )}

      {/* Badge for Almost Done */}
      {isAlmostDone && (
        <div className="absolute top-4 left-16 border-2 border-[#F97066] bg-[#FEF4F3] text-[#B42217] text-xs font-semibold py-1 px-2 rounded-full z-20">
          Almost Gone! 
        </div>
      )}

      <Link
        to={`property-details/${id}`}
        className="absolute top-4 right-4 transform rotate-[-45deg] bg-white bg-opacity-50 p-2 rounded-full shadow-lg z-10"
      >
        <FaArrowRight className="text-gray-800" />
      </Link>

      <div className="h-64 relative">
        <Carousel
          indicators={true}  // Show indicators for slides
          slide={false} // Disable automatic sliding
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
      <div className="p-4">
        <p className="float-right text-gray-500">{tokensLeft} Tokens left</p>
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
