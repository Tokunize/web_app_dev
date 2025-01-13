// import { Carousel } from "flowbite-react";
// import { Progress } from "flowbite-react";
// import {  useEffect, useState } from "react";
import { FormatCurrency } from "@/components/currencyConverter";

interface PropertyData {
  title: string;
  location: string;
  property_type: string;
  price: number;
  image: string[];
  projected_annual_yield: number;
  projected_rental_yield: number;
}

interface Props {
  propertyData: PropertyData
}

export const SinglePropertyDetailOnModal = ({ propertyData }: Props) => {
  // const [progressEquity, setProgressEquity] = useState<number>(0);

  // useEffect(()=>{
  //   setProgressEquity(0)
  // },[])

  return (
    <section className="flex flex-col">
      <div className="flex flex-row space-x-3">
        {/* Property details and image carousel */}
        <aside className="w-1/2 flex flex-col text-left">
       

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
                <span className="text-black text-lg">{propertyData.projected_annual_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Est. Monthly Yield
                <span className="text-black text-lg">{propertyData.projected_rental_yield} %</span>
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
              {/* <li className="flex   text-sm justify-between">
                Equity Sold <span>{progressEquity.toFixed(2)} %</span>
              </li> */}
              {/* The second progress bar reflects the actual equity sold */}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};
