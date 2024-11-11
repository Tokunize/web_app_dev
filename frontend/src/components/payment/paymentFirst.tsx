import { Carousel } from "flowbite-react";
import { Progress } from "../ui/progress";
import { useEffect, useState } from "react";
import { FormatCurrency } from "../currencyConverter";

interface PaymentFirstProps {
  property_id: number; 
  propertyData?: {
    title: string;
    location: string;
    property_type: string;
    image: string[];
    price: number;
    financials_details: {
      projected_annual_yield: number;
      projected_rental_yield: number;
    };
    tokens: {
      total_tokens: number;
      tokens_available: number;
    }[];
  };
}

export const PaymentFirst: React.FC<PaymentFirstProps> = ({ propertyData }) => {
  const [progressEquity, setProgressEquity] = useState<number>(0);

  if (!propertyData) {
    return <div>Error: Property data is missing</div>;
  }

  useEffect(() => {
    if (propertyData.tokens && propertyData.tokens[0]) {
      const totalTokens = propertyData.tokens[0].total_tokens;
      const availableTokens = propertyData.tokens[0].tokens_available;
      const soldTokens = totalTokens - availableTokens;

      const totalPercentage = (soldTokens / totalTokens) * 100;
      setProgressEquity(totalPercentage);
    }
  }, [propertyData]);

  return (
    <section className="flex flex-col ">
      <div>
        <h2 className="font-bold text-xl mb-4">Buy Equity</h2>
      </div>
      <div className="flex flex-row space-x-3">
        <aside className="w-1/2 flex flex-col text-left">
          <Carousel indicators={true} slide={false} className="h-[50%]">
            {propertyData.image.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`${propertyData.title || "Property"} image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>

          <header className="mt-3">
            <h1 className="font-semibold">{propertyData.title}</h1>
          </header>

          <dl>
            <dt className="text-sm text-gray-500">Property Type</dt>
            <dd className="mb-2">{propertyData.property_type}</dd>

            <dt className="text-sm text-gray-500">Full Address</dt>
            <dd className="">{propertyData.location}</dd>
          </dl>
        </aside>

        <article className="w-1/2 space-y-3">
          <div className="border rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex flex-col text-sm text-gray-500">
                Est. Annual Yield
                <span className="text-black text-lg">{propertyData.financials_details.projected_annual_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Est. Monthly Yield
                <span className="text-black text-lg">{propertyData.financials_details.projected_rental_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Current Value
                <span className="text-black text-lg"><FormatCurrency  amount={propertyData.price}/></span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <header>
              <h3 className="font-bold text-2xl text-[#C7E770]">{propertyData.title}</h3>
            </header>
            <ul className="space-y-2">
              <li className="flex justify-between">
                Equity Listed <span> <FormatCurrency amount={propertyData.price}/> </span>
              </li>
              <Progress value={progressEquity} className="w-[60%]" />
              <li className="flex justify-between">
                Equity Sold <span>{progressEquity.toFixed(2)} %</span>
              </li>
              <Progress value={progressEquity} className="w-[60%]" />
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};
