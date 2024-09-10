import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwnerPropertyForm from '@/components/property/ownerForm';
import ClipLoader from 'react-spinners/ClipLoader';
// Importa el componente Button de ShadCN
import { Button } from '@/components/ui/button';
import { OwnerPropertyList } from '@/components/property/ownerPropertyList';
import { useUser } from '@/context/userProvider';

interface Property {
  id: number;
  title: string;
  // Añade otros campos necesarios según el modelo de propiedad
}

export const OwnerDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { role } = useUser(); // Usamos el hook para obtener el rol del usuario
  const [showForm, setShowForm] = useState<boolean>(false);

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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          {/* Muestra el botón "Create Property" solo si el rol no es 'admin' */}
          {role !== 'admin' && (
            <Button onClick={toggleForm} className="mr-4">
              Create Property
            </Button>
          )}
          <Button onClick={() => window.location.reload()}>Show Properties</Button>
        </div>
      </div>
      <div className="mb-6">
        {loading && (
          <div className="flex items-center justify-center h-40">
            <ClipLoader size={50} color="#4A90E2" />
          </div>
        )}
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      </div>
      {showForm && <OwnerPropertyForm userId={userId} />}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Properties</h2>
        <OwnerPropertyList propertyList={properties} />
      </div>
    </section>
  );
};
