const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests from the Vite frontend
    credentials: true, // Allow cookies/tokens to be sent
  })
);
app.use(express.json());

// Session setup (required for Keycloak)
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: 'my-secret', // Change this to a secure secret in production
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Keycloak setup
const keycloak = new Keycloak(
  { store: memoryStore },
  {
    realm: 'my-realm', // Replace with your Keycloak realm
    'auth-server-url': 'http://localhost:8080/', // Keycloak server URL
    'ssl-required': 'external',
    resource: 'my-client', // Replace with your Keycloak client ID
    'public-client': true, // Set to true if using public client
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
