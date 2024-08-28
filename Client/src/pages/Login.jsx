import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../context/TokenContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setToken}= useToken();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
          const accessToken = response.data.accessToken
         localStorage.setItem('accessToken', response.data.accessToken);
         localStorage.setItem('refreshToken', response.data.refreshToken);
         setToken(accessToken);
         navigate("/profile")
      } catch (error) {
        console.error('Login failed', error);
        alert('Login failed');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    );
}