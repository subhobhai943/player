import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

/**
 * On mount, verifies the stored JWT is still valid.
 * Refreshes user data from /api/auth/me.
 * Logs out if token is expired or invalid.
 */
const useAuth = () => {
  const { token, setAuth, logout, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setAuth(data, token);
      } catch {
        logout();
        navigate('/login');
      }
    };

    verify();
  }, []);

  return { isAuthenticated, user };
};

export default useAuth;
