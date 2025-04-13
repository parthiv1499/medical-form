import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    if (token) {
      setAuthToken(token);
      
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
        
        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        setError('Session expired. Please login again.');
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);
      return true;
    } catch (err) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, formData);
      
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Invalid credentials');
      return false;
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 