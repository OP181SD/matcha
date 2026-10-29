import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProtectedRoute = ({ children }) => {
  const [state, setState] = useState({ status: 'loading' });
  const location = useLocation();

  useEffect(() => {
    const fetchMe = () => axios.get("/api/me", { withCredentials: true }).then(r => r.data);

    const checkAuth = async () => {
      try {
        let data = await fetchMe();

        if (!data.authenticated) {
          try {
            await axios.post('/api/refresh-token', {}, { withCredentials: true });
            data = await fetchMe();
          } catch {}
        }
        if (data.authenticated) {
          setState({ status: 'ok', profileComplete: data.profile_complete !== false });
        } else {
          setState({ status: 'unauth' });
        }
      } catch (err) {
        setState({ status: 'unauth' });
      }
    };

    checkAuth();
  }, []);

  if (state.status === 'loading') return <div>Chargement...</div>;

  if (state.status === 'unauth') return <Navigate to="/login" replace />;

  if (!state.profileComplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};
