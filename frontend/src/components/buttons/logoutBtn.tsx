import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const removeLocalStorage = () =>{
    localStorage.removeItem("userRole")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("id")
  }

  return (
    <Button
      variant="outline"
      className=' duration-300 w-full'
      onClick={()=>{
        removeLocalStorage()
        logout()
      }}>
      Log Out
    </Button>
  );
};

