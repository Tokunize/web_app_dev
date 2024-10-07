import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

interface LoginButtonProps {
  type?: 'default' | 'singUp' | 'outline'; // Especifica los tipos de variantes que desees
}

export const LoginButton: React.FC<LoginButtonProps> = ({ type = 'default' }) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Button variant={type} onClick={handleLogin}>
      Log In
    </Button>
  );
};
