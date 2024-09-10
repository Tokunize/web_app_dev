import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    console.log('Login button clicked');
    loginWithRedirect();
  };

  return (
    <Button onClick={handleLogin}>
      Log In
    </Button>
  );
};
