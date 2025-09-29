// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://9d65191b4d76.ngrok-free.app';

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/api/send-code/',
  VERIFY_CODE: '/auth/api/verify-code/',
  REFRESH_TOKEN: '/auth/refresh/',
  LOGOUT: '/auth/logout/',
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
