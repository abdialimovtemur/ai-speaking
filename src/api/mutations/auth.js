import api from '../api.js';
import { API_ENDPOINTS } from '../../config/api.js';

export const authMutations = {
  sendCode: async (phoneNumber) => {
    try {
      // CHANGE 1: Create a simple JavaScript object
      const payload = {
        phone_number: phoneNumber,
      };
      
      // CHANGE 2: Send the object directly. Axios will handle the JSON conversion.
      // We no longer need to set the Content-Type header manually.
      const response = await api.post(API_ENDPOINTS.LOGIN, payload);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || error.message,
      };
    }
  },

  verifyCode: async (phoneNumber, code) => {
    try {
      // CHANGE 3: Create a simple JavaScript object here too
      const payload = {
        phone_number: phoneNumber,
        code: code,
      };
      
      // CHANGE 4: Send the object directly
      const response = await api.post(API_ENDPOINTS.VERIFY_CODE, payload);
      
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user_phone', phoneNumber);
      }
      
      return {
        success: true,
        data: response.data,
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.detail || error.message,
      };
    }
  },

  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('pending_phone');
    }
  },
};