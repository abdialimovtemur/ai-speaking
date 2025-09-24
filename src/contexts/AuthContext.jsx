import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      // In a real app, you would validate the token with your backend
      setUser({ 
        accessToken, 
        refreshToken,
        phoneNumber: localStorage.getItem('user_phone') || ''
      });
    }
    
    setLoading(false);
  }, []);

  const login = async (phoneNumber) => {
    try {
      console.log('Sending verification code to:', phoneNumber);
      
      const result = await authService.login(phoneNumber);
      
      if (result.success) {
        // Store phone number for verification step
        setPhoneNumber(phoneNumber);
        localStorage.setItem('pending_phone', phoneNumber);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyCode = async (code) => {
    try {
      console.log('Verifying code:', code, 'for phone:', phoneNumber);
      
      const result = await authService.verifyCode(phoneNumber, code);
      
      if (result.success) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', result.accessToken);
        localStorage.setItem('refresh_token', result.refreshToken);
        localStorage.setItem('user_phone', phoneNumber);
        localStorage.removeItem('pending_phone');
        
        // Update user state
        setUser({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          phoneNumber
        });
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('pending_phone');
      
      // Clear user state
      setUser(null);
      setPhoneNumber('');
    }
  };

  const value = {
    user,
    loading,
    phoneNumber,
    login,
    verifyCode,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
