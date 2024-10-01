import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Button variant="outline" onClick={handleLogin}>
      Log In
    </Button>
  );
};
