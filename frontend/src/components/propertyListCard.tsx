import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from "../assets/share.png"
import CustomCarousel from './CustomCarousel';

interface PropertyListCardProps {
  title: string;
  location: string;
  minTokenPrice: number;
  estAnnualReturn: string;
  propertyImgs: string[];
  reference_number: string;
  tokensSold: number | undefined;  
  totalTokens: number | undefined;  
  createdDay: string;
  status: string;  
  tokens_available: number;
  investment_category: string;
}


export const PropertyListCard = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImgs,
  totalTokens = 0,  
  createdDay,
  status,
  reference_number,
  tokens_available,
  investment_category
}:PropertyListCardProps) => {
  const [badgeType, setBadgeType] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(""); 


  useEffect(() => {
    const createdDate = new Date(createdDay);
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7); // Cambiado a 7 días para una semana

    // Calcular los tokens vendidos
    const soldTokens = totalTokens ? totalTokens - tokens_available : 0; // Asegúrate de que totalTokens no sea undefined
    const soldPercentage = totalTokens > 0 ? (soldTokens / totalTokens) * 100 : 0; // Evita división por cero

    if(status === "sold"){
      setBadgeType("Sold")
    }
    else if (soldPercentage > 80) {
      setBadgeType('Almost Gone!');
    } else if (createdDate >= oneWeekAgo && status === "published") {
      setBadgeType('New');
    } else if (status === "coming_soon") {
      setBadgeType('Coming Soon');
    } else {
      setBadgeType(null);
    }

    if (investment_category != null) {
      if (investment_category === "Opportunistic") {
        setCategory("Opportunistic");
      } else if (investment_category === "Core") {
        setCategory("Core");
      }
    }
  }, []); 

  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
        <>
          <span 
            className='absolute cursor-pointer left-4 top-[215px] bg-black  text-white text-xs font-semibold py-1 px-2 rounded-full z-20'
          >
            {category}
          </span>
          
          {/* Badge for New */}
          {badgeType === 'New' && (
            <div className="absolute top-4 left-4 bg-[#FFFAEA] border-2 border-[#FDB122] text-[#B54707] text-xs font-semibold py-1 px-2 rounded-full z-20">
              New
            </div>
          )}

          {badgeType === 'Sold' && (
            <div className="absolute top-4 left-4 bg-[#FFFAEA] border-2 border-[#FDB122] text-[#B54707] text-xs font-semibold py-1 px-2 rounded-full z-20">
              Sold
            </div>
          )}

          {/* Badge for Almost Gone! */}
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
          {(status === "published" || status === "coming_soon") && (
            <span
              className="absolute top-4 z-20 cursor-pointer right-4 h-8 w-8 p-2 bg-white bg-opacity-50 rounded-full hover:bg-accent hover:text-accent-foreground shadow-lg duration-300 z-10"
            >
              <img src={shareIcon} alt="share" className="h-full" />
            </span>
          )}
        </>
      <Link
      to={`/property/${reference_number}/`}
      className="h-64 relative block hover:opacity-80 transition-opacity duration-300">
      
    <CustomCarousel title='property-images' images={propertyImgs.slice(0, 3)}  />
      
    </Link>

      <div className="py-3">
        <div className="flex items-center justify-end">
          <div className="float-right text-sm text-gray-500 flex items-center">
          {status === "published" ? (
              <>
                {tokens_available} Tokens Left
              </>
            ) : status === "sold" ? (
              'Sold'
            ) : (
              'Coming Soon'
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{location}</p>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Projected annual returns</span>
          <p className="font-medium">{estAnnualReturn}%</p>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Token price</span>
          <p className="font-medium">£{minTokenPrice}</p>
        </div>
      </div>
    </article>
  );
};
