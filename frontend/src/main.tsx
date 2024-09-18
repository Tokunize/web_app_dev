import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { UserProvider } from './context/userProvider';

import './index.css';
import 'leaflet/dist/leaflet.css';
import Layout from './layout';
import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from './components/ui/toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <Toaster />
    <Auth0Provider
      domain="dev-2l2jjwfm5ekzae3u.us.auth0.com"
      clientId="RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://my-endpoints/users",
        scope: "openid profile email read:users write:users" 
      }}
    >
      <UserProvider> 
        <Layout />
      </UserProvider>
    </Auth0Provider>
    </ToastProvider>
  </React.StrictMode>,
);
