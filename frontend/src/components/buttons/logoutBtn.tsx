import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { clearUserData } from '../../redux/userSlice'; // Acción de Redux para eliminar los datos del usuario
import { setWalletAddress } from '@/redux/walletSlice'; // Acción para limpiar la dirección de la wallet
import { persistor } from '@/redux/store'; // Importa el persistor

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const dispatch = useDispatch();

  // Función para limpiar el estado de Redux y localStorage
  const handleLogout = async () => {
    try {
      console.log('Purging persisted state...');
      await persistor.purge(); // Purga el estado persistido
      console.log('Purged successfully!');
  
      dispatch(clearUserData()); // Limpiar datos de usuario en Redux
      dispatch(setWalletAddress(null)); // Limpiar datos de wallet
  
      // Eliminar manualmente datos de localStorage
      localStorage.removeItem('persist:root');
      localStorage.removeItem('user_role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('id');
      localStorage.clear(); // Limpiar todo el localStorage
  
      console.log('Logout completed successfully!');
  
      // Cerrar sesión de Auth0
      logout();
    } catch (error) {
      console.error('Error purging persisted state:', error);
    }
  };
  

  return (
    <Button
      variant="outline"
      className="duration-300 w-full"
      onClick={handleLogout} // Llama a handleLogout en el clic
    >
      Log Out
    </Button>
  );
};
