// src/components/SignUpButton.tsx

import React from 'react';
import { Button } from '../ui/button'; // Asegúrate de tener el componente Button en tu proyecto
import { useAuth0 } from '@auth0/auth0-react';

// Define los tipos para las props del componente
interface SignUpButtonProps {
  role: 'Investor' | 'Property Owner'; // Define los roles posibles
}

export const SignUpButton: React.FC<SignUpButtonProps> = ({ role }) => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    try {
      const params = {
        state: JSON.stringify({ role }), // Pasar el rol en el parámetro state
        audience: 'YOUR_API_IDENTIFIER', // Opcional: Identificador de la audiencia
        screen_hint: 'signup' // Indica que el usuario debe ser redirigido a la página de registro
      };
    
  
      await loginWithRedirect(params);
    } catch (error) {
      console.error('Error during signup', error);
    }
  };

  return <Button onClick={handleSignUp}>Sign Up as {role}</Button>;
};
