import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo && userInfo !== 'undefined') {
      try {
        setUser(JSON.parse(userInfo));
      } catch (err) {
        console.error('Failed to parse user info', err);
        localStorage.removeItem('userInfo');
      }
    } else if (userInfo === 'undefined') {
      localStorage.removeItem('userInfo');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { username, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Registration failed', error);
      throw error; // Rethrow to handle it in UI
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
