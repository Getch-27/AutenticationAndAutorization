# Authentication and Authorization with JWT

This project demonstrates authentication and authorization using JSON Web Tokens (JWT) with Argon2 hashing and salting for secure password storage. It includes:

- **Access and Refresh Tokens:** Access tokens and refresh tokens are used for secure user authentication. Access tokens are stored in-memory using React Context API for efficient and secure management. 
- **Argon2 Hashing and Salting:** Passwords are hashed and salted using Argon2, a secure key derivation function resistant to brute-force and hardware-based attacks.
- **Middleware for Protected Routes:** Middleware is implemented to protect server-side routes, ensuring that only authenticated users can access certain resources.
- **Technologies Used:** Node.js, Express, and React.js.

## Features

- **In-Memory Token Storage:** 
  - **Advantage:** Storing tokens in-memory using React Context API prevents tokens from being exposed in local storage or cookies, reducing the risk of XSS attacks and enhancing security.
  
- **Middleware for Route Protection:** 
  - Secure routes using server-side middleware that verifies the validity of JWT tokens before granting access.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Getch-27/AutenticationAndAutorization.git
   cd AutenticationAndAutorization
   cd client
   npm run dev

  ```bash
    cd server
    npm start

