import React, { useEffect, useState, useRef } from 'react';
import keycloak from './keycloak';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const isInitialized = useRef(false); // Track initialization

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true; // Mark as initialized
      keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
        setAuthenticated(authenticated);
        if (authenticated) {
          console.log('User is authenticated');
          console.log('Access Token:', keycloak.token);
          fetchProtectedData();
        }
      }).catch((error) => {
        console.error('Keycloak initialization failed:', error);
      });
    }
  }, []);

  const fetchProtectedData = async () => {
    try {
      const response = await fetch('http://localhost:3001/protected', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`, // Send the Keycloak token
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProtectedData(data.message);
      } else {
        console.error('Failed to fetch protected data');
      }
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };

  const handleLogout = () => {
    keycloak.logout({ redirectUri: 'http://localhost:5173' });
  };

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the React App!</h1>
      <p>You are authenticated.</p>
      {protectedData && <p>Protected Data: {protectedData}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
