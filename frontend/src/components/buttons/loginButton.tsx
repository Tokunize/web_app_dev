import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { setUserData } from "../../redux/userSlice";

export const LoginButton = () => {
  const { loginWithRedirect, user, isAuthenticated, getIdTokenClaims, isLoading } = useAuth0();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <Button onClick={handleLogin}>
      Log In
    </Button>
  );
};
