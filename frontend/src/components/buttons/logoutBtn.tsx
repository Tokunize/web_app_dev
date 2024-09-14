import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const removeLocalStorage = () =>{
    localStorage.removeItem("user_role")
    localStorage.removeItem("accessToken")
  }

  return (
    <Button
      className=' duration-300 w-full'
      onClick={()=>{
        removeLocalStorage()
        logout()
      }}>
      Log Out
    </Button>
  );
};

