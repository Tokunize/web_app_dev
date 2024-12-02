import { PropertyListCard } from "@/components/propertyListCard";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { useState } from "react";
import bannerImg from "../assets/img/Banner.png";
import { PropertyFilters } from "@/components/propertyFilters";
import { Filters, Property } from "@/types";
import { MarketplaceSkeleton } from "@/components/skeletons/marketplaceSkeleton";


const sortProperties = (properties: Property[], sortBy: string): Property[] => {
  return properties.sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return parseFloat(a.tokens[0].token_price) - parseFloat(b.tokens[0].token_price);
      case "price_desc":
        return parseFloat(b.tokens[0].token_price) - parseFloat(a.tokens[0].token_price);
      case "annual_return_asc":
        return parseFloat(a.projected_annual_return) - parseFloat(b.projected_annual_return);
      case "annual_return_desc":
        return parseFloat(b.projected_annual_return) - parseFloat(a.projected_annual_return);
      default:
        return 0;
    }
  });
};

export const Marketplace = () => {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    property_type: "",
    sort_by: "",
  });

  const { data, loading, error } = useGetAxiosRequest<Property[]>(`${import.meta.env.VITE_APP_BACKEND_URL}property/marketplace-list/`);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  

  const filteredProperties = (properties: Property[]) => {
    return properties.filter((property) => {
      const meetsLocation = 
        !filters.location || property.location.toLowerCase() === filters.location.toLowerCase();
  
      const meetsPropertyType = 
        !filters.property_type || property.property_type.toLowerCase() === filters.property_type.toLowerCase();
  
      return meetsLocation && meetsPropertyType;
    });
  };
  

  const sortedProperties = (properties: Property[]) => {
    return sortProperties(filteredProperties(properties), filters.sort_by);
  };

  if (loading) return <MarketplaceSkeleton />;
  if(error){
    console.log(error);
    
  }

  return (
    <section className="px-[50px] ">
      <article
        className="rounded-lg bg-black flex flex-col justify-center pl-[20px] mt-5 space-y-5 py-[40px] mb-[40px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <h3 className="text-white tracking-wide font-bold text-3xl leading-relaxed">
          Invest in commercial
          <br /> real estate with <span className="text-[#C8E870]">ease </span>
        </h3>
      </article>


      <PropertyFilters
        locations={[...new Set(data?.map((p) => p.location))]}
        onFilterChange={handleFilterChange}
        propertyTypes={[...new Set(data?.map((p) => p.property_type))]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProperties(data ?? []).map((property) => (
          <PropertyListCard
            key={property.id}
            title={property.title}
            location={property.location}
            minTokenPrice={property.tokens[0].token_price}
            estAnnualReturn={property.projected_annual_return}
            propertyImgs={property.image}
            id={property.id}
            tokensSold={property.tokens[0].tokensSold}
            totalTokens={property.tokens[0].total_tokens}
            createdDay={property.created_at}
            status={property.status}
            tokens_available={property.tokens[0].tokens_available}
            investment_category={property.investment_category}
          />
        ))}
      </div>
    </section>
  );
};
