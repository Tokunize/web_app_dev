// src/components/PropertyList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PropertyFilters } from './propertyFilters';
import { PropertyListCard } from './propertyListCard';


const sortProperties = (properties: any[], sortBy: string) => {
  return properties.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return parseFloat(a.token_price) - parseFloat(b.token_price);
      case 'price_desc':
        return parseFloat(b.token_price) - parseFloat(a.token_price);
      case 'annual_return_asc':
        return parseFloat(a.annual_gross_rents) - parseFloat(b.annual_gross_rents);
      case 'annual_return_desc':
        return parseFloat(b.annual_gross_rents) - parseFloat(a.annual_gross_rents);
      default:
        return 0;
    }
  });
};

export const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    location: '',
    property_type: '',
    sort_by: ''
  });

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

    const fetchProperties = async () => {
      try {
        const apiUrl = `${backendUrl}property/properties/public/`;
        const response = await axios.get(apiUrl);
        console.log(response.data);
        
        setProperties(response.data);
        
      } catch (err) {
        setError('Failed to fetch properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredProperties = properties.filter(property => {
    const meetsLocation = !filters.location || property.location === filters.location;
    const meetsPropertyType = !filters.property_type || property.property_type === filters.property_type;
    return meetsLocation && meetsPropertyType;
  });

  const sortedProperties = sortProperties(filteredProperties, filters.sort_by);

  return (
    <div className="py-10">
      <PropertyFilters
        locations={[...new Set(properties.map(p => p.location))]}  // Dynamically generate locations from data
        onFilterChange={handleFilterChange}
        propertyTypes={[...new Set(properties.map(p => p.property_type))]}  // Dynamically generate property types from data
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProperties.map((property, index) => (
            <PropertyListCard
              key={index}
              title={property.title}
              location={property.location}
              minTokenPrice={property.tokens[0].token_price}
              estAnnualReturn={property.projected_annual_return}
              propertyImgs={property.image.slice(1,5)}  
              id={property.id}  
              tokensSold={property.tokensSold}
              totalTokens={property.tokens[0].total_tokens}
              createdDay = {property.created_at}
              status = {property.status}
              tokens_available = {property.tokens[0].tokens_available}
            />
          ))}
        </div>
      )}
    </div>
  );
};
