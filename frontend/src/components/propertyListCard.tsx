import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: string;
  estAnnualReturn: string;
  propertyImg: string;
  linkTo: string;
}

export const PropertyListCard: React.FC<PropertyListCardProps> = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImg,
  linkTo,
}) => {
  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
      <Link
        to={linkTo}
        className="absolute top-4 right-4 transform rotate-[-45deg] bg-white bg-opacity-50 p-2 rounded-full shadow-lg"
      >
        <FaArrowRight className="text-gray-800" />
      </Link>
      <img
        alt={`${title}-image`}
        src={propertyImg}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{location}</p>
        <div className="flex justify-between mb-2">
          <p className="font-medium">{minTokenPrice}</p>
          <span className="text-gray-500">Min. token price</span>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">{estAnnualReturn}</p>
          <span className="text-gray-500">Est. annual returns</span>
        </div>
      </div>
    </article>
  );
};
