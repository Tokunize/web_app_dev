import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { PropertyFilters } from './propertyFilters';
import { PropertyListCard } from './propertyListCard';
import ClipLoader from 'react-spinners/ClipLoader';

const sortProperties = (properties: any[], sortBy: string) => {
  return properties.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return (a.tokens[0].token_price) - (b.tokens[0].token_price);
      case 'price_desc':
        return parseFloat(b.tokens[0].token_price) - parseFloat(a.tokens[0].token_price);
      case 'annual_return_asc':
        return parseFloat(a.projected_annual_return) - parseFloat(b.projected_annual_return);
      case 'annual_return_desc':
        return parseFloat(b.projected_annual_return) - parseFloat(a.projected_annual_return);
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

    const fetchProperties = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/public/`;
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

  // Memoize filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const meetsLocation = !filters.location || property.location === filters.location;
      const meetsPropertyType = !filters.property_type || property.property_type === filters.property_type;
      return meetsLocation && meetsPropertyType;
    });
  }, [properties, filters.location, filters.property_type]);

  // Memoize sorted properties
  const sortedProperties = useMemo(() => {
    return sortProperties(filteredProperties, filters.sort_by);
  }, [filteredProperties, filters.sort_by]);

  return (
    <div className="py-10">
      <PropertyFilters
        locations={[...new Set(properties.map(p => p.location))]}
        onFilterChange={handleFilterChange}
        propertyTypes={[...new Set(properties.map(p => p.property_type))]}
      />
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <ClipLoader size={40} color="#A0CC29" />
        </div>
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
              propertyImgs={property.image}
              id={property.id}
              tokensSold={property.tokens[0].tokensSold}
              totalTokens={property.tokens[0].total_tokens}
              createdDay={property.created_at}
              status={property.status}
              tokens_available={property.tokens[0].tokens_available}
            />
          ))}
        </div>
      )}
    </div>
  );
};
