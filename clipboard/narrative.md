# Narrative for Demo: Keycloak Integration and Authentication Flow

---

## 1. Overview of Keycloak Integration

Keycloak is an open-source identity and access management solution that provides robust authentication and authorization features. For this project, we’ve integrated Keycloak to handle user authentication, session management, and secure access to both the frontend (React + TypeScript) and backend (Node.js). Keycloak provides several powerful features, including:

- **Single Sign-On (SSO)**: Users log in once and gain access to multiple services.
- **User Federation**: Integration with existing user directories (e.g., LDAP, Active Directory).
- **Role-Based Access Control (RBAC)**: Fine-grained control over user permissions.
- **Session Management**: Secure handling of user sessions, including token expiration and refresh.
- **Customizable Login Flows**: Tailored user journeys for login, registration, and account recovery.

We’ve leveraged these features to create a seamless and secure authentication experience for our application.

---

## 2. Login Flow

Let’s walk through the **user login flow**, which is the cornerstone of our authentication system:

1. **User Access**:
   - When a user navigates to the application, they are redirected to the Keycloak login page.
   - This is configured using the `keycloak-js` library in the frontend, with the `onLoad: 'login-required'` option, ensuring that users must authenticate before accessing the app.

2. **Authentication**:
   - The user enters their credentials (username and password) into the Keycloak login form.
   - Keycloak validates the credentials and, if successful, issues an **access token** and a **refresh token**.

3. **Session Initialization**:
   - The frontend receives the tokens and initializes the user session.
   - The access token is stored securely (e.g., in memory or a secure HTTP-only cookie) and is used to authenticate API requests to the backend.

4. **Token Management**:
   - We’ve implemented logic to automatically refresh the access token before it expires, ensuring uninterrupted user sessions.
   - If the token refresh fails (e.g., due to an expired refresh token or network issues), the user is prompted to log in again.

5. **User Feedback**:
   - We’ve enhanced the UI to provide clear feedback during the login process, including handling edge cases such as:
     - **Account Locked**: The user is informed if their account is locked due to multiple failed login attempts.
     - **Account Disabled**: The user is notified if their account has been disabled by an administrator.

6. **Logout**:
   - When the user logs out, their session is terminated on both the frontend and backend.
   - Tokens are invalidated, and all session data is properly sanitized to ensure security.

---

## 3. Core Code and Functionality

Now, let’s dive into some of the **core code and functionality** that powers this system, highlighting the improvements we’ve made:

### Frontend (React + TypeScript)

#### Keycloak Initialization
/``typescript
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'my-realm',
  clientId: 'my-client',
});

export default keycloak;
/``
- Keycloak is initialized with the correct configuration, and the `keycloak-js` library handles the authentication flow.

#### Login and Token Management
/``typescript
useEffect(() => {
  keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
    if (authenticated) {
      console.log('User is authenticated');
      fetchProtectedData();
    }
  }).catch((error) => {
    console.error('Keycloak initialization failed:', error);
  });
}, []);
/``
- The `init` method ensures the user is authenticated before accessing the app.
- We’ve added logic to handle token refresh and account status checks.

#### Logout
/``typescript
const handleLogout = () => {
  keycloak.logout({ redirectUri: 'http://localhost:5173' });
};
/``
- Logout terminates the session and redirects the user to the login page.

### Backend (Node.js)

#### Keycloak Middleware
/``javascript
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
/``
- Keycloak middleware is automatically instantiated during initialization, with configurations managed via Docker.

#### Protected Route
/``javascript
app.get('/protected', keycloak.protect(), (req, res) => {
  res.json({ message: 'This is a protected route!' });
});
/``
- The `keycloak.protect()` middleware ensures that only authenticated users can access this route.

#### Session Sanitization
- We’ve implemented proper session cleanup during logout, ensuring that tokens and session data are securely removed.

### Docker Integration
- Keycloak is now running in a Docker container, making it easier to manage and deploy.
- The Docker setup includes pre-configured realms, clients, and users, ensuring consistency across environments.

---

## 4. User Journey Enhancements

We’ve made several improvements to align with the desired user journey:

- **Custom UI**:
  - The login and logout flows are now fully customized to match the Figma designs, providing a seamless user experience.

- **Account Status Tracking**:
  - We’ve added logic to track and handle account statuses (e.g., locked or disabled), ensuring users are informed appropriately.

- **Session Management**:
  - Sessions are now managed securely, with proper sanitization of tokens and session data on both the frontend and backend.

---

## 5. Conclusion

In summary, we’ve successfully integrated Keycloak to provide a secure and user-friendly authentication system. The improvements we’ve made—such as enhanced session management, a custom UI, and better handling of account statuses—ensure that the application meets both security and usability requirements.
