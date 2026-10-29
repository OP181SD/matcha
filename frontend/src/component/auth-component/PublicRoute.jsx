import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const PublicRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const { data } = await axios.get('/api/me', { withCredentials: true });
        setAuthenticated(!!data.authenticated);
      } catch (error) {
        setAuthenticated(false);
      }
    };

    checkIfLoggedIn();
  }, []);

  if (authenticated === null) return <div>Chargement...</div>;
  if (authenticated) return <Navigate to="/meet-page" replace />;
  return children;
};
