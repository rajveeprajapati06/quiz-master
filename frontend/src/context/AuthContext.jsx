import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create default base URL for Axios
axios.defaults.baseURL = 'https://quiz-master-7uer.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Setup Authorization header helper
  const setAuthHeader = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Initialize and load user profile on startup if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        setAuthHeader(token);
        try {
          const { data } = await axios.get('/api/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  // Login action
  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setAuthHeader(data.token);
    return data;
  };

  // Register action
  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/users/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setAuthHeader(data.token);
    return data;
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setAuthHeader(null);
  };

  // Refresh profile details (helpful after updating or creating things)
  const refreshProfile = async () => {
    if (token) {
      try {
        const { data } = await axios.get('/api/users/profile');
        setUser(data);
        return data;
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
