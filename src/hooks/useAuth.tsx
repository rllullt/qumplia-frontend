import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const checkTokenValidity = async () => {
    console.log("Checking token validity...");
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log("No token found.");
      setIsAuthenticated(false);
      setIsCheckingToken(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    try {
      console.log("Token found, verifying...");
      const response = await fetch(`${apiUrl}/token/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        // Valid token
        console.log("Token is valid.");
        setIsAuthenticated(true);
      }
      else {
        // Invalid token (most probably response 401)
        console.log("Token is invalid. Logging out");
        logout();
      }
    }
    catch (error) {
      console.error("Error verifying token:", error);
      logout();
    }
    finally {
      setIsCheckingToken(false);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = () => {
      checkTokenValidity();
    };

    checkTokenValidity();

    // Listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Clean function to remove the listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);  // effect executed only once, when the component is mounted

  const login = (access_token: string, refresh_token: string) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('storage'));
  };

  return { isAuthenticated, login, logout, isCheckingToken };
};

export default useAuth;