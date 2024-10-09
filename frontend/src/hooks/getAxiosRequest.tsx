import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Define el estado del hook con un tipo genérico
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook genérico para solicitudes GET con soporte para callbacks
export const useGetAxiosRequest = <T,>(
  url: string,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): FetchState<T> => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para hacer la solicitud GET
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessTokenSilently();
      const config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      };

      const response = await axios.get<T>(url, config);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Error en la respuesta del servidor.'
        : 'Error inesperado al hacer la solicitud.';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para llamar a fetchData cuando cambie la URL
  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, getAccessTokenSilently]); // Make sure to use stable dependencies

  return { data, loading, error };
};
