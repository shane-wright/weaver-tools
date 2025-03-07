import Keycloak from 'keycloak-js';

// Initialize Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8080/', // Keycloak server URL
  realm: 'my-realm', // Replace with your Keycloak realm
  clientId: 'my-client', // Replace with your Keycloak client ID
});

export default keycloak;
