import React, { useState } from 'react';
import { MyAssetsTable } from './myAssetsTable';

// Define the Investment interface
interface Investment {
  first_image: string;
  title: string;
  user_tokens: Array<{ number_of_tokens: number }>;
  projected_rental_yield: number;
  price: number;
  location: string;
  tokens: Array<{ total_tokens: number }>;
  updated_at: string; 
}

interface AssetsAccordion {
  data: Investment[];
}
 
export const AssetsAccordion: React.FC<AssetsAccordion> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  
  // Map data to the required format for DataTableDemo
  const assetsData = data.map((property) => ({
    image: property.first_image,
    title: property.title,
    user_tokens: property.user_tokens[0]?.number_of_tokens || 0,
    projected_rental_yield: property.projected_rental_yield,
    net_asset_value: property.price,
    location: property.location,
    total_tokens: property.tokens[0]?.total_tokens || 0,
    status: "Vacant",
    projected_appreciation: 1.2,
    total_rental_income: 23343,
    price_change: 4.7,
    cap_rate: 3.5,
  }));

  const listingData = data.map((property) => ({
    image: property.first_image,
    title: property.title,
    projected_rental_yield: property.projected_rental_yield,
    listing_price: 45,
    user_tokens: property.user_tokens[0]?.number_of_tokens || 0,
    location: property.location,
    total_tokens: property.tokens[0]?.total_tokens || 0,
    status: "Vacant",
    cap_rate: 3.5,
    listing_date:property.updated_at
  }));

  return (
    <div className="border-0 mt-4 bg-white rounded-lg p-4 overflow-hidden">
      <div className="flex space-x-4 mb-4">
        {['My Assets', 'Listings'].map((title, index) => (
          <button
            key={index}
            className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === index ? 'border-black' : 'border-transparent'}`}
            onClick={() => handleClick(index)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
          {activeIndex === 0 && <MyAssetsTable assetsData={assetsData} />}
          {activeIndex === 1 && <MyAssetsTable assetsData={listingData} />}

      </div>
    </div>
  );
};
