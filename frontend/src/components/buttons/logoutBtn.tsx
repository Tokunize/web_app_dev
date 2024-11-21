import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice'; // Importa la acción de Redux para eliminar los datos del usuario
import { setWalletAddress } from '@/redux/walletSlice'; // Importa la acción

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const dispatch = useDispatch(); // Usamos el dispatch para borrar los datos del usuario en Redux

  // Función para limpiar el estado de Redux y el localStorage
  const handleLogout = () => {
    // Eliminar los datos del usuario en Redux
    dispatch(setUserData({ role: '', name: '', userEmail: '', userImage: '' }));
    dispatch(setWalletAddress(null)); // Desconectar la wallet y limpiar el estado

    // Eliminar el usuario en el localStorage
    localStorage.removeItem("user_role");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("id");

    // Llamar a la función de logout de Auth0
    logout();
  };

  return (
    <Button
      variant="outline"
      className='duration-300 w-full'
      onClick={handleLogout} // Llamamos a handleLogout en el clic
    >
      Log Out
    </Button>
  );
};
