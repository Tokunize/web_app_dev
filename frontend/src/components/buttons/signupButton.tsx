// src/components/SignUpButton.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';

export const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      onClick={() => loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
        },
      })}
    >
      Sign Up
    </Button>
  );
};