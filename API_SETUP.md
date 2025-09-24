# API Setup Instructions

## Environment Configuration

To connect to your backend API, you need to set up the environment variable:

### Option 1: Create .env file (Recommended)
Create a `.env` file in the root directory with:
```
VITE_API_BASE_URL=https://a543e4a2be9a.ngrok-free.app
```

### Option 2: Update config directly
The API URL is already configured in `src/config/api.js` with your ngrok URL as the default.

## API Endpoints

The application now uses these real backend endpoints:

- **Send Code**: `POST /auth/api/send-code/`
  - Sends verification code to phone number
  - Body: `{ "phone_number": "+998912345678" }`

- **Verify Code**: `POST /auth/api/verify-code/`
  - Verifies the SMS code
  - Body: `{ "phone_number": "+998912345678", "verification_code": "123456" }`

## Features

✅ **Real API Integration**: Connected to your Django backend
✅ **Phone Number Authentication**: SMS-based login system
✅ **Token Management**: JWT tokens stored in localStorage
✅ **Protected Routes**: Test page requires authentication
✅ **Error Handling**: Proper error messages from API
✅ **Responsive Design**: Beautiful UI with Tailwind CSS
✅ **Auto-redirect**: Returns to intended page after login

## How to Test

1. Start the development server: `npm run dev`
2. Click "Sign In to Practice" or "Start Free Practice"
3. Enter a valid phone number (e.g., +998912345678)
4. Enter any 6-digit code for verification
5. You'll be redirected to the test page

## Notes

- The app includes `ngrok-skip-browser-warning` header to bypass ngrok warnings
- Tokens are automatically stored and managed
- Users can logout from the header menu
- All authentication state is preserved across browser sessions
