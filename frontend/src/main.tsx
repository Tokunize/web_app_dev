import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './styles/index.css';
import 'leaflet/dist/leaflet.css';
import Layout from './layouts/layout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Buffer } from 'buffer';
import process from 'process';
import { Provider } from 'react-redux';
import { store } from "./redux/store"
import { PersistGate } from 'redux-persist/integration/react';
import { ModalProvider } from './context/modalContext';
import { persistor } from './redux/store'; // Importa el persistor
// Assign Buffer and process to the global object
window.Buffer = Buffer;
window.process = process;


// Cargar la clave pública de Stripe (clave de prueba)
const stripePromise = loadStripe("pk_test_51Q2roYRqFZlL52ejvDj7VFzt4zFQWGszC1u8EBfu2P7hfzPbcmHaHRB6YFNItDxOjfb1ZzAlSUnWnEvG9vWJJ4sX00wcaLrbhW");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-2l2jjwfm5ekzae3u.us.auth0.com"
      clientId="RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://my-endpoints/users",
        scope: "openid profile email read:users write:users" 
      }}
    >
      <Provider store={store}>
        <ModalProvider>
          <PersistGate loading={null} persistor={persistor}>
            <Elements stripe={stripePromise}>
              <Layout />
            </Elements>
            </PersistGate>
        </ModalProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>,
);
