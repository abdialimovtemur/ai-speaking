# API Structure Documentation

## Overview
This project now uses a structured API approach with separate queries and mutations, similar to React Query or Apollo Client patterns.

## File Structure
```
src/api/
├── api.js                 # Main axios configuration
├── index.js              # Export all API functions
├── queries/
│   ├── auth.js           # Authentication queries
│   └── test.js           # Test-related queries
└── mutations/
    ├── auth.js           # Authentication mutations
    └── test.js           # Test-related mutations
```

## Environment Configuration
Create a `.env` file in the root directory:
```bash
VITE_API_BASE_URL=https://6e19e3e6111b.ngrok-free.app
VITE_WS_BASE_URL=wss://6e19e3e6111b.ngrok-free.app
```

## Usage Examples

### Authentication
```javascript
import { authMutations, authQueries } from '../api';

// Send verification code
const result = await authMutations.sendCode('+998912345678');

// Verify code
const verifyResult = await authMutations.verifyCode('+998912345678', '123456');

// Logout
await authMutations.logout();
```

### Test Operations
```javascript
import { testMutations, testQueries } from '../api';

// Get test history
const history = await testQueries.getTestHistory();

// Start new test
const test = await testMutations.startTest({ topic: 'education' });

// Submit answer
await testMutations.submitAnswer(testId, { answer: 'My response...' });
```

### WebSocket Service
```javascript
import websocketService from '../services/websocketService';

// Connect to WebSocket
await websocketService.connect();

// Send message
websocketService.sendMessage({ type: 'start_streaming' });

// Disconnect
websocketService.disconnect();
```

## Features

### ✅ **Structured API**
- Separate queries and mutations
- Consistent error handling
- Automatic token management

### ✅ **Authentication**
- JWT token handling
- Automatic token refresh
- Logout functionality

### ✅ **WebSocket Integration**
- Real-time communication
- Audio streaming
- Authentication support

### ✅ **Error Handling**
- Consistent error responses
- Automatic token refresh
- User-friendly error messages

## Migration from Old Structure

### Before (Old authService)
```javascript
import authService from '../services/authService';
const result = await authService.login(phoneNumber);
```

### After (New API)
```javascript
import { authMutations } from '../api';
const result = await authMutations.sendCode(phoneNumber);
```

## Benefits

1. **Better Organization**: Clear separation of queries and mutations
2. **Consistent API**: All endpoints follow the same pattern
3. **Better Error Handling**: Standardized error responses
4. **Type Safety**: Ready for TypeScript migration
5. **Scalability**: Easy to add new endpoints
6. **Testing**: Easier to mock and test individual functions
