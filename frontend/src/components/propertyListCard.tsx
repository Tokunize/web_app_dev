import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from "../assets/share.png"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
  investment_category: string;
}

const investmentData: { [key: string]: { risk: string; income: string; capitalGrowth: string; return: string } } = {
  Core: {
    risk: "Low",
    income: "High",
    capitalGrowth: "Low",
    return: "Medium-High"
  },
  Opportunistic: {
    risk: "High",
    income: "None",
    capitalGrowth: "High",
    return: "High"
  },
};

export const PropertyListCard: React.FC<PropertyListCardProps> = ({
  title,
  location,
  minTokenPrice,
  estAnnualReturn,
  propertyImgs,
  id,
  totalTokens = 0,  
  createdDay,
  status,
  tokens_available,
  investment_category
}) => {
  const [badgeType, setBadgeType] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(""); 
  const [isCardBack, setIsCardBack] = useState<boolean>(false)
  const [showControls, setShowControls] = useState(false);


  const currentData = investmentData[investment_category] || {
    risk: "Low",
    income: "High",
    capitalGrowth: "Low",
    return: "High"
  };

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

    if (investment_category != null) {
      if (investment_category === "Opportunistic") {
        setCategory("Opportunistic");
      } else if (investment_category === "Core") {
        setCategory("Core");
      }
    }
  }, []); 
  
  const taggleCardPosition = () => {
    setIsCardBack(prevValue => !prevValue);
  }

  return (
    <article className="relative rounded-lg overflow-hidden mt-6">
      {!isCardBack && (
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
      )}

      {/* Link for Image Carousel */}
      <Link
      to={`/property-details/${id}`}
      className="h-64 relative block hover:opacity-80 transition-opacity duration-300"
      onMouseEnter={() => setShowControls(true)} // Mostrar botones al hacer hover
      onMouseLeave={() => setShowControls(false)} // Ocultar botones al salir
    >
      <Carousel className="h-full">
        <CarouselContent>
          {propertyImgs.slice(0, 3).map((img, index) => (
            <CarouselItem key={index}>
              <img
                src={img}
                alt={`${title} image ${index + 1}`}
                className="w-full rounded-lg h-[250px] object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controles de navegación */}
        <div className={`carousel-controls ${showControls ? 'visible' : ''}`}>
          <CarouselPrevious/>
          <CarouselNext />
        </div>
      </Carousel>
    </Link>

      <div className="py-3"
        // onMouseOver={taggleCardPosition}
        // onMouseLeave={taggleCardPosition}
        >
        <div className="flex items-center justify-end">
          <div className="float-right text-sm text-gray-500 flex items-center">
            {status === "published" ? (
              <>
                {tokens_available?.toLocaleString()} Tokens Left
              </>
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

      {/* Overlay for Backside Content */}
      <div
        className={`absolute  inset-0 bg-[#C8E869] shadow-xl rounded-lg p-8 transition-transform duration-500 ease-in-out transform ${
          isCardBack ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <h2 className="text-xl font-semibold mb-2 border-b pb-2">{title}</h2>
        {/* Tabla para la información */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Category</th>
                <th className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-1 text-gray-700 text-sm font-medium">Risk</td>
                <td className="px-4 py-1 text-sm font-medium">{currentData.risk}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-1 text-gray-700 text-sm font-medium">Income</td>
                <td className="px-4 py-1 text-sm font-medium">{currentData.income}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-1 text-gray-700 text-sm font-medium">Capital Growth</td>
                <td className="px-4 py-1 text-sm font-medium">{currentData.capitalGrowth}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-1 text-gray-700 text-sm font-medium">Return</td>
                <td className="px-4 py-1 text-sm font-medium">{currentData.return}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
};
