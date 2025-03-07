# 🧙‍♂️ The Tome of Keycloak: A Guide to Authentication and Connection

## Introduction

Hark, brave developer! You stand at the threshold of a grand quest—a journey to master the arcane arts of **Keycloak**, the guardian of realms and secrets. Your mission, should you choose to accept it, is to forge a bond between the **React Frontend** and the **Node.js Backend**, using the mystical powers of Keycloak to protect your paths and ensure only the worthy may pass.

Fear not, for I, Gandalf the Grey, shall be your guide. Together, we shall navigate the labyrinth of code, configure the sacred artifacts, and bring forth a Proof of Concept (POC) that shall stand as a testament to your skill and determination.

Let us begin.

---

## Steps

### 🛡️ **Step 1: Prepare the Keycloak Realm**
Before you can wield the power of Keycloak, you must first prepare its realm. This is the foundation upon which all else is built.

1. **Summon Keycloak**: Run the Keycloak server by invoking the following incantation:

        ./kc.sh start-dev

   This shall awaken Keycloak at `http://localhost:8080`.

2. **Forge a Realm**: In the Keycloak Admin Console, create a new realm named `my-realm`. This shall be your domain of power.

3. **Craft a Client**: Within your realm, create a client named `my-client`. Ensure it is of the **public** type, for simplicity in this quest.

4. **Set the Sacred Paths**:
   - **Valid Redirect URIs**: `http://localhost:5173/*`
   - **Web Origins**: `http://localhost:5173`

   These paths shall guide the flow of magic between your frontend and Keycloak.

5. **Create a User**: Add a user to your realm, and bestow upon them the gift of a password. This shall be your test subject.

---

### 🧙‍♂️ **Step 2: Enchant the React Frontend**
The frontend is the gateway through which users shall interact with your creation. It must be imbued with the power of Keycloak.

#### 📄 **File: `src/keycloak.ts`**
This is the scroll that binds your frontend to Keycloak. Write the following incantation:
```
    import Keycloak from 'keycloak-js';

    const keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'my-realm',
      clientId: 'my-client',
    });

    export default keycloak;
```
#### 📄 **File: `src/App.tsx`**
This is the heart of your frontend. It shall handle the authentication ritual and display the fruits of your labor.
```
    import React, { useEffect, useState, useRef } from 'react';
    import keycloak from './keycloak';

    const App: React.FC = () => {
      const [authenticated, setAuthenticated] = useState(false);
      const [protectedData, setProtectedData] = useState<string | null>(null);
      const isInitialized = useRef(false);

      useEffect(() => {
        if (!isInitialized.current) {
          isInitialized.current = true;
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
              Authorization: `Bearer ${keycloak.token}`,
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
```
---

### 🏰 **Step 3: Fortify the Node.js Backend**
The backend is the stronghold that guards your data. It must be fortified with Keycloak’s protection.

#### 📄 **File: `server.js`**
This is the tome that binds your backend to Keycloak. Write the following incantation:
```
    const express = require('express');
    const session = require('express-session');
    const Keycloak = require('keycloak-connect');
    const cors = require('cors');

    const app = express();

    // Middleware
    app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    app.use(express.json());

    // Session setup
    const memoryStore = new session.MemoryStore();
    app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
      })
    );

    // Keycloak setup
    const keycloak = new Keycloak(
      { store: memoryStore },
      {
        realm: 'my-realm',
        'auth-server-url': 'http://localhost:8080/',
        'ssl-required': 'external',
        resource: 'my-client',
        'public-client': true,
        'confidential-port': 0,
      }
    );

    app.use(keycloak.middleware());

    // Protected route
    app.get('/protected', keycloak.protect(), (req, res) => {
      res.json({ message: 'This is a protected route!' });
    });

    // Public route
    app.get('/public', (req, res) => {
      res.json({ message: 'This is a public route!' });
    });

    // Start the server
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
```
---

## Final Word

Brave developer, you have now completed the sacred rituals of Keycloak. Your frontend and backend are bound together, protected by the ancient magic of authentication. Remember, this is but the beginning of your journey. The road ahead is long, and many challenges await. But with the knowledge you have gained, you are well-prepared to face them.

Go forth, and may your code be ever bug-free and your deployments swift!

---

## Visual Map

    📁 keycloak-react-frontend
    └── 📁 src
        ├── 📄 App.tsx          # The heart of the frontend
        └── 📄 keycloak.ts      # The scroll that binds to Keycloak

    📁 keycloak-node-backend
    └── 📄 server.js            # The stronghold of the backend

---

Farewell, and may the light of the Two Trees guide your path! 🌟
