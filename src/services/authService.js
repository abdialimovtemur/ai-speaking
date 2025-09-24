import { authMutations } from '../api/mutations/auth.js';

class AuthService {
  /**
   * Step 1: Send the phone number to receive a verification code.
   */
  async login(phoneNumber) {
    return await authMutations.sendCode(phoneNumber);
  }

  /**
   * Step 2: Send the phone number and code to get JWT tokens.
   */
  async verifyCode(phoneNumber, verificationCode) {
    return await authMutations.verifyCode(phoneNumber, verificationCode);
  }

  /**
   * Step 3 (Client-side): "Logs out" the user by deleting their tokens.
   */
  async logout() {
    return await authMutations.logout();
  }

  /**
   * Optional: Refresh the access token using the refresh token.
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return { success: false, error: 'No refresh token found.' };
    }

    try {
      const result = await authMutations.refreshToken(refreshToken);
      return result;
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AuthService();