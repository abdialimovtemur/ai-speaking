// src/config.js

// This is the definitive, correct version.
// 1. It uses the environment variable for production builds.
// 2. It falls back to the standard local Django server address for local development.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';


// These endpoints are correct. They do NOT contain /api/.
export const API_ENDPOINTS = {
  LOGIN: '/auth/send-code/',
  VERIFY_CODE: '/auth/verify-code/',
  REFRESH_TOKEN: '/auth/refresh/',
  LOGOUT: '/auth/logout/',
};

// You should NOT use this helper function.
// Always use the 'api' client from your api.js file.
/*
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
*/