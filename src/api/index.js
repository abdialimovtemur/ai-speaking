// Export all API functions
export { default as api } from './api.js';

// Export queries
export { authQueries } from './queries/auth.js';
export { testQueries } from './queries/test.js';

// Export mutations
export { authMutations } from './mutations/auth.js';
export { testMutations } from './mutations/test.js';

// Convenience exports - Only essential ones
export const { sendCode, verifyCode, logout } = authMutations;
