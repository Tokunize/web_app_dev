// src/components/buttons/LoginButton.tsx
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { useAuth0 } from '@auth0/auth0-react';
import { setUserData } from '../../redux/userSlice'; 

export const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  // Guardar el usuario en Redux después de la autenticación
  const syncUserWithRedux = async () => {
    if (isAuthenticated && user) {
      const claims = await getIdTokenClaims();
      const userEmail = user.email || '';
      const userName = claims ? claims['https://tokunize.com/name'] : '';
      const user_role = claims ? claims['https://tokunize.com/role'] : '';
      const userImage = user.picture || '';

      // Despachar los datos del usuario al store
      dispatch(setUserData({ role: user_role, name: userName, userEmail: userEmail, userImage }));
    }
  };

  // Llamar a la función para sincronizar el usuario con Redux después de iniciar sesión
  if (isAuthenticated && user) {    
    syncUserWithRedux();
  }

  return (
    <Button  onClick={handleLogin}>
      Log In
    </Button>
  );
};
