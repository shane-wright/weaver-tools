import React, { useState } from "react";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [protectedData, setProtectedData] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session management
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful. Access Token:", data.access_token);
        setAuthenticated(true);
        fetchProtectedData();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const fetchProtectedData = async () => {
    try {
      const response = await fetch("http://localhost:3001/protected", {
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        const data = await response.json();
        setProtectedData(data.message);
      } else if (response.status === 401) {
        setAuthenticated(false); // Redirect to login page
      } else {
        console.error("Failed to fetch protected data");
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/logout", {
        method: "POST",
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        setAuthenticated(false);
        setProtectedData(null);
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!authenticated) {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
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
