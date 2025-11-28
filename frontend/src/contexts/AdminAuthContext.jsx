import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Debug log
console.log('Admin Auth - API Base URL:', API_BASE);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create axios instance with auth token
  const createAuthenticatedAxios = (token) => {
    return axios.create({
      baseURL: API_BASE,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  // Load admin from localStorage on mount
  useEffect(() => {
    const loadAdmin = () => {
      try {
        const storedAdmin = localStorage.getItem('admin');
        const storedToken = localStorage.getItem('adminToken');

        if (storedAdmin && storedToken) {
          setAdmin(JSON.parse(storedAdmin));
        }
      } catch (err) {
        console.error('Failed to load admin from localStorage:', err);
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { admin: adminData, token } = response.data.data;

        // Store in state
        setAdmin(adminData);

        // Store in localStorage
        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('adminToken', token);

        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  const getAuthAxios = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return createAuthenticatedAxios(token);
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    getAuthAxios,
    isAuthenticated: !!admin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
