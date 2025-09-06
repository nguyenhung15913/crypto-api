# Crypto API - Authentication Documentation

## Overview
This API provides cryptocurrency data with user authentication powered by Supabase and JWT tokens.

## Setup

### 1. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Client URL (for password reset redirects)
CLIENT_URL=http://localhost:3000

# Server Configuration
PORT=3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## Authentication Endpoints

### 1. User Registration
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe" // optional
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Signup successful. Check your email for confirmation."
}
```

### 2. User Login
**POST** `/api/auth/login`

Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "supabase_token",
    "refresh_token": "refresh_token"
  },
  "token": "jwt_token_here",
  "message": "Login successful"
}
```

### 3. User Logout
**POST** `/api/auth/logout`

Logout user and invalidate session.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### 4. Get User Profile
**GET** `/api/auth/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 5. Request Password Reset
**POST** `/api/auth/forgot-password`

Send password reset email to user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

### 6. Update Password
**POST** `/api/auth/update-password`

Update user's password.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

### 7. Verify Email
**GET** `/api/auth/verify-email?token=<token>&type=<type>`

Verify user's email address.

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

## Crypto Data Endpoints

### 1. Get All Coins (Public)
**GET** `/api/coins`

Get list of all cryptocurrencies.

**Response:**
```json
{
  "data": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "price": 50000,
      "market_cap": 1000000000
    }
  ]
}
```

### 2. Get User's Favorite Coins (Protected)
**GET** `/api/coins/favorites`

Get user's favorite cryptocurrencies.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Favorites feature coming soon",
  "userId": "uuid",
  "favorites": []
}
```

### 3. Add Coin to Favorites (Protected)
**POST** `/api/coins/favorites`

Add a cryptocurrency to user's favorites.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "coinId": "bitcoin"
}
```

**Response:**
```json
{
  "message": "Coin added to favorites",
  "userId": "uuid",
  "coinId": "bitcoin"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### Frontend Integration

#### Login
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Store JWT token
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.error);
  }
};
```

#### Making Authenticated Requests
```javascript
const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

#### Adding to Favorites
```javascript
const addToFavorites = async (coinId) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/coins/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ coinId }),
  });
  
  return response.json();
};
```

## Security Features

1. **JWT Tokens**: Secure token-based authentication
2. **Password Hashing**: Passwords are securely hashed using Supabase
3. **Email Verification**: Users must verify their email addresses
4. **Password Reset**: Secure password reset via email
5. **Token Expiration**: JWT tokens expire after 24 hours
6. **Protected Routes**: Sensitive endpoints require authentication

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Test the authentication endpoints
4. Implement frontend integration
5. Add database tables for user preferences and favorites
