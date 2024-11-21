import { Carousel } from "flowbite-react";
import { Progress } from "flowbite-react";
import {  useState } from "react";
import { FormatCurrency } from "@/components/currencyConverter";

// Define types for the expected data structure
interface FinancialDetails {
  projected_annual_yield: number;
  projected_rental_yield: number;
}

interface PropertyData {
  title: string;
  location: string;
  property_type: string;
  price: number;
  image: string[];
  financials_details: FinancialDetails;
}

interface Props {
  propertyData: PropertyData
}

export const SinglePropertyDetailOnModal = ({ propertyData }: Props) => {
  const [progressEquity, setProgressEquity] = useState<number>(0);

  return (
    <section className="flex flex-col">
      <div className="flex flex-row space-x-3">
        {/* Property details and image carousel */}
        <aside className="w-1/2 flex flex-col text-left">
          <Carousel indicators={true} slide={false} className="h-[50%]">
            {propertyData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${propertyData.title} image ${index + 1}`}
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
            <dd>{propertyData.location}</dd>
          </dl>
        </aside>

        {/* Financial and equity details */}
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
                <span className="text-black text-lg"><FormatCurrency amount={propertyData.price}/></span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex text-sm justify-between">
                Equity Listed <span> <FormatCurrency amount={propertyData.price}/></span>
              </li>
              {/* For demonstration, using a static 30% for the first progress bar */}
              <Progress progress={30} />
              <li className="flex   text-sm justify-between">
                Equity Sold <span>{progressEquity.toFixed(2)} %</span>
              </li>
              {/* The second progress bar reflects the actual equity sold */}
              <Progress progress={progressEquity} />
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};
