import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface PropertyDetails {
  id: number;
  name: string;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetchPropertyDetails = (property_id: number, viewType: string): FetchState<PropertyDetails> => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);  // Reset error state before fetching

      try {
        const accessToken = await getAccessTokenSilently();

        const apiUrl = `http://127.0.0.1:8000/property/${property_id}/?view=${viewType}`;

        const config: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        };

        const response = await axios.get<PropertyDetails>(apiUrl, config);  
        console.log(response.data);
              
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch property details.');
        console.error('Error fetching property details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property_id, viewType, getAccessTokenSilently]);

  return { data, loading, error };
};

export default useFetchPropertyDetails;
