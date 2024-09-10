import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthProfile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <p>{user.email}</p>
    </div>
  );
};

export default AuthProfile;
