import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/userProvider';
import { useNavigate } from 'react-router-dom';
import { OwnerPropertyListCard } from './ownerPropertyListCard';
import { LoadingSpinner } from './loadingSpinner';
import { useGetAxiosRequest } from '@/hooks/getAxiosRequest';
import { FilterInput } from '../filterInput';

interface Token {
  total_tokens: number;
  token_price: number;
  tokens_available: number;
}

interface Property {
  id: number;
  title: string;
  location: string;
  tokens: Token[];
  projected_annual_return: string;
  image: string[];
  status: string;
  rejection_reason: string;
}

export const Porfolio: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  const { role } = useUser();
  const navigate = useNavigate();

  // Usar el hook personalizado para obtener las propiedades
  const { error, loading } = useGetAxiosRequest<{ properties: Property[] }>(
    `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`,
    (data) =>{ 
      console.log(data);
      
      setProperties(data.properties)},
    (error) => console.error('Error fetching your portfolio:', error)
  );

  // Filtrar las propiedades basado en el término de búsqueda
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="px-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl">Your Listings</h2>
        {role !== 'admin' && (
          <Button onClick={() => navigate("/public-property/")}>Sell New Property</Button>
        )}
      </div>

      <div className="absolute  top-[64px] md:top-[0px] w-1/2 ">
        <FilterInput
          filterValue={searchTerm} 
          onFilterChange={setSearchTerm} 
        />
      </div>
    

      <div className="mb-6">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner />
          </div>
        )}
        
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <OwnerPropertyListCard
              key={property.id}
              title={property.title}
              location={property.location}
              totalTokens={property.tokens[0]?.total_tokens || 0}  // Se asegura de que el token exista
              minTokenPrice={property.tokens[0]?.token_price?.toString() || ''} // Asegura que el precio del token esté presente
              estAnnualReturn={property.projected_annual_return}
              propertyImgs={property.image || []}
              id={property.id.toString()}
              tokensSold={property.tokens[0]?.total_tokens - property.tokens[0]?.tokens_available || 0}
              status={property.status}
              rejection_reason={property.rejection_reason}
              tokens_available={property.tokens[0]?.tokens_available || 0} // Tokens disponibles
            />
          ))
        ) : (
          !loading && <p className="text-gray-500">No properties found.</p> // Mensaje solo si no hay propiedades y no está cargando
        )}
      </div>
    </section>
  );
};
