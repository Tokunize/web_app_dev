import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

// Define el estado del hook con un tipo genérico
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook para solicitudes DELETE
export const useDeleteAxiosRequest = <T,>(
  url: string,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): [FetchState<T>, () => Promise<void>] => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteData = useCallback(async () => {
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

      const response = await axios.delete<T>(url, config);
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Error en la respuesta del servidor.'
        : 'Error inesperado al hacer la solicitud.';

      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
      console.error('Error deleting data:', err);
    } finally {
      setLoading(false);
    }
  }, [url, getAccessTokenSilently, onSuccess, onError]);

  return [{ data, loading, error }, deleteData];
};
