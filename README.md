# Authentication and Authorization with JWT

This project demonstrates authentication and authorization using JSON Web Tokens (JWT) with secure password hashing and salting. It includes both traditional sign-in methods and Google OAuth2.0 for enhanced flexibility in user authentication.

## Features

- **Access and Refresh Tokens:**  
  Access tokens and refresh tokens are used for secure user authentication. Access tokens are stored in-memory using the React Context API, providing efficient and secure token management without exposing tokens in client-side storage. The refresh token is sent as an HttpOnly cookie to maintain security against client-side access.

- **Google OAuth2.0 Integration:**  
  Supports Google OAuth2.0, allowing users to authenticate using their Google accounts.

- **Salting and Hashing:**  
  Passwords are hashed and salted using a secure key derivation function, resistant to brute-force and hardware-based attacks.

- **In-Memory Token Storage (React Context):**  
  Access tokens are stored in-memory using the React Context API, preventing exposure in local storage or cookies. This reduces XSS risks and enhances security by keeping the token client-side only during the active session.

- **Middleware for Protected Routes:**  
  Server-side middleware is implemented to protect routes, ensuring only authenticated users can access specific resources by verifying the validity of JWT tokens.

## Technologies Used

- **Back-End:** Node.js, Express
- **Front-End:** React.js

## Routes

### Front-End

- `/signup` - Sign up page
- `/login` - Login page
- `/profile` - Profile page (protected)

### Back-End

- `auth/signup` - User registration endpoint
- `auth/login` - Login endpoint
- `auth/refreshToken` - Refresh token endpoint to renew access tokens
- `auth/google/callback` - Google authentication endpoin
- `user/profile` - Protected profile endpoint

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Getch-27/AuthenticationAndAuthorization.git
   cd AuthenticationAndAuthorization

   cd client
   npm install
   npm run dev

   cd server
   npm install
   npm start


