import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../utils/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check for stored token on app start
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const userStr = await SecureStore.getItemAsync('userInfo');

        if (token) {
          setUserToken(token);
          if (userStr) {
            setUserInfo(JSON.parse(userStr));
          }
        }
      } catch (e) {
        console.log('Failed to load auth token', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      if (response.data.token) {
        setUserToken(response.data.token);
        setUserInfo(response.data.user);

        await SecureStore.setItemAsync('userToken', response.data.token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data.user));

        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Check your credentials and try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        email,
        password,
        name
      });

      if (response.data.token) {
        setUserToken(response.data.token);
        setUserInfo(response.data.user);

        await SecureStore.setItemAsync('userToken', response.data.token);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(response.data.user));

        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Registration failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userInfo');
      setUserToken(null);
      setUserInfo(null);
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile/update`,
        profileData,
        {
          headers: { Authorization: `Bearer ${userToken}` }
        }
      );

      if (response.data.success) {
        const updatedUser = { ...userInfo, ...profileData };
        setUserInfo(updatedUser);
        await SecureStore.setItemAsync('userInfo', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  const isAuthenticated = () => {
    return !!userToken;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);