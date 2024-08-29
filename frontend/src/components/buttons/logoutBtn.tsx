import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      className='bg-black hover:bg-red-600 duration-300 w-full'
      onClick={() => logout()}
    >
      Log Out
    </Button>
  );
};

