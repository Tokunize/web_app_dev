import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useGetAxiosRequest = <T,>(
  url: string,
  requiresAuth: boolean = false,  // nuevo parámetro para indicar si requiere autenticación
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void,
): FetchState<T> => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let config: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (requiresAuth) {
        // Obtener el token solo si se necesita autenticación
        const accessToken = await getAccessTokenSilently();
        config.headers = {  // Aseguramos que headers está inicializado
          ...config.headers,  // Incluye headers existentes, si los hay
          Authorization: `Bearer ${accessToken}`,
        };
      }

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

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, getAccessTokenSilently]);

  return { data, loading, error };
};
