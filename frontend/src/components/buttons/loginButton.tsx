import { useEffect } from 'react';
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

  useEffect(() => {
    const syncUserWithRedux = async () => {
      if (isAuthenticated && user) {
        try {
          const claims = await getIdTokenClaims();
          const userEmail = user.email || '';
          const userName = claims?.['https://tokunize.com/name'] || user.name || '';
          const userRole = claims?.['https://tokunize.com/role'] || 'user'; // Default role
          const userImage = user.picture || '';

          // Despachar los datos del usuario al store
          dispatch(
            setUserData({
              role: userRole,
              name: userName,
              userEmail,
              userImage,
            })
          );
        } catch (error) {
          console.error('Error fetching user claims:', error);
        }
      }
    };

    syncUserWithRedux();
  }, [isAuthenticated, user, getIdTokenClaims, dispatch]);

  return (
    <Button onClick={handleLogin}>
      Log In
    </Button>
  );
};
