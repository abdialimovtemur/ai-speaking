import api from '../api.js';

// Auth Mutations - Only essential ones
export const authMutations = {
  // Send verification code mutation
  sendCode: async (phoneNumber) => {
    try {
      const formData = new URLSearchParams();
      formData.append('phone_number', phoneNumber);
      
      const response = await api.post('/auth/api/send-code/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
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

  // Verify code mutation
  verifyCode: async (phoneNumber, code) => {
    try {
      const formData = new URLSearchParams();
      formData.append('phone_number', phoneNumber);
      formData.append('code', code);
      
      const response = await api.post('/auth/api/verify-code/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Store tokens in localStorage
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

  // Logout mutation
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_phone');
      localStorage.removeItem('pending_phone');
    }
  },
};
