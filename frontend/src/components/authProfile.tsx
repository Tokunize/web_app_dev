import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

const AuthProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          // Fetch the access token
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
        } catch (error) {
          console.error('Error fetching token', error);
        }
      }
    };


    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {token && <pre>{token}</pre>} {/* Display the token */}
      </div>
    )
  );
};

export default AuthProfile;
