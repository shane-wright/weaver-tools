const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');
const axios = require('axios');

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

// Custom middleware to check authentication
const checkAuth = (req, res, next) => {
  if (req.session.tokens && req.session.tokens.access_token) {
    next(); // User is authenticated
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // User is not authenticated
  }
};

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const tokenResponse = await axios.post(
      'http://localhost:8080/realms/my-realm/protocol/openid-connect/token',
      new URLSearchParams({
        client_id: 'my-client',
        grant_type: 'password',
        username,
        password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // Store tokens in session (or in a secure HTTP-only cookie)
    req.session.tokens = { access_token, refresh_token };

    res.json({ access_token });
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    res.status(401).json({ error: 'Login failed' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

// Protected route
app.get('/protected', checkAuth, (req, res) => {
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