import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/userProvider';
import { useNavigate } from 'react-router-dom';
import { OwnerPropertyListCard } from './ownerPropertyListCard';
import { IoMdSearch } from "react-icons/io";


interface Property {
  id: number;
  title: string;
  location: string;
  tokens: any[];
  projected_annual_return: string;
  image: string[];
  status: string;
  tokens_available: number;
  totalTokens: number;
}

export const Porfolio: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para el término de búsqueda
  const { role } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('Access token not found in local storage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}property/properties/private/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        console.log(response.data);

        setProperties(response.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filtrar las propiedades basado en el término de búsqueda
  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl">Your Listings</h2>
        {role !== 'admin' && (
          <Button onClick={() => navigate("/public-property/")}>Sell New Property</Button>
        )}
      </div>

      {/* Barra de búsqueda */}

      <div className="relative w-full  mt-5"> 
        <IoMdSearch className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title or location"
          className="pl-10 p-2 w-full border border-gray-300 rounded-lg" // Añadimos padding a la izquierda para el ícono
        />
      </div>

      <div className="mb-6">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <ClipLoader size={50} color="#4A90E2" />
          </div>
        )}
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
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
            tokens_available={property.tokens[0]?.tokens_available || 0} // Tokens disponibles
          />
        ))}
      </div>
    </section>
  );
};
