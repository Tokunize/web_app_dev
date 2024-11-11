import { Carousel } from "flowbite-react";
import { Progress } from "flowbite-react";
import {  useState } from "react";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";

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
  propertyId: number;
}

export const SinglePropertyDetailOnModal = ({ propertyId }: Props) => {
  const [progressEquity, setProgressEquity] = useState<number>(0);

  // Fetch the data with custom hook
  const { data, loading, error } = useGetAxiosRequest<PropertyData>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/${propertyId}/landing-page/?view=payment`
  );

  // Show a loading spinner while fetching data
  if (loading) return <LoadingSpinner />;

  // Handle error if data fetching fails
  if (error) {
    console.log(error);
    return <div>Error loading data.</div>;
  }

  // Handle case where data is missing or invalid
  if (!data) {
    return <div>No data found for this property.</div>;
  }

  return (
    <section className="flex flex-col">
      <div>
        <h2 className="font-bold text-xl mb-4">Buy Equity</h2>
      </div>
      <div className="flex flex-row space-x-3">
        {/* Property details and image carousel */}
        <aside className="w-1/2 flex flex-col text-left">
          <Carousel indicators={true} slide={false} className="h-[50%]">
            {data.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${data.title} image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>

          <header className="mt-3">
            <h1 className="font-semibold">{data.title}</h1>
          </header>

          <dl>
            <dt className="text-sm text-gray-500">Property Type</dt>
            <dd className="mb-2">{data.property_type}</dd>

            <dt className="text-sm text-gray-500">Full Address</dt>
            <dd>{data.location}</dd>
          </dl>
        </aside>

        {/* Financial and equity details */}
        <article className="w-1/2 space-y-3">
          <div className="border rounded-lg p-4">
            <ul className="space-y-2">
              <li className="flex flex-col text-sm text-gray-500">
                Est. Annual Yield
                <span className="text-black text-lg">{data.financials_details.projected_annual_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Est. Monthly Yield
                <span className="text-black text-lg">{data.financials_details.projected_rental_yield} %</span>
              </li>
              <li className="flex flex-col text-sm text-gray-500">
                Current Value
                <span className="text-black text-lg">£ {data.price}</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <header>
              <h3 className="font-bold text-2xl text-[#C7E770]">{data.title}</h3>
            </header>
            <ul className="space-y-2">
              <li className="flex justify-between">
                Equity Listed <span>£ {data.price}</span>
              </li>
              {/* For demonstration, using a static 30% for the first progress bar */}
              <Progress progress={30} className="w-[60%]" />
              <li className="flex justify-between">
                Equity Sold <span>{progressEquity.toFixed(2)} %</span>
              </li>
              {/* The second progress bar reflects the actual equity sold */}
              <Progress progress={progressEquity} className="w-[60%]" />
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};
