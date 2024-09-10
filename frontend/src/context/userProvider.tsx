


import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

interface UserContextType {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(localStorage.getItem("user_role"));
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          // Obtén los claims del ID token
          const claims = await getIdTokenClaims();

          // Extrae el rol, nombre y apellido del claim personalizado
          const userRole = claims["https://tokunize.com/role"];
        
          if (userRole) {
            localStorage.setItem("user_role", userRole);
            setRole(userRole);
          }
        } catch (error) {
          console.error("Error fetching ID token claims", error);
        }
      }
    };

    fetchToken();
  }, [isAuthenticated, getIdTokenClaims]);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
