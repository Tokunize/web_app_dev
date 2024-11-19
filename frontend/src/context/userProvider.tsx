import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0, IdToken } from "@auth0/auth0-react";

interface UserContextType {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
  userImage: string | null;
  setUserImage: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean; // Estado de carga
  userEmail: string | null;
  setUserEmail : React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(() => {
    // Recupera el rol desde localStorage al montar el componente
    return localStorage.getItem('userRole') || null; 
  }); 
  const [name, setName] = useState<string | null>(null); 
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const claims: IdToken | undefined = await getIdTokenClaims();          
          if (claims) {
            const userEmail = claims.email as string | undefined;
            const userRole = claims["https://tokunize.com/role"] as string | undefined;
            const userName = claims["https://tokunize.com/name"] as string | undefined;
            const userImage = claims.picture as string | undefined;

            if (userRole) {
              setRole(userRole);
              localStorage.setItem('userRole', userRole); // Guardar el rol en localStorage
            }
            if (userName) setName(userName);
            if (userImage) setUserImage(userImage);
            if (userEmail) setUserEmail(userEmail)
          } else {
            console.error("No claims found");
          }
        } catch (error) {
          console.error("Error fetching ID token claims", error);
        } finally {
          setLoading(false); // Cambia el estado de carga a false aquí
        }
      } else {
        setLoading(false); // También establece a false si no está autenticado
      }
    };

    fetchToken();
  }, [isAuthenticated, getIdTokenClaims]);

  return (
    <UserContext.Provider value={{ role, setRole, name, setName, userImage, setUserImage, loading, userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('Use User must be used within a UserProvider');
  }
  return context;
};
