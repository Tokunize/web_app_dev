import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import 'leaflet/dist/leaflet.css';
import Layout from './layout';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2l2jjwfm5ekzae3u.us.auth0.com"
      clientId="yhgbzvH10eKNhxMaN4jf7kLEoDXkYkDO"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Layout />
    </Auth0Provider>
  </React.StrictMode>,
)
