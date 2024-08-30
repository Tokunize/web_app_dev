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
}) => {
  const [tokensLeft, setTokensLeft] = useState(0);

  useEffect(() => {
    const remainingTokens = totalTokens - tokensSold;
    setTokensLeft(remainingTokens);
  }, [tokensSold, totalTokens]);

  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
      {/* Badge */}
      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full z-20">
        New
      </div>

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
